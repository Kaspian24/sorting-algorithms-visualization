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

  /** returns `areAllSorted` */
  const sortAll = useCallback(
    (dryRun: boolean = false) => {
      let areAllSorted = true
      chartInfoData.current.forEach((data) => {
        if (
          data.current.getChartActionCounter() ===
            data.current.getMaxChartActionCounter() - 1 &&
          dryRun
        ) {
          data.current.sortFunction()
        } else {
          data.current.sortFunction(dryRun)
        }
        if (data.current.chartActionRef.current !== CHART_ACTION.FINISHED) {
          areAllSorted = false
        }
      })
      setGlobalChartActionCounter(getGlobalChartActionCounter() + 1)
      if (areAllSorted) {
        setGlobalChartActionCounter(getGlobalMaxChartActionCounter())
      }
      return areAllSorted
    },
    [
      chartInfoData,
      getGlobalChartActionCounter,
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
      const areAllSorted = sortAll()
      if (areAllSorted) {
        handleStop()
      }
      continueSort()
    }, durationRef.current)
  }, [durationRef, handleStop, sortAll])

  const handleStart = useCallback(() => {
    directionForwardRef.current = true
    handleStop()
    isRunningRef.current = true
    setIsRunningState(isRunningRef.current)
    sortAll()
    continueSort()
  }, [continueSort, directionForwardRef, handleStop, sortAll])

  const handleNext = useCallback(() => {
    directionForwardRef.current = true
    handleStop()
    sortAll()
  }, [directionForwardRef, handleStop, sortAll])

  const handleReset = useCallback(() => {
    handleStop()
    resetAll()
  }, [handleStop, resetAll])

  const handleSetStep = useCallback(
    (step: number) => {
      handleStop()
      directionForwardRef.current = getGlobalChartActionCounter() < step
      if (!directionForwardRef.current) {
        handleReset()
      }
      while (getGlobalChartActionCounter() < step - 1) {
        const areAllSorted = sortAll(true)
        if (areAllSorted) {
          break
        }
      }
      while (getGlobalChartActionCounter() < step) {
        const areAllSorted = sortAll()
        if (areAllSorted) {
          break
        }
      }
    },
    [
      directionForwardRef,
      getGlobalChartActionCounter,
      handleReset,
      handleStop,
      sortAll,
    ],
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

  const [tempStep, setTempStep] = useState(0)

  useEffect(() => {
    handleSetStep(tempStep)
  }, [handleSetStep, tempStep])

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
    handleNext,
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
    setTempStep,
    globalChartActionCounterState,
  }
}
