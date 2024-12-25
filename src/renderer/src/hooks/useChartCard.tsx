import { useCallback, useEffect, useRef, useState } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import {
  CHART_ACTION,
  ChartData,
  ChartInfoData,
  UseSort,
} from '@renderer/types/types'
import { visualizeChartDataFields } from '@renderer/utils/modifyChartData'

export default function useChartCard(useSort: UseSort) {
  const {
    addChartInfoData,
    removeChartInfoData,
    globalChartActionCounterRef,
    defaultChartDataRef,
    defaultChartDataState,
    directionForwardRef,
  } = useGlobalChartsInfo()
  const { sortFunctionGeneratorRef, reset, info } = useSort()
  const {
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef,
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

  const resetSort = useCallback(() => {
    chartDataRef.current = defaultChartDataRef.current
    chartActionCounterRef.current = 0
    chartCompareCounterRef.current = 0
    chartActionRef.current = CHART_ACTION.DEFAULT
    reset()
  }, [
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    defaultChartDataRef,
    reset,
  ])

  const nextStep = useCallback(() => {
    const result = sortFunctionGeneratorRef.current.next()
    if (result.done) {
      visualizeChartDataFields(
        chartDataRef,
        chartCompareCounterRef,
        CHART_ACTION.FINISHED,
        [],
      )
      chartActionRef.current = CHART_ACTION.FINISHED
    }
  }, [
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    sortFunctionGeneratorRef,
  ])

  const setStep = useCallback(() => {
    let step = globalChartActionCounterRef.current
    if (step > maxChartActionCounterRef.current) {
      if (chartActionRef.current === CHART_ACTION.FINISHED) {
        return
      }
      step = maxChartActionCounterRef.current
    }
    if (step < chartActionCounterRef.current) {
      directionForwardRef.current = false
      resetSort()
    } else {
      directionForwardRef.current = true
      step -= chartActionCounterRef.current
    }
    while (step > 0) {
      nextStep()
      chartActionCounterRef.current++
      step--
    }

    updateStates()
  }, [
    chartActionCounterRef,
    chartActionRef,
    directionForwardRef,
    globalChartActionCounterRef,
    maxChartActionCounterRef,
    nextStep,
    resetSort,
    updateStates,
  ])

  const controlData = useRef<ChartInfoData>({
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartActionRef,
    setStep,
  })

  useEffect(() => {
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      nextStep()
      chartActionCounterRef.current++
    }
    maxChartActionCounterRef.current = chartActionCounterRef.current
    maxChartCompareCounterRef.current = chartCompareCounterRef.current
    resetSort()

    setStep()

    addChartInfoData(controlData)

    setMaxChartActionCounterState(maxChartActionCounterRef.current)
    setMaxChartCompareCounterState(maxChartCompareCounterRef.current)
    updateStates()

    return () => {
      removeChartInfoData(controlData)
      resetSort()
    }
  }, [
    addChartInfoData,
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    defaultChartDataState,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    nextStep,
    removeChartInfoData,
    resetSort,
    setStep,
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
