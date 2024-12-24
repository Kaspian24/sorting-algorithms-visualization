import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* selectionSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
) {
  const n = chartData.current.fields.length

  for (let i = 0; i < n - 1; i++) {
    let min_idx = i

    for (let j = i + 1; j < n; j++) {
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.COMPARE,
        [min_idx, j],
      )
      yield 0
      if (
        chartData.current.fields[j].number <
        chartData.current.fields[min_idx].number
      ) {
        min_idx = j
      }
    }

    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [i, min_idx],
    )
    yield 0
    swapChartDataFields(chartData, i, min_idx)
  }
  return
}
