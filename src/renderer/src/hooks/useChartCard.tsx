import { useCallback, useEffect, useRef, useState } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import {
  CHART_ACTION,
  ChartData,
  ChartInfoData,
  SortingAlgorithm,
} from '@renderer/types/types'

export default function useChartCard(sortingAlgorithm: SortingAlgorithm) {
  const {
    addChartInfoData,
    removeChartInfoData,
    globalChartActionCounterRef,
    defaultChartDataRef,
    defaultChartDataState,
    checkpointStepRef,
    directionForwardRef,
  } = useGlobalChartsInfo()
  const { sortFunction, reset, info } = sortingAlgorithm()
  const {
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef,
    chartCheckpointsRef,
    sortVariablesRef,
  } = useChartInfo()

  const [maxChartActionCounterState, setMaxChartActionCounterState] =
    useState<number>(0)
  const [maxChartCompareCounterState, setMaxChartCompareCounterState] =
    useState<number>(0)

  const [chartDataState, setChartDataState] = useState<ChartData>(
    () => chartDataRef.current,
  )
  const [chartActionCounterState, setChartActionCounterState] =
    useState<number>(() => chartActionCounterRef.current)
  const [chartCompareCounterState, setChartCompareCounterState] =
    useState<number>(() => chartCompareCounterRef.current)

  const updateStates = useCallback(() => {
    setChartDataState({ ...chartDataRef.current })
    setChartActionCounterState(chartActionCounterRef.current)
    setChartCompareCounterState(chartCompareCounterRef.current)
  }, [chartActionCounterRef, chartCompareCounterRef, chartDataRef])

  const addCheckpoint = useCallback(() => {
    if (chartActionCounterRef.current % checkpointStepRef.current === 0) {
      chartCheckpointsRef.current.push({
        checkpoint: chartActionCounterRef.current / checkpointStepRef.current,
        data: chartDataRef.current,
        sortVariables: {
          ...structuredClone(sortVariablesRef.current),
          returned: true,
        },
        chartActionCounter: chartActionCounterRef.current,
        chartCompareCounter: chartCompareCounterRef.current,
        chartAction: chartActionRef.current,
      })
    }
  }, [
    chartActionRef,
    chartCheckpointsRef,
    checkpointStepRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    chartDataRef,
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
      chartDataRef.current = data
      sortVariablesRef.current = structuredClone(sortVariables)
      chartActionCounterRef.current = chartActionCounter
      chartCompareCounterRef.current = chartCompareCounter
      chartActionRef.current = chartAction
      return true
    },
    [
      chartActionRef,
      chartCheckpointsRef,
      chartActionCounterRef,
      chartCompareCounterRef,
      chartDataRef,
      sortVariablesRef,
    ],
  )

  const setStep = useCallback(() => {
    let step = globalChartActionCounterRef.current
    if (step > maxChartActionCounterRef.current) {
      if (chartActionRef.current === CHART_ACTION.FINISHED) {
        return
      }
      step = maxChartActionCounterRef.current
    }
    const closestCheckpoint = Math.floor(step / checkpointStepRef.current)
    if (step < chartActionCounterRef.current) {
      directionForwardRef.current = false
    } else {
      directionForwardRef.current = true
    }
    if (
      step < closestCheckpoint * checkpointStepRef.current ||
      step < chartActionCounterRef.current
    ) {
      goToCheckpoint(closestCheckpoint)
    }
    while (
      step > chartActionCounterRef.current &&
      chartActionRef.current !== CHART_ACTION.FINISHED
    ) {
      sortFunction()
    }

    updateStates()
  }, [
    chartActionCounterRef,
    chartActionRef,
    checkpointStepRef,
    directionForwardRef,
    globalChartActionCounterRef,
    goToCheckpoint,
    maxChartActionCounterRef,
    sortFunction,
    updateStates,
  ])

  const controlData = useRef<ChartInfoData>({
    sortFunction,
    reset,
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef,
    goToCheckpoint,
    setStep,
  })

  useEffect(() => {
    chartCheckpointsRef.current = []
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      addCheckpoint()
      sortFunction()
    }
    addCheckpoint()
    maxChartActionCounterRef.current = chartActionCounterRef.current
    maxChartCompareCounterRef.current = chartCompareCounterRef.current
    chartDataRef.current = defaultChartDataRef.current
    chartActionCounterRef.current = 0
    chartCompareCounterRef.current = 0
    reset()

    while (
      chartActionCounterRef.current < globalChartActionCounterRef.current &&
      chartActionRef.current !== CHART_ACTION.FINISHED
    ) {
      sortFunction()
    }

    addChartInfoData(controlData)

    setMaxChartActionCounterState(maxChartActionCounterRef.current)
    setMaxChartCompareCounterState(maxChartCompareCounterRef.current)
    updateStates()

    return () => {
      removeChartInfoData(controlData)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chartDataRef.current = defaultChartDataRef.current
      chartActionCounterRef.current = 0
      chartCompareCounterRef.current = 0
      reset()
    }
  }, [
    defaultChartDataState,
    addChartInfoData,
    addCheckpoint,
    chartActionCounterRef,
    chartActionRef,
    chartCheckpointsRef,
    chartCompareCounterRef,
    chartDataRef,
    checkpointStepRef,
    defaultChartDataRef,
    globalChartActionCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    removeChartInfoData,
    reset,
    sortFunction,
    updateStates,
  ])

  return {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
    info,
  }
}
