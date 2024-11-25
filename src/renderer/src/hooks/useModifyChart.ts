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
      ? 'hsl(var(--chart-4))'
      : 'hsl(var(--chart-2))'

  const colorSecond =
    chartAction === CHART_ACTION.ANIMATE_SWAP
      ? 'hsl(var(--chart-4))'
      : chartAction === CHART_ACTION.ANIMATE_REPLACE
        ? 'hsl(var(--chart-1))'
        : 'hsl(var(--chart-3))'

  const newChartData = !dryRun
    ? chartData.map((data, index) => {
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
    ({ chartData, first, second, chartAction, dryRun }: ModifyChartParams) => {
      if (
        chartAction !== CHART_ACTION.SWAP &&
        chartAction !== CHART_ACTION.REPLACE
      ) {
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
          dryRun,
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
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.COMPARE,
        dryRun,
      }),
    [getChartData, modifyChart],
  )

  const animateSwap = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.ANIMATE_SWAP,
        dryRun,
      }),
    [getChartData, modifyChart],
  )

  const swap = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.SWAP,
        dryRun,
      }),
    [getChartData, modifyChart],
  )

  const animateReplace = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.ANIMATE_REPLACE,
        dryRun,
      }),
    [getChartData, modifyChart],
  )

  const replace = useCallback(
    (first: number, second: number, dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first,
        second,
        chartAction: CHART_ACTION.REPLACE,
        dryRun,
      }),
    [getChartData, modifyChart],
  )

  const finish = useCallback(
    (dryRun: boolean = false) =>
      modifyChart({
        chartData: getChartData(),
        first: -1,
        second: -1,
        chartAction: CHART_ACTION.FINISHED,
        dryRun,
      }),
    [getChartData, modifyChart],
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
