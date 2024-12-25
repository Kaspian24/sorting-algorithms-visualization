import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* bubbleSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
) {
  let swapped = false
  const n = chartData.current.fields.length

  for (let i = 0; i < n - 1; i++) {
    swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.COMPARE,
        [j, j + 1],
      )
      yield 0
      if (
        chartData.current.fields[j].number >
        chartData.current.fields[j + 1].number
      ) {
        visualizeChartDataFields(
          chartData,
          compareCounter,
          CHART_ACTION.ANIMATE_SWAP,
          [j, j + 1],
        )
        yield 0
        swapChartDataFields(chartData, j, j + 1)
        swapped = true
      }
    }

    if (swapped === false) {
      break
    }
  }
  return
}
