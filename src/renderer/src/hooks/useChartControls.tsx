import { useCallback, useEffect, useRef, useState } from 'react'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { CHART_ACTION } from '@renderer/types/types'

export default function useChartControls() {
  const {
    globalChartsInfoDataRef,
    durationRef,
    globalChartActionCounterRef,
    globalMaxChartActionCounterRef,
    globalChartCompareCounterRef,
    globalMaxChartCompareCounterRef,
    defaultChartDataState,
    directionForwardRef,
    compareAsStepRef,
  } = useGlobalChartsInfo()
  const { algorithmsVisibilityData } = useAlgorithmsVisibility()
  const [globalChartActionCounterState, setGlobalChartActionCounterState] =
    useState<number>(() => globalChartActionCounterRef.current)
  const [globalChartCompareCounterState, setGlobalChartCompareCounterState] =
    useState<number>(() => globalChartCompareCounterRef.current)
  const [durationState, setDurationState] = useState<number>(
    () => durationRef.current,
  )
  const [compareAsStepState, setCompareAsStepState] = useState<boolean>(
    () => compareAsStepRef.current,
  )
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)
  const [isRunningState, setIsRunningState] = useState<boolean>(false)

  const setCompareStepAll = useCallback(
    (step: number) => {
      if (step > globalMaxChartCompareCounterRef.current) {
        directionForwardRef.current = true
        globalChartCompareCounterRef.current =
          globalMaxChartCompareCounterRef.current + 1
        setGlobalChartCompareCounterState(
          globalMaxChartCompareCounterRef.current + 1,
        )
        globalChartActionCounterRef.current =
          globalMaxChartActionCounterRef.current
        setGlobalChartActionCounterState(globalMaxChartActionCounterRef.current)
      } else {
        const newGlobalChartCompareCounter = Math.max(
          0,
          Math.min(step, globalMaxChartCompareCounterRef.current),
        )
        directionForwardRef.current =
          newGlobalChartCompareCounter > globalChartCompareCounterRef.current
        globalChartCompareCounterRef.current = newGlobalChartCompareCounter
        setGlobalChartCompareCounterState(newGlobalChartCompareCounter)
        globalChartActionCounterRef.current = 0
        setGlobalChartActionCounterState(0)
      }
    },
    [
      directionForwardRef,
      globalChartActionCounterRef,
      globalChartCompareCounterRef,
      globalMaxChartActionCounterRef,
      globalMaxChartCompareCounterRef,
    ],
  )

  const setStepAll = useCallback(
    (step: number) => {
      if (compareAsStepRef.current) {
        setCompareStepAll(step)
      } else {
        const newGlobalChartActionCounter = Math.max(
          0,
          Math.min(step, globalMaxChartActionCounterRef.current),
        )
        directionForwardRef.current =
          newGlobalChartActionCounter > globalChartActionCounterRef.current
        globalChartActionCounterRef.current = newGlobalChartActionCounter
        setGlobalChartActionCounterState(newGlobalChartActionCounter)
      }

      let areAllSorted = true
      globalChartsInfoDataRef.current.forEach((data) => {
        compareAsStepRef.current
          ? data.current.setCompareStep()
          : data.current.setStep()
        if (data.current.chartActionRef.current !== CHART_ACTION.FINISHED) {
          areAllSorted = false
        }
      })
      return areAllSorted
    },
    [
      compareAsStepRef,
      globalChartsInfoDataRef,
      setCompareStepAll,
      globalMaxChartActionCounterRef,
      directionForwardRef,
      globalChartActionCounterRef,
    ],
  )

  const handleStop = useCallback(() => {
    if (intervalRef.current) {
      isRunningRef.current = false
      setIsRunningState(isRunningRef.current)
      clearTimeout(intervalRef.current)
    }
  }, [])

  const continueSort = useCallback(
    (delay: number = durationRef.current) => {
      const isAnyAnimationRunning = globalChartsInfoDataRef.current.some(
        (algorithm) => algorithm.current.isRunningRef.current,
      )
      intervalRef.current = setTimeout(() => {
        if (isAnyAnimationRunning) {
          continueSort(50)
          return
        }
        isRunningRef.current = true
        setIsRunningState(isRunningRef.current)
        const areAllSorted = setStepAll(
          compareAsStepRef.current
            ? globalChartCompareCounterRef.current + 1
            : globalChartActionCounterRef.current + 1,
        )
        if (areAllSorted) {
          handleStop()
        } else {
          continueSort()
        }
      }, delay)
    },
    [
      compareAsStepRef,
      durationRef,
      globalChartActionCounterRef,
      globalChartCompareCounterRef,
      globalChartsInfoDataRef,
      handleStop,
      setStepAll,
    ],
  )

  const handleStart = useCallback(() => {
    handleStop()
    isRunningRef.current = true
    setIsRunningState(isRunningRef.current)
    setStepAll(
      compareAsStepRef.current
        ? globalChartCompareCounterRef.current + 1
        : globalChartActionCounterRef.current + 1,
    )
    continueSort()
  }, [
    compareAsStepRef,
    continueSort,
    globalChartActionCounterRef,
    globalChartCompareCounterRef,
    handleStop,
    setStepAll,
  ])

  const handleReset = useCallback(() => {
    handleStop()
    setStepAll(0)
  }, [handleStop, setStepAll])

  const handleSetStep = useCallback(
    (step: number) => {
      handleStop()
      setStepAll(step)
    },
    [handleStop, setStepAll],
  )

  const handleDurationChange = useCallback(
    (duration: number) => {
      durationRef.current = 250 / duration
      setDurationState(250 / duration)
      if (isRunningRef.current) {
        handleStop()
        continueSort()
      }
    },
    [continueSort, durationRef, handleStop],
  )

  const handleCompareAsStepChange = useCallback(() => {
    const newCompareAsStep = !compareAsStepRef.current
    compareAsStepRef.current = newCompareAsStep
    setCompareAsStepState(newCompareAsStep)
    handleReset()
  }, [compareAsStepRef, handleReset])

  const handlePrevious = useCallback(() => {
    handleStop()
    setStepAll(
      compareAsStepRef.current
        ? globalChartCompareCounterRef.current - 1
        : globalChartActionCounterRef.current - 1,
    )
  }, [
    compareAsStepRef,
    globalChartActionCounterRef,
    globalChartCompareCounterRef,
    handleStop,
    setStepAll,
  ])

  const handleNext = useCallback(() => {
    handleStop()
    setStepAll(
      compareAsStepRef.current
        ? globalChartCompareCounterRef.current + 1
        : globalChartActionCounterRef.current + 1,
    )
  }, [
    compareAsStepRef,
    globalChartActionCounterRef,
    globalChartCompareCounterRef,
    handleStop,
    setStepAll,
  ])

  useEffect(() => {
    handleReset()
  }, [defaultChartDataState, handleReset])

  useEffect(() => {
    if (algorithmsVisibilityData.every(({ visible }) => visible === false)) {
      handleStop()
    }
    setGlobalChartActionCounterState(globalChartActionCounterRef.current)
    setGlobalChartCompareCounterState(globalChartCompareCounterRef.current)
  }, [
    algorithmsVisibilityData,
    globalChartActionCounterRef,
    globalChartCompareCounterRef,
    handleStop,
  ])

  return {
    handleStart,
    handleStop,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
    globalChartActionCounterState,
    globalChartCompareCounterState,
    handlePrevious,
    handleNext,
    durationState,
    compareAsStepState,
    handleCompareAsStepChange,
  }
}
