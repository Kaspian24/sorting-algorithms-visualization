import { useCallback, useEffect, useRef, useState } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import {
  CHART_ACTION,
  ChartDataField,
  ChartInfoData,
  SortingAlgorithm,
} from '@renderer/types/types'

export default function useChartCard(sortingAlgorithm: SortingAlgorithm) {
  const {
    addChartInfoData,
    removeChartInfoData,
    getGlobalChartActionCounter,
    getDefaultChartData,
    defaultChartDataState,
    checkpointStepRef,
    directionForwardRef,
  } = useChartsInfo()
  const { sortFunction, reset } = sortingAlgorithm()
  const {
    getChartData,
    setChartData,
    getChartActionCounter,
    getChartCompareCounter,
    getMaxChartActionCounter,
    getMaxChartCompareCounter,
    chartActionRef,
    setMaxChartActionCounter,
    setMaxChartCompareCounter,
    linkChartDataSetState,
    chartCheckpointsRef,
    setChartActionCounter,
    setChartCompareCounter,
    sortVariablesRef,
  } = useChartState()

  const [chartDataState, setChartDataState] = useState<ChartDataField[]>(() =>
    getChartData(),
  )

  useEffect(() => {
    linkChartDataSetState(setChartDataState)
  }, [linkChartDataSetState])

  const addCheckpoint = useCallback(() => {
    if (getChartActionCounter() % checkpointStepRef.current === 0) {
      chartCheckpointsRef.current.push({
        checkpoint: getChartActionCounter() / checkpointStepRef.current,
        data: getChartData(),
        sortVariables: structuredClone(sortVariablesRef.current),
        chartActionCounter: getChartActionCounter(),
        chartCompareCounter: getChartCompareCounter(),
        chartAction: chartActionRef.current,
      })
    }
  }, [
    chartActionRef,
    chartCheckpointsRef,
    checkpointStepRef,
    getChartActionCounter,
    getChartCompareCounter,
    getChartData,
    sortVariablesRef,
  ])

  const goToCheckpoint = useCallback(
    (checkpoint: number) => {
      let realCheckpoint = checkpoint
      if (checkpoint > chartCheckpointsRef.current.length - 1) {
        realCheckpoint = chartCheckpointsRef.current.length - 1
      }
      const {
        data,
        sortVariables,
        chartActionCounter,
        chartCompareCounter,
        chartAction,
      } = chartCheckpointsRef.current[realCheckpoint]
      setChartData(data)
      sortVariablesRef.current = structuredClone(sortVariables)
      setChartActionCounter(chartActionCounter)
      setChartCompareCounter(chartCompareCounter)
      chartActionRef.current = chartAction
      return true
    },
    [
      chartActionRef,
      chartCheckpointsRef,
      setChartActionCounter,
      setChartCompareCounter,
      setChartData,
      sortVariablesRef,
    ],
  )

  const nextStep = useCallback(
    (step: number) => {
      const currentStep = getChartActionCounter()
      if (
        step - 1 === currentStep ||
        getMaxChartActionCounter() - 1 === getChartActionCounter()
      ) {
        sortFunction()
      } else {
        sortFunction(true)
      }
    },
    [getChartActionCounter, getMaxChartActionCounter, sortFunction],
  )

  const setStep = useCallback(() => {
    let step = getGlobalChartActionCounter()
    if (step > getMaxChartActionCounter()) {
      if (chartActionRef.current === CHART_ACTION.FINISHED) {
        return
      }
      step = getMaxChartActionCounter()
    }
    const closestCheckpoint = Math.floor(step / checkpointStepRef.current)
    if (step < getChartActionCounter()) {
      directionForwardRef.current = false
    } else {
      directionForwardRef.current = true
    }
    if (
      step < closestCheckpoint * checkpointStepRef.current ||
      step < getChartActionCounter()
    ) {
      goToCheckpoint(closestCheckpoint)
    }
    while (
      step > getChartActionCounter() &&
      chartActionRef.current !== CHART_ACTION.FINISHED
    ) {
      nextStep(step)
    }
  }, [
    chartActionRef,
    checkpointStepRef,
    directionForwardRef,
    getChartActionCounter,
    getGlobalChartActionCounter,
    getMaxChartActionCounter,
    goToCheckpoint,
    nextStep,
  ])

  const controlData = useRef<ChartInfoData>({
    sortFunction,
    reset,
    getChartData,
    getChartActionCounter,
    getChartCompareCounter,
    getMaxChartActionCounter,
    getMaxChartCompareCounter,
    chartActionRef,
    goToCheckpoint,
    setStep,
  })

  useEffect(() => {
    chartCheckpointsRef.current = []
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      addCheckpoint()
      if (
        getChartActionCounter() % checkpointStepRef.current ===
        checkpointStepRef.current - 1
      ) {
        sortFunction()
      } else {
        sortFunction(true)
      }
    }
    addCheckpoint()
    setMaxChartActionCounter(getChartActionCounter())
    setMaxChartCompareCounter(getChartCompareCounter())
    reset()

    while (
      getChartActionCounter() < getGlobalChartActionCounter() &&
      chartActionRef.current !== CHART_ACTION.FINISHED
    ) {
      if (
        getChartActionCounter() === getMaxChartActionCounter() - 1 ||
        getChartActionCounter() === getGlobalChartActionCounter() - 1
      ) {
        sortFunction()
      } else {
        sortFunction(true)
      }
    }

    addChartInfoData(controlData)

    return () => {
      removeChartInfoData(controlData)
      setChartData(getDefaultChartData())
      reset()
    }
  }, [
    addChartInfoData,
    chartActionRef,
    removeChartInfoData,
    reset,
    sortFunction,
    getGlobalChartActionCounter,
    setMaxChartActionCounter,
    getChartActionCounter,
    setMaxChartCompareCounter,
    getChartCompareCounter,
    defaultChartDataState,
    setChartData,
    getDefaultChartData,
    getMaxChartActionCounter,
    chartCheckpointsRef,
    getChartData,
    checkpointStepRef,
    sortVariablesRef,
    addCheckpoint,
  ])

  return {
    chartDataState,
  }
}
