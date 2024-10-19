import { useRef, useState } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import { COMPARE_ACTION } from '@renderer/types/types'

export default function useChartControls() {
  const {
    controlData,
    durationRef,
    compareActionCounterRef,
    maxCompareActionCounterRef,
    directionForwardRef,
  } = useChartControl()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const [, setCompareActionCounter] = useState(0) // trigger re-render

  /** returns `areAllSorted` */
  function sortAll() {
    let areAllSorted = true
    controlData.current.forEach((data) => {
      data.sortFunction()
      if (data.compareActionRef.current !== COMPARE_ACTION.FINISHED) {
        areAllSorted = false
      }
    })
    compareActionCounterRef.current += 1
    if (areAllSorted) {
      compareActionCounterRef.current = maxCompareActionCounterRef.current
    }
    setCompareActionCounter(compareActionCounterRef.current)
    return areAllSorted
  }

  function resetAll() {
    compareActionCounterRef.current = 0
    setCompareActionCounter(compareActionCounterRef.current)
    controlData.current.forEach((data) => {
      data.reset()
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
    directionForwardRef.current = compareActionCounterRef.current < step
    if (!directionForwardRef.current) {
      handleReset()
    }
    while (compareActionCounterRef.current < step) {
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
    compareActionCounterRef,
    maxCompareActionCounterRef,
  }
}
