import { MutableRefObject } from 'react'
import { heapify } from '@renderer/hooks/sorts/heapSort/heapifyFunction'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* heapSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
) {
  const n = chartData.current.fields.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(chartData, compareCounter, n, i)
  }

  for (let i = n - 1; i > 0; i--) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [0, i],
    )
    yield 0
    swapChartDataFields(chartData, 0, i)

    yield* heapify(chartData, compareCounter, i, 0)
  }
  return
}
