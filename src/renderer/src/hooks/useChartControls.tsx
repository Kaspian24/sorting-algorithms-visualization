import { useCallback, useEffect, useRef, useState } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { CHART_ACTION } from '@renderer/types/types'

export default function useChartControls() {
  const {
    chartInfoData,
    durationRef,
    getGlobalChartActionCounter,
    setGlobalChartActionCounter,
    linkGlobalChartActionCounterSetState,
    getGlobalMaxChartActionCounter,
    directionForwardRef,
    defaultChartDataState,
    algorithmsVisibilityData,
  } = useChartsInfo()
  const [globalChartActionCounterState, setGlobalChartActionCounterState] =
    useState<number>(() => getGlobalChartActionCounter())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)
  const [isRunningState, setIsRunningState] = useState<boolean>(false)

  const setStepAll = useCallback(
    (step: number) => {
      setGlobalChartActionCounter(
        Math.max(0, Math.min(step, getGlobalMaxChartActionCounter())),
      )
      let areAllSorted = true
      chartInfoData.current.forEach((data) => {
        data.current.setStep()
        if (data.current.chartActionRef.current !== CHART_ACTION.FINISHED) {
          areAllSorted = false
        }
      })
      return areAllSorted
    },
    [
      chartInfoData,
      getGlobalMaxChartActionCounter,
      setGlobalChartActionCounter,
    ],
  )

  const resetAll = useCallback(() => {
    setGlobalChartActionCounter(0)
    chartInfoData.current.forEach((data) => {
      data.current.reset()
    })
  }, [chartInfoData, setGlobalChartActionCounter])

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
      const areAllSorted = setStepAll(getGlobalChartActionCounter() + 1)
      if (areAllSorted) {
        handleStop()
      } else {
        continueSort()
      }
    }, durationRef.current)
  }, [durationRef, getGlobalChartActionCounter, handleStop, setStepAll])

  const handleStart = useCallback(() => {
    directionForwardRef.current = true
    handleStop()
    isRunningRef.current = true
    setIsRunningState(isRunningRef.current)
    setStepAll(getGlobalChartActionCounter() + 1)
    continueSort()
  }, [
    continueSort,
    directionForwardRef,
    getGlobalChartActionCounter,
    handleStop,
    setStepAll,
  ])

  const handleReset = useCallback(() => {
    handleStop()
    resetAll()
  }, [handleStop, resetAll])

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
      if (isRunningRef.current) {
        handleStop()
        continueSort()
      }
    },
    [continueSort, durationRef, handleStop],
  )

  useEffect(() => {
    handleReset()
  }, [defaultChartDataState, handleReset])

  const handlePrevious = useCallback(() => {
    handleStop()
    setStepAll(getGlobalChartActionCounter() - 1)
  }, [getGlobalChartActionCounter, handleStop, setStepAll])

  const handleNext = useCallback(() => {
    handleStop()
    setStepAll(getGlobalChartActionCounter() + 1)
  }, [getGlobalChartActionCounter, handleStop, setStepAll])

  useEffect(() => {
    if (algorithmsVisibilityData.every(({ visible }) => visible === false)) {
      handleStop()
    }
  }, [algorithmsVisibilityData, handleStop])

  useEffect(() => {
    linkGlobalChartActionCounterSetState(setGlobalChartActionCounterState)
  }, [linkGlobalChartActionCounterSetState])

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
  }
}
