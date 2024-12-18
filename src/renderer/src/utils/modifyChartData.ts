import { MutableRefObject } from 'react'
import { CHART_ACTION, ChartAction, ChartData } from '@renderer/types/types'

export function swapChartDataFields(
  chartData: MutableRefObject<ChartData>,
  firstPosition: number,
  secondPosition: number,
) {
  const updatedFields = [...chartData.current.fields]

  updatedFields[firstPosition] = {
    ...chartData.current.fields[firstPosition],
    number: chartData.current.fields[secondPosition].number,
  }

  updatedFields[secondPosition] = {
    ...chartData.current.fields[secondPosition],
    number: chartData.current.fields[firstPosition].number,
  }

  chartData.current = {
    ...chartData.current,
    fields: updatedFields,
  }
}

export function replaceChartDataFields(
  chartData: MutableRefObject<ChartData>,
  position: number,
  number: number,
) {
  const updatedFields = [...chartData.current.fields]

  updatedFields[position] = {
    ...chartData.current.fields[position],
    number: number,
  }

  chartData.current = {
    ...chartData.current,
    fields: updatedFields,
  }
}

export function visualizeChartDataFields(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  action: ChartAction,
  numbers: number[],
) {
  if (action === CHART_ACTION.COMPARE) {
    compareCounter.current++
  }
  chartData.current = {
    ...chartData.current,
    visualization: {
      action: action,
      numbers: numbers,
    },
  }
}
