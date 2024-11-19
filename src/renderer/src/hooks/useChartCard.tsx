import { useEffect, useRef, useState } from 'react'
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
  })

  useEffect(() => {
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      sortFunction(true)
    }
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
  ])

  return {
    chartDataState,
  }
}
