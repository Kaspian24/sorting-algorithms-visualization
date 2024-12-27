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
    defaultChartDataState,
  } = useGlobalChartsInfo()
  const { algorithmsVisibilityData } = useAlgorithmsVisibility()
  const [globalChartActionCounterState, setGlobalChartActionCounterState] =
    useState<number>(() => globalChartActionCounterRef.current)
  const [durationState, setDurationState] = useState<number>(
    () => durationRef.current,
  )
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)
  const [isRunningState, setIsRunningState] = useState<boolean>(false)

  const setStepAll = useCallback(
    (step: number) => {
      const newGlobalChartActionCounter = Math.max(
        0,
        Math.min(step, globalMaxChartActionCounterRef.current),
      )
      globalChartActionCounterRef.current = newGlobalChartActionCounter
      setGlobalChartActionCounterState(newGlobalChartActionCounter)
      let areAllSorted = true
      globalChartsInfoDataRef.current.forEach((data) => {
        data.current.setStep()
        if (data.current.chartActionRef.current !== CHART_ACTION.FINISHED) {
          areAllSorted = false
        }
      })
      return areAllSorted
    },
    [
      globalChartsInfoDataRef,
      globalMaxChartActionCounterRef,
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

  const continueSort = useCallback(() => {
    intervalRef.current = setTimeout(() => {
      isRunningRef.current = true
      setIsRunningState(isRunningRef.current)
      const areAllSorted = setStepAll(globalChartActionCounterRef.current + 1)
      if (areAllSorted) {
        handleStop()
      } else {
        continueSort()
      }
    }, durationRef.current)
  }, [durationRef, globalChartActionCounterRef, handleStop, setStepAll])

  const handleStart = useCallback(() => {
    handleStop()
    isRunningRef.current = true
    setIsRunningState(isRunningRef.current)
    setStepAll(globalChartActionCounterRef.current + 1)
    continueSort()
  }, [continueSort, globalChartActionCounterRef, handleStop, setStepAll])

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

  const handlePrevious = useCallback(() => {
    handleStop()
    setStepAll(globalChartActionCounterRef.current - 1)
  }, [globalChartActionCounterRef, handleStop, setStepAll])

  const handleNext = useCallback(() => {
    handleStop()
    setStepAll(globalChartActionCounterRef.current + 1)
  }, [globalChartActionCounterRef, handleStop, setStepAll])

  useEffect(() => {
    handleReset()
  }, [defaultChartDataState, handleReset])

  useEffect(() => {
    if (algorithmsVisibilityData.every(({ visible }) => visible === false)) {
      handleStop()
    }
    setGlobalChartActionCounterState(globalChartActionCounterRef.current)
  }, [algorithmsVisibilityData, globalChartActionCounterRef, handleStop])

  return {
    handleStart,
    handleStop,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
    globalChartActionCounterState,
    handlePrevious,
    handleNext,
    durationState,
  }
}
