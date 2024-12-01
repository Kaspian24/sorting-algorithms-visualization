import { useCallback } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
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
  dryRun: boolean
}

function modifyChartFunction({
  chartData,
  first,
  second,
  chartAction,
  duration,
  isForward,
  dryRun,
}: ModifyChartFunctionParams) {
  const distance = (Math.abs(first - second) / chartData.length) * 100
  const scale =
    chartAction === CHART_ACTION.ANIMATE_REPLACE
      ? 1 / (chartData[first].number / second)
      : 1

  const transition =
    (chartAction === CHART_ACTION.ANIMATE_SWAP ||
      chartAction === CHART_ACTION.ANIMATE_REPLACE) &&
    isForward
      ? 'transform'
      : 'none'

  const colorFirst =
    chartAction === CHART_ACTION.ANIMATE_SWAP ||
    chartAction === CHART_ACTION.ANIMATE_REPLACE
      ? 'hsl(var(--chart-swap))'
      : 'hsl(var(--chart-compare-first))'

  const colorSecond =
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'hsl(var(--chart-swap))'
      : chartAction === CHART_ACTION.ANIMATE_REPLACE
        ? 'hsl(var(--chart-default))'
        : 'hsl(var(--chart-compare-second))'

  const newChartData = !dryRun
    ? chartData.map((data, index) => {
        return {
          ...data,
          fill:
            chartAction === CHART_ACTION.FINISHED
              ? 'hsl(var(--chart-finish))'
              : index === first
                ? colorFirst
                : index === second
                  ? colorSecond
                  : 'hsl(var(--chart-default))',
          style: {
            ...data.style,
            transitionProperty:
              index === first || index === second ? transition : 'none',
            transitionDuration: `${duration}ms`,
            transform:
              chartAction === CHART_ACTION.ANIMATE_SWAP
                ? index === first
                  ? `translateX(${distance}%)`
                  : index === second
                    ? `translateX(${-distance}%)`
                    : 'translateX(0%)'
                : chartAction === CHART_ACTION.ANIMATE_REPLACE
                  ? index === first
                    ? `scaleY(${scale})`
                    : 'scaleY(1)'
                  : 'translateX(0%) scaleY(1)',
          },
        }
      })
    : [...chartData]
  if (chartAction === CHART_ACTION.SWAP) {
    ;[newChartData[first], newChartData[second]] = [
      { ...newChartData[first], number: newChartData[second].number },
      { ...newChartData[second], number: newChartData[first].number },
    ]
  }
  if (chartAction === CHART_ACTION.REPLACE) {
    newChartData[first] = { ...newChartData[first], number: second }
  }
  return newChartData
}

interface ModifyChartParams {
  chartData: ChartDataField[]
  first: number
  second: number
  chartAction: ChartAction
  dryRun: boolean
}

export default function useModifyChart() {
  const { defaultChartDataRef, directionForwardRef, durationRef } =
    useGlobalChartsInfo()
  const { chartDataRef, chartCompareCounterRef, chartActionCounterRef } =
    useChartInfo()

  const modifyChart = useCallback(
    ({ chartData, first, second, chartAction, dryRun }: ModifyChartParams) => {
      if (
        chartAction !== CHART_ACTION.SWAP &&
        chartAction !== CHART_ACTION.REPLACE
      ) {
        chartActionCounterRef.current += 1
      }
      if (chartAction === CHART_ACTION.COMPARE) {
        chartCompareCounterRef.current += 1
      }
      const duration = durationRef.current
      const isForward = directionForwardRef.current

      chartDataRef.current = modifyChartFunction({
        chartData,
        first,
        second,
        chartAction,
        duration,
        isForward,
        dryRun,
      })
    },
    [
      durationRef,
      directionForwardRef,
      chartDataRef,
      chartActionCounterRef,
      chartCompareCounterRef,
    ],
  )

  const reset = useCallback(() => {
    chartDataRef.current = defaultChartDataRef.current
    chartActionCounterRef.current = 0
    chartCompareCounterRef.current = 0
  }, [
    chartDataRef,
    defaultChartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
  ])

  const compare = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        chartAction: CHART_ACTION.COMPARE,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  const animateSwap = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        chartAction: CHART_ACTION.ANIMATE_SWAP,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  const swap = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        chartAction: CHART_ACTION.SWAP,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  const animateReplace = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        chartAction: CHART_ACTION.ANIMATE_REPLACE,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  const replace = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first,
        second,
        chartAction: CHART_ACTION.REPLACE,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  const finish = useCallback(
    (dryRun: boolean = false) =>
      modifyChart({
        chartData: chartDataRef.current,
        first: -1,
        second: -1,
        chartAction: CHART_ACTION.FINISHED,
        dryRun,
      }),
    [chartDataRef, modifyChart],
  )

  return {
    compare,
    animateSwap,
    swap,
    animateReplace,
    replace,
    finish,
    reset,
  }
}
