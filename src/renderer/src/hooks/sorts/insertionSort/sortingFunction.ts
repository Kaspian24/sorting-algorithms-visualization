import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* insertionSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
) {
  const n = chartData.current.fields.length
  for (let i = 1; i < n; i++) {
    const key = chartData.current.fields[i].number
    let j = i - 1

    while (j >= 0) {
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.COMPARE,
        [j, j + 1],
      )
      yield 0
      if (chartData.current.fields[j].number <= key) {
        break
      }
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.ANIMATE_SWAP,
        [j, j + 1],
      )
      yield 0
      swapChartDataFields(chartData, j, j + 1)
      j = j - 1
    }
  }
  return
}
