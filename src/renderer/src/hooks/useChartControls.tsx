import { useRef } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { CHART_ACTION } from '@renderer/types/types'

export default function useChartControls() {
  const {
    chartInfoData,
    durationRef,
    getGlobalChartActionCounter,
    setGlobalChartActionCounter,
    getGlobalMaxChartActionCounter,
    directionForwardRef,
  } = useChartsInfo()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  /** returns `areAllSorted` */
  function sortAll() {
    let areAllSorted = true
    chartInfoData.current.forEach((data) => {
      data.current.sortFunction()
      if (data.current.chartActionRef.current !== CHART_ACTION.FINISHED) {
        areAllSorted = false
      }
    })
    setGlobalChartActionCounter(getGlobalChartActionCounter() + 1)
    if (areAllSorted) {
      setGlobalChartActionCounter(getGlobalMaxChartActionCounter())
    }
    return areAllSorted
  }

  function resetAll() {
    setGlobalChartActionCounter(0)
    chartInfoData.current.forEach((data) => {
      data.current.reset()
    })
  }

  function handleStart() {
    directionForwardRef.current = true
    handleStop()
    isRunningRef.current = true
    sortAll()
    continueSort()
  }

  function continueSort() {
    intervalRef.current = setTimeout(() => {
      isRunningRef.current = true
      const areAllSorted = sortAll()
      if (areAllSorted) {
        handleStop()
      }
      continueSort()
    }, durationRef.current)
  }

  function handleStop() {
    if (intervalRef.current) {
      isRunningRef.current = false
      clearTimeout(intervalRef.current)
    }
  }

  function handleNext() {
    directionForwardRef.current = true
    handleStop()
    sortAll()
  }

  function handleReset() {
    handleStop()
    resetAll()
  }

  function handleSetStep(step: number) {
    handleStop()
    directionForwardRef.current = getGlobalChartActionCounter() < step
    if (!directionForwardRef.current) {
      handleReset()
    }
    while (getGlobalChartActionCounter() < step) {
      const areAllSorted = sortAll()
      if (areAllSorted) {
        break
      }
    }
  }

  function handleDurationChange(duration: number) {
    durationRef.current = 250 / duration
    if (isRunningRef.current) {
      handleStop()
      continueSort()
    }
  }

  return {
    handleStart,
    handleStop,
    handleNext,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningRef,
  }
}
