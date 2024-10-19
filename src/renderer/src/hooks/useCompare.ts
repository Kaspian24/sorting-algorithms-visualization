import { useCallback, useState } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import { useChartState } from '@renderer/components/ChartStateProvider/ChartStateProvider'
import {
  ChartDataField,
  COMPARE_ACTION,
  CompareAction,
} from '@renderer/types/types'

interface CompareParams {
  chartData: ChartDataField[]
  first: number
  second: number
  compareAction: CompareAction
  duration: number
  isForward: boolean
}

function compareFunction({
  chartData,
  first,
  second,
  compareAction,
  duration,
  isForward,
}: CompareParams) {
  const distance = (Math.abs(first - second) / chartData.length) * 100

  const transitionProperty =
    (compareAction === COMPARE_ACTION.ANIMATE_SWAP && isForward === true) ||
    (compareAction === COMPARE_ACTION.MATCH && isForward === false)
      ? 'transform'
      : 'none'

  const colorFirst =
    compareAction === COMPARE_ACTION.MATCH ||
    compareAction === COMPARE_ACTION.ANIMATE_SWAP
      ? 'var(--color-swap)'
      : 'var(--color-first)'

  const colorSecond =
    compareAction === COMPARE_ACTION.MATCH ||
    compareAction === COMPARE_ACTION.ANIMATE_SWAP
      ? 'var(--color-swap)'
      : 'var(--color-second)'

  const newChartData = chartData.map((data, index) => {
    return {
      ...data,
      fill:
        compareAction === COMPARE_ACTION.FINISHED
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
          compareAction === COMPARE_ACTION.ANIMATE_SWAP
            ? index === first
              ? `translateX(${distance}%)`
              : index === second
                ? `translateX(-${distance}%)`
                : 'translateX(0%)'
            : 'translateX(0%)',
      },
    }
  })
  if (compareAction === COMPARE_ACTION.SWAP) {
    ;[newChartData[first], newChartData[second]] = [
      newChartData[second],
      newChartData[first],
    ]
  }
  return newChartData
}

export default function useCompare() {
  const { defaultChartData, directionForwardRef, durationRef } =
    useChartControl()
  const { chartDataRef, highlightCounterRef, compareActionCounterRef } =
    useChartState()
  const [, setChartData] = useState(defaultChartData) // trigger re-render

  const compare = useCallback(
    ({ chartData, first, second, compareAction }) => {
      if (compareAction !== COMPARE_ACTION.SWAP) {
        compareActionCounterRef.current += 1
      }
      if (compareAction === COMPARE_ACTION.HIGHLIGHT) {
        highlightCounterRef.current += 1
      }
      const duration = durationRef.current
      const isForward = directionForwardRef.current

      chartDataRef.current = compareFunction({
        chartData,
        first,
        second,
        compareAction,
        duration,
        isForward,
      })
      setChartData(chartDataRef.current)
    },
    [
      chartDataRef,
      compareActionCounterRef,
      directionForwardRef,
      durationRef,
      highlightCounterRef,
    ],
  )

  const reset = useCallback(() => {
    chartDataRef.current = defaultChartData
    compareActionCounterRef.current = 0
    highlightCounterRef.current = 0
    setChartData(defaultChartData)
  }, [
    chartDataRef,
    compareActionCounterRef,
    defaultChartData,
    highlightCounterRef,
  ])

  const highlight = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.HIGHLIGHT,
      }),
    [chartDataRef, compare],
  )

  const match = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.MATCH,
      }),
    [chartDataRef, compare],
  )

  const animateSwap = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.ANIMATE_SWAP,
      }),
    [chartDataRef, compare],
  )

  const swap = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.SWAP,
      }),
    [chartDataRef, compare],
  )

  const finish = useCallback(
    () =>
      compare({
        chartData: chartDataRef.current,
        first: 0,
        second: 0,
        compareAction: COMPARE_ACTION.FINISHED,
      }),
    [chartDataRef, compare],
  )

  return {
    highlight,
    match,
    animateSwap,
    swap,
    finish,
    reset,
  }
}
