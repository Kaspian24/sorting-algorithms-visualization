import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* heapify(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  n: number,
  i: number,
) {
  let largest = i

  const l = 2 * i + 1

  const r = 2 * i + 2

  if (l < n) {
    visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
      l,
      largest,
    ])
    yield 0
    if (
      chartData.current.fields[l].number >
      chartData.current.fields[largest].number
    ) {
      largest = l
    }
  }

  if (r < n) {
    visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
      r,
      largest,
    ])
    yield 0
    if (
      chartData.current.fields[r].number >
      chartData.current.fields[largest].number
    ) {
      largest = r
    }
  }

  if (largest !== i) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [i, largest],
    )
    yield 0
    swapChartDataFields(chartData, i, largest)

    yield* heapify(chartData, compareCounter, n, largest)
  }
  return
}
