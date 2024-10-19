import { useRef, useState } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { COMPARE_ACTION } from '@renderer/types/types'

export default function useChartControls() {
  const {
    chartInfoData: controlData,
    durationRef,
    globalCompareActionCounterRef,
    globalMaxCompareActionCounterRef,
    directionForwardRef,
  } = useChartsInfo()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const [, setCompareActionCounter] = useState(0) // trigger re-render

  /** returns `areAllSorted` */
  function sortAll() {
    let areAllSorted = true
    controlData.current.forEach((data) => {
      data.current.sortFunction()
      if (data.current.compareActionRef.current !== COMPARE_ACTION.FINISHED) {
        areAllSorted = false
      }
    })
    globalCompareActionCounterRef.current += 1
    if (areAllSorted) {
      globalCompareActionCounterRef.current =
        globalMaxCompareActionCounterRef.current
    }
    setCompareActionCounter(globalCompareActionCounterRef.current)
    return areAllSorted
  }

  function resetAll() {
    globalCompareActionCounterRef.current = 0
    setCompareActionCounter(globalCompareActionCounterRef.current)
    controlData.current.forEach((data) => {
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
    directionForwardRef.current = globalCompareActionCounterRef.current < step
    if (!directionForwardRef.current) {
      handleReset()
    }
    while (globalCompareActionCounterRef.current < step) {
      const areAllSorted = sortAll()
      if (areAllSorted) {
        break
      }
    }
  }

  function handleDurationChange(duration: number) {
    durationRef.current = duration
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
  }
}
