import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  replaceChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* merge(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  left: number,
  mid: number,
  right: number,
) {
  const n1 = mid - left + 1
  const n2 = right - mid

  const L = chartData.current.fields
    .slice(left, left + n1)
    .map((field) => field.number)

  const R = chartData.current.fields
    .slice(mid + 1, mid + 1 + n2)
    .map((field) => field.number)

  let i = 0
  let j = 0
  let k = left

  while (i < n1 && j < n2) {
    visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
      left + i,
      mid + 1 + j,
    ])
    yield 0
    if (L[i] <= R[j]) {
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.ANIMATE_REPLACE,
        [k, L[i]],
      )
      yield 0
      replaceChartDataFields(chartData, k, L[i])
      i++
    } else {
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.ANIMATE_REPLACE,
        [k, R[j]],
      )
      yield 0
      replaceChartDataFields(chartData, k, R[j])
      j++
    }
    k++
  }

  while (i < n1) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_REPLACE,
      [k, L[i]],
    )
    yield 0
    replaceChartDataFields(chartData, k, L[i])
    i++
    k++
  }

  while (j < n2) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_REPLACE,
      [k, R[j]],
    )
    yield 0
    replaceChartDataFields(chartData, k, R[j])
    j++
    k++
  }

  return
}
