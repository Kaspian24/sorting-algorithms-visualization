import { useCallback, useRef, useState } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
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
}

export default function useCompare(defaultChartData: ChartDataField[]) {
  const chartDataRef = useRef(defaultChartData)
  const highlightCounterRef = useRef(0)
  const compareActionCounterRef = useRef(0)
  const { durationRef } = useChartControl()
  const [, setChartData] = useState(defaultChartData) // trigger re-render

  const compare = useCallback(
    ({ chartData, first, second, compareAction }: CompareParams) => {
      const distance = (Math.abs(first - second) / chartData.length) * 100

      if (compareAction !== COMPARE_ACTION.SWAP) {
        compareActionCounterRef.current += 1
      }
      if (compareAction === COMPARE_ACTION.HIGHLIGHT) {
        highlightCounterRef.current += 1
      }

      const className =
        compareAction === COMPARE_ACTION.ANIMATE_SWAP
          ? 'transition-transform'
          : ''

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

      const transitionDuration =
        compareAction === COMPARE_ACTION.ANIMATE_SWAP
          ? `${durationRef.current}ms`
          : ''

      const newChartData = chartData.map((data, index) => {
        return {
          ...data,
          className,
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
            transitionDuration,
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
      chartDataRef.current = newChartData
      setChartData(newChartData)
    },
    [durationRef],
  )

  const reset = useCallback(() => {
    chartDataRef.current = defaultChartData
    compareActionCounterRef.current = 0
    highlightCounterRef.current = 0
    setChartData(defaultChartData)
  }, [defaultChartData])

  const highlight = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.HIGHLIGHT,
      }),
    [compare],
  )

  const match = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.MATCH,
      }),
    [compare],
  )

  const animateSwap = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.ANIMATE_SWAP,
      }),
    [compare],
  )

  const swap = useCallback(
    (first: number, second: number) =>
      compare({
        chartData: chartDataRef.current,
        first,
        second,
        compareAction: COMPARE_ACTION.SWAP,
      }),
    [compare],
  )

  const finish = useCallback(
    () =>
      compare({
        chartData: chartDataRef.current,
        first: 0,
        second: 0,
        compareAction: COMPARE_ACTION.FINISHED,
      }),
    [compare],
  )

  return {
    highlight,
    match,
    animateSwap,
    swap,
    finish,
    chartDataRef,
    highlightCounterRef,
    compareActionCounterRef,
    reset,
  }
}
