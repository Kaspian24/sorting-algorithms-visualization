import { MutableRefObject } from 'react'
import { merge } from '@renderer/hooks/sorts/mergeSort/mergeFunction'
import { ChartData } from '@renderer/types/types'

export function* mergeSortTopBottom(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  left: number,
  right: number,
) {
  if (left >= right) {
    return
  }

  const mid = Math.floor(left + (right - left) / 2)
  yield* mergeSortTopBottom(chartData, compareCounter, left, mid)
  yield* mergeSortTopBottom(chartData, compareCounter, mid + 1, right)
  yield* merge(chartData, compareCounter, left, mid, right)
  return
}

export function* mergeSortBottomUp(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
) {
  const n = chartData.current.fields.length

  for (let curr_size = 1; curr_size <= n - 1; curr_size = 2 * curr_size) {
    for (let left_start = 0; left_start < n - 1; left_start += 2 * curr_size) {
      const mid = Math.min(left_start + curr_size - 1, n - 1)

      const right_end = Math.min(left_start + 2 * curr_size - 1, n - 1)

      yield* merge(chartData, compareCounter, left_start, mid, right_end)
    }
  }
}
