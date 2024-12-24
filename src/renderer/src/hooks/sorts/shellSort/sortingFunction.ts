import { MutableRefObject } from 'react'
import { ShellSortVariant } from '@renderer/hooks/sorts/shellSort/variants'
import { CHART_ACTION, ChartData } from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

export function* shellSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  variant: ShellSortVariant,
) {
  const n = chartData.current.fields.length
  const gapFunction = variant.variables.gapFunction

  for (let gap = gapFunction(n); gap > 0; gap = gapFunction(gap)) {
    for (let i = gap; i < n; i++) {
      let temp = i
      for (let j = i; j >= gap; j -= gap) {
        visualizeChartDataFields(
          chartData,
          compareCounter,
          CHART_ACTION.COMPARE,
          [j - gap, temp],
        )
        yield 0
        if (
          chartData.current.fields[j - gap].number <=
          chartData.current.fields[temp].number
        ) {
          break
        }
        visualizeChartDataFields(
          chartData,
          compareCounter,
          CHART_ACTION.ANIMATE_SWAP,
          [j - gap, j],
        )
        yield 0
        if (temp === j) {
          temp = j - gap
        } else if (temp === j - gap) {
          temp = j
        }
        swapChartDataFields(chartData, j - gap, j)
      }
    }
  }
  return
}
