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
    checkpointStepRef,
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

  const handleReset = useCallback(() => {
    handleStop()
    resetAll()
    setTempStep(0)
  }, [handleStop, resetAll])

  const goToCheckpointAll = useCallback(
    (checkpoint: number) => {
      chartInfoData.current.forEach((data) => {
        data.current.goToCheckpoint(checkpoint)
      })
    },
    [chartInfoData],
  )

  const handleSetStep = useCallback(
    (step: number) => {
      handleStop()
      const closestCheckpoint = Math.floor(step / checkpointStepRef.current)
      directionForwardRef.current = getGlobalChartActionCounter() < step
      if (
        !directionForwardRef.current ||
        getGlobalChartActionCounter() <
          closestCheckpoint * checkpointStepRef.current
      ) {
        goToCheckpointAll(closestCheckpoint)
        setGlobalChartActionCounter(
          closestCheckpoint * checkpointStepRef.current,
        )
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
      checkpointStepRef,
      directionForwardRef,
      getGlobalChartActionCounter,
      goToCheckpointAll,
      handleStop,
      setGlobalChartActionCounter,
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

  const handlePrevious = useCallback(() => {
    if (isRunningRef.current) {
      setTempStep(Math.max(getGlobalChartActionCounter() - 1, 0))
    } else {
      setTempStep((prev) => Math.max(prev - 1, 0))
    }
  }, [getGlobalChartActionCounter])

  const handleNext = useCallback(() => {
    if (isRunningRef.current) {
      setTempStep(
        Math.min(
          getGlobalChartActionCounter() + 1,
          getGlobalMaxChartActionCounter(),
        ),
      )
    } else {
      setTempStep((prev) =>
        Math.min(prev + 1, getGlobalMaxChartActionCounter()),
      )
    }
  }, [getGlobalChartActionCounter, getGlobalMaxChartActionCounter])

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
    handleReset,
    handleSetStep,
    handleDurationChange,
    isRunningState,
    setTempStep,
    globalChartActionCounterState,
    handlePrevious,
    handleNext,
  }
}
