import { useCallback } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import {
  CHART_ACTION,
  ChartAction,
  ChartDataField,
} from '@renderer/types/types'

interface CompareParams {
  chartData: ChartDataField[]
  first: number
  second: number
  chartAction: ChartAction
  duration: number
  isForward: boolean
}

function modifyChartFunction({
  chartData,
  first,
  second,
  chartAction,
  duration,
  isForward,
}: CompareParams) {
  const distance = (Math.abs(first - second) / chartData.length) * 100

  const transitionProperty =
    (chartAction === CHART_ACTION.ANIMATE_SWAP && isForward === true) ||
    (chartAction === CHART_ACTION.MATCH && isForward === false)
      ? 'transform'
      : 'none'

  const colorFirst =
    chartAction === CHART_ACTION.MATCH ||
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'var(--color-swap)'
      : 'var(--color-first)'

  const colorSecond =
    chartAction === CHART_ACTION.MATCH ||
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'var(--color-swap)'
      : 'var(--color-second)'

  const newChartData = chartData.map((data, index) => {
    return {
      ...data,
      fill:
        chartAction === CHART_ACTION.FINISHED
          ? 'var(--color-finished)'
          : index === first
            ? colorFirst
            : index === second
              ? colorSecond
              : 'var(--color-default)',
      style: {
        ...data.style,
        transitionProperty,
        transitionDuration: `${duration}ms`,
        transform:
          chartAction === CHART_ACTION.ANIMATE_SWAP
            ? index === first
              ? `translateX(${distance}%)`
              : index === second
                ? `translateX(-${distance}%)`
                : 'translateX(0%)'
            : 'translateX(0%)',
      },
    }
  })
  if (chartAction === CHART_ACTION.SWAP) {
    ;[newChartData[first], newChartData[second]] = [
      newChartData[second],
      newChartData[first],
    ]
  }
  return newChartData
}

export default function useModifyChart() {
  const { defaultChartData, directionForwardRef, durationRef } = useChartsInfo()
  const {
    chartDataRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    setChartActionCounter: setCompareActionCounter,
  } = useChartState()

  const modifyChart = useCallback(
    ({ chartData, first, second, compareAction }) => {
      if (compareAction !== CHART_ACTION.SWAP) {
        chartActionCounterRef.current += 1
      }
      if (compareAction === CHART_ACTION.COMPARE) {
        chartCompareCounterRef.current += 1
      }
      const duration = durationRef.current
      const isForward = directionForwardRef.current

      chartDataRef.current = modifyChartFunction({
        chartData,
        first,
        second,
        chartAction: compareAction,
        duration,
        isForward,
      })
      setCompareActionCounter(chartActionCounterRef.current)
    },
    [
      chartDataRef,
      chartActionCounterRef,
      directionForwardRef,
      durationRef,
      chartCompareCounterRef,
      setCompareActionCounter,
    ],
  )

  const reset = useCallback(() => {
    chartDataRef.current = defaultChartData
    chartActionCounterRef.current = 0
    chartCompareCounterRef.current = 0
    setCompareActionCounter(chartActionCounterRef.current)
  }, [
    chartDataRef,
    chartActionCounterRef,
    defaultChartData,
    chartCompareCounterRef,
    setCompareActionCounter,
  ])

  const compare = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: CHART_ACTION.COMPARE,
      }),
    [chartDataRef, modifyChart],
  )

  const match = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: CHART_ACTION.MATCH,
      }),
    [chartDataRef, modifyChart],
  )

  const animateSwap = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: CHART_ACTION.ANIMATE_SWAP,
      }),
    [chartDataRef, modifyChart],
  )

  const swap = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: CHART_ACTION.SWAP,
      }),
    [chartDataRef, modifyChart],
  )

  const finish = useCallback(
    () =>
      modifyChart({
        chartData: chartDataRef.current,
        first: 0,
        second: 0,
        compareAction: CHART_ACTION.FINISHED,
      }),
    [chartDataRef, modifyChart],
  )

  return {
    compare,
    match,
    animateSwap,
    swap,
    finish,
    reset,
  }
}
