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
    goToCheckpoint,
    sortVariablesRef,
  } = useChartState()

  const [chartDataState, setChartDataState] = useState<ChartDataField[]>(() =>
    getChartData(),
  )

  useEffect(() => {
    linkChartDataSetState(setChartDataState)
  }, [linkChartDataSetState])

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
  })

  const addCheckpoint = useCallback(() => {
    if (getChartActionCounter() % checkpointStepRef.current === 0) {
      chartCheckpointsRef.current.push({
        checkpoint: getChartActionCounter() / checkpointStepRef.current,
        data: getChartData(),
        sortVariables: sortVariablesRef.current,
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
      setChartData([...getDefaultChartData()])
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
