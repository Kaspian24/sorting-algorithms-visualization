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
    globalChartCompareCounterRef,
    durationRef,
    compareAsStepRef,
  } = useGlobalChartsInfo()
  const { sortFunctionGeneratorRef, reset, info, code, AdditionalInfo } =
    useSort()
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const savedChartStates = useRef<SavedChartState[]>([])

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
      resetSort()
    } else {
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
    globalChartActionCounterRef,
    maxChartActionCounterRef,
    nextStep,
    resetSort,
    updateStates,
  ])

  interface SavedChartState {
    chartData: ChartData
    chartActionCounter: number
    chartCompareCounter: number
  }

  const displayState = useCallback((state: SavedChartState) => {
    setChartDataState(state.chartData)
    setChartActionCounterState(state.chartActionCounter)
    setChartCompareCounterState(state.chartCompareCounter)
  }, [])

  const setCompareStep = useCallback(() => {
    let oldSavedChartStates: SavedChartState[] = savedChartStates.current
    let step = globalChartCompareCounterRef.current
    const difference = step - chartCompareCounterRef.current

    if (step > maxChartCompareCounterRef.current) {
      if (chartActionRef.current === CHART_ACTION.FINISHED) {
        return
      }
      step = maxChartCompareCounterRef.current + 1
    }
    if (
      step < chartCompareCounterRef.current ||
      (step === chartCompareCounterRef.current &&
        chartActionRef.current === CHART_ACTION.FINISHED)
    ) {
      resetSort()
    } else {
      step -= chartCompareCounterRef.current
    }
    savedChartStates.current = []
    while (step > 0) {
      nextStep()
      chartActionCounterRef.current++
      if (
        chartDataRef.current.visualization.action === CHART_ACTION.COMPARE ||
        chartActionRef.current === CHART_ACTION.FINISHED
      ) {
        step--
      }

      if (step <= 1) {
        savedChartStates.current.push({
          chartData: { ...chartDataRef.current },
          chartActionCounter: chartActionCounterRef.current,
          chartCompareCounter: chartCompareCounterRef.current,
        })
      }
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
      isRunningRef.current = false
    }

    if (difference === -1 || difference === 0) {
      oldSavedChartStates.pop()
      oldSavedChartStates.reverse()
      const newDataLength = savedChartStates.current.length
      if (newDataLength) {
        oldSavedChartStates.push(savedChartStates.current[newDataLength - 1])
      }
    } else if (difference === 1) {
      oldSavedChartStates = savedChartStates.current
    } else {
      oldSavedChartStates = []
    }

    let i = 0
    const processNextState = () => {
      if (oldSavedChartStates.length <= i) {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current)
          isRunningRef.current = false
        }
        return
      }

      displayState(oldSavedChartStates[i])
      i++
      intervalRef.current = setTimeout(processNextState, durationRef.current)
    }

    if (oldSavedChartStates.length === 0) {
      updateStates()
    } else {
      isRunningRef.current = true
      processNextState()
    }
  }, [
    globalChartCompareCounterRef,
    maxChartCompareCounterRef,
    chartCompareCounterRef,
    chartActionRef,
    resetSort,
    nextStep,
    chartActionCounterRef,
    chartDataRef,
    displayState,
    durationRef,
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
    setCompareStep,
    isRunningRef,
  })

  useEffect(() => {
    while (chartActionRef.current !== CHART_ACTION.FINISHED) {
      nextStep()
      chartActionCounterRef.current++
    }
    maxChartActionCounterRef.current = chartActionCounterRef.current
    maxChartCompareCounterRef.current = chartCompareCounterRef.current
    resetSort()

    if (compareAsStepRef.current) {
      setCompareStep()
    } else {
      setStep()
    }

    addChartInfoData(controlData)

    setMaxChartActionCounterState(maxChartActionCounterRef.current)
    setMaxChartCompareCounterState(maxChartCompareCounterRef.current)
    updateStates()

    return () => {
      isRunningRef.current = false
      removeChartInfoData(controlData)
      resetSort()
    }
  }, [
    addChartInfoData,
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    compareAsStepRef,
    defaultChartDataState,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    nextStep,
    removeChartInfoData,
    resetSort,
    setCompareStep,
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
    code,
    AdditionalInfo,
  }
}
