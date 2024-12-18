import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export type PivotFunction = (
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  low: number,
  high: number,
) => Generator<number, number, void>

// eslint-disable-next-line require-yield
export function* pivotEnd(
  _chartData: MutableRefObject<ChartData>,
  _compareCounter: MutableRefObject<number>,
  _low: number,
  high: number,
) {
  return high
}

// eslint-disable-next-line require-yield
export function* pivotStart(
  _chartData: MutableRefObject<ChartData>,
  _compareCounter: MutableRefObject<number>,
  low: number,
) {
  return low
}

// eslint-disable-next-line require-yield
export function* pivotMiddle(
  _chartData: MutableRefObject<ChartData>,
  _compareCounter: MutableRefObject<number>,
  low: number,
  high: number,
) {
  return Math.floor((low + high) / 2)
}

export function* pivotMedianOfThree(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  low: number,
  high: number,
) {
  const mid = Math.floor((low + high) / 2)

  visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
    mid,
    low,
  ])
  yield 0
  if (
    chartData.current.fields[mid].number < chartData.current.fields[low].number
  ) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [low, mid],
    )
    yield 0
    swapChartDataFields(chartData, low, mid)
  }

  visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
    high,
    low,
  ])
  yield 0
  if (
    chartData.current.fields[high].number < chartData.current.fields[low].number
  ) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [low, high],
    )
    yield 0
    swapChartDataFields(chartData, low, high)
  }

  visualizeChartDataFields(chartData, compareCounter, CHART_ACTION.COMPARE, [
    mid,
    high,
  ])
  yield 0
  if (
    chartData.current.fields[mid].number < chartData.current.fields[high].number
  ) {
    visualizeChartDataFields(
      chartData,
      compareCounter,
      CHART_ACTION.ANIMATE_SWAP,
      [mid, high],
    )
    yield 0
    swapChartDataFields(chartData, mid, high)
  }

  return high
}
