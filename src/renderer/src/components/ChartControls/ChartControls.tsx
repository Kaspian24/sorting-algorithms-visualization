import { useRef, useState } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import { Button } from '@renderer/components/ui/Button'
import { COMPARE_ACTION } from '@renderer/types/types'

export default function ChartControls() {
  const {
    controlData,
    durationRef,
    compareActionCounterRef,
    maxCompareActionCounterRef,
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
    handleStop()
    sortAll()
  }

  function handleReset() {
    handleStop()
    resetAll()
  }

  function handleSetStep(step: number) {
    handleReset()
    while (compareActionCounterRef.current < step) {
      const areAllSorted = sortAll()
      if (areAllSorted) {
        break
      }
    }
  }

  return (
    <>
      <p>
        {compareActionCounterRef.current}/{maxCompareActionCounterRef.current}
      </p>
      <Button onClick={handleStart}>start</Button>
      <Button onClick={handleStop}>stop</Button>
      <Button
        onClick={() => handleSetStep(compareActionCounterRef.current - 1)}
      >
        previous
      </Button>
      <Button onClick={handleNext}>next</Button>
      <Button onClick={handleReset}>reset</Button>
      <Button onClick={() => handleSetStep(150)}>set step</Button>
      <Button
        onClick={() => {
          durationRef.current = 250
          if (isRunningRef.current) {
            handleStop()
            continueSort()
          }
        }}
      >
        speedUp
      </Button>
      <Button
        onClick={() => {
          durationRef.current = 2000
          if (isRunningRef.current) {
            handleStop()
            continueSort()
          }
        }}
      >
        speedDown
      </Button>
    </>
  )
}
