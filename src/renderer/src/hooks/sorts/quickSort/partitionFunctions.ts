import { MutableRefObject } from 'react'
import { PivotFunction } from '@renderer/hooks/sorts/quickSort/pivotFunctions'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export const PARTITION_TYPE = {
  LOMUTO: 'LOMUTO',
  HOARE: 'HOARE',
} as const

export type PartitionType = (typeof PARTITION_TYPE)[keyof typeof PARTITION_TYPE]

export function* partitionLomuto(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  pivotFunction: PivotFunction,
  low: number,
  high: number,
) {
  const pivotGenerator = pivotFunction(chartData, compareCounter, low, high)
  let pivotResult = pivotGenerator.next()
  while (!pivotResult.done) {
    yield pivotResult.value
    pivotResult = pivotGenerator.next()
  }
  const pivot = pivotResult.value

  let i = low - 1

  for (let j = low; j <= high - 1; j++) {
    visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
      j,
      pivot,
    ])
    yield 0
    if (
      chartData.current.fields[j].number <
      chartData.current.fields[pivot].number
    ) {
      i++
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.ANIMATE_SWAP,
        [i, j],
      )
      yield 0
      swapChartDataFields(chartData, i, j)
    }
  }

  visualizeChartDataFields(
    chartData,
    compareCounter,
    CHART_ACTION.ANIMATE_SWAP,
    [i + 1, high],
  )
  yield 0
  swapChartDataFields(chartData, i + 1, high)
  return i + 1
}

export function* partitionHoare(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  pivotFunction: PivotFunction,
  low: number,
  high: number,
) {
  const pivotGenerator = pivotFunction(chartData, compareCounter, low, high)
  let pivotResult = pivotGenerator.next()
  while (!pivotResult.done) {
    yield pivotResult.value
    pivotResult = pivotGenerator.next()
  }
  let pivot = pivotResult.value

  let i = low - 1
  let j = high + 1

  while (true) {
    do {
      i++
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.COMPARE,
        [i, pivot],
      )
      yield 0
    } while (
      chartData.current.fields[i].number <
      chartData.current.fields[pivot].number
    )

    do {
      j--
      visualizeChartDataFields(
        chartData,
        compareCounter,
        CHART_ACTION.COMPARE,
        [pivot, j],
      )
      yield 0
    } while (
      chartData.current.fields[j].number >
      chartData.current.fields[pivot].number
    )

    if (i >= j) {
      return j
    }

    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [i, j],
    )
    yield 0
    if (i === pivot) {
      pivot = j
    } else if (j === pivot) {
      pivot = i
    }
    swapChartDataFields(chartData, i, j)
  }
}
