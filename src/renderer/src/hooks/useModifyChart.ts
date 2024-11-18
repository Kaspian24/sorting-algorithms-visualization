import { useCallback } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import {
  CHART_ACTION,
  ChartAction,
  ChartDataField,
} from '@renderer/types/types'

interface ModifyChartFunctionParams {
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
}: ModifyChartFunctionParams) {
  const distance = (Math.abs(first - second) / chartData.length) * 100

  const transitionProperty =
    (chartAction === CHART_ACTION.ANIMATE_SWAP && isForward === true) ||
    (chartAction === CHART_ACTION.MATCH && isForward === false)
      ? 'transform'
      : 'none'

  const colorFirst =
    chartAction === CHART_ACTION.MATCH ||
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'hsl(var(--chart-4))'
      : 'hsl(var(--chart-2))'

  const colorSecond =
    chartAction === CHART_ACTION.MATCH ||
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'hsl(var(--chart-4))'
      : 'hsl(var(--chart-3))'

  const newChartData = chartData.map((data, index) => {
    return {
      ...data,
      fill:
        chartAction === CHART_ACTION.FINISHED
          ? 'hsl(var(--chart-5))'
          : index === first
            ? colorFirst
            : index === second
              ? colorSecond
              : 'hsl(var(--chart-1))',
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

interface ModifyChartParams {
  chartData: ChartDataField[]
  first: number
  second: number
  chartAction: ChartAction
}

export default function useModifyChart() {
  const { getDefaultChartData, directionForwardRef, durationRef } =
    useChartsInfo()
  const {
    getChartData,
    setChartData,
    getChartCompareCounter,
    setChartCompareCounter,
    getChartActionCounter,
    setChartActionCounter,
  } = useChartState()

  const modifyChart = useCallback(
    ({ chartData, first, second, chartAction }: ModifyChartParams) => {
      if (chartAction !== CHART_ACTION.SWAP) {
        setChartActionCounter(getChartActionCounter() + 1)
      }
      if (chartAction === CHART_ACTION.COMPARE) {
        setChartCompareCounter(getChartCompareCounter() + 1)
      }
      const duration = durationRef.current
      const isForward = directionForwardRef.current

      setChartData(
        modifyChartFunction({
          chartData,
          first,
          second,
          chartAction,
          duration,
          isForward,
        }),
      )
    },
    [
      durationRef,
      directionForwardRef,
      setChartData,
      setChartActionCounter,
      getChartActionCounter,
      setChartCompareCounter,
      getChartCompareCounter,
    ],
  )

  const reset = useCallback(() => {
    setChartData(getDefaultChartData())
    setChartActionCounter(0)
    setChartCompareCounter(0)
  }, [
    setChartData,
    getDefaultChartData,
    setChartActionCounter,
    setChartCompareCounter,
  ])

  const compare = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.COMPARE,
      }),
    [getChartData, modifyChart],
  )

  const match = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.MATCH,
      }),
    [getChartData, modifyChart],
  )

  const animateSwap = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.ANIMATE_SWAP,
      }),
    [getChartData, modifyChart],
  )

  const swap = useCallback(
    (first: number, second: number) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.SWAP,
      }),
    [getChartData, modifyChart],
  )

  const finish = useCallback(
    () =>
      modifyChart({
        chartData: getChartData(),
        first: 0,
        second: 0,
        chartAction: CHART_ACTION.FINISHED,
      }),
    [getChartData, modifyChart],
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
