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

  for (let curr_size = 1; curr_size <= n - 1; curr_size *= 2) {
    for (let left = 0; left < n - 1; left += 2 * curr_size) {
      const mid = Math.min(left + curr_size - 1, n - 1)

      const right = Math.min(left + 2 * curr_size - 1, n - 1)

      yield* merge(chartData, compareCounter, left, mid, right)
    }
  }
}
