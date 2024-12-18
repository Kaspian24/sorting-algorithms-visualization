import { useCallback } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

interface SelectionSortVariables {
  i: number
  j: number
  min_idx: number
}

const getStarterVariables = () => {
  const starterVariables: SelectionSortVariables = {
    i: 0,
    j: 1,
    min_idx: 0,
  }
  return starterVariables
}

export const useSelectionSort: UseSort = () => {
  const {
    chartDataRef,
    chartActionRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    sortVariablesRef,
  } = useChartInfo()

  const info: SortingAlgorithmInfo = {
    best: 'n^2',
    average: 'n^2',
    worst: 'n^2',
    memory: '1',
    stable: false,
  }

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const selectionSort = useCallback(() => {
    let { i, j, min_idx } = sortVariablesRef.current as SelectionSortVariables
    let compareAction = chartActionRef.current
    let arr = chartDataRef.current.fields
    const n = arr.length

    function selectionSortFunction() {
      if (compareAction === CHART_ACTION.FINISHED) {
        return
      }
      chartActionCounterRef.current++

      if (compareAction === CHART_ACTION.SWAP) {
        swapChartDataFields(chartDataRef, i, min_idx)
        arr = chartDataRef.current.fields
        compareAction = CHART_ACTION.COMPARE
        i++
        j = i + 1
        min_idx = i
      }

      while (i < n - 1) {
        while (j < n) {
          visualizeChartDataFields(
            chartDataRef,
            chartCompareCounterRef,
            CHART_ACTION.COMPARE,
            [min_idx, j],
          )
          if (arr[j].number < arr[min_idx].number) {
            min_idx = j
          }
          j++
          return
        }
        visualizeChartDataFields(
          chartDataRef,
          chartCompareCounterRef,
          CHART_ACTION.ANIMATE_SWAP,
          [i, min_idx],
        )
        compareAction = CHART_ACTION.SWAP
        return
      }
      visualizeChartDataFields(
        chartDataRef,
        chartCompareCounterRef,
        CHART_ACTION.FINISHED,
        [],
      )
      compareAction = CHART_ACTION.FINISHED
      return
    }

    selectionSortFunction()
    sortVariablesRef.current = { i, j, min_idx }
    chartActionRef.current = compareAction
  }, [
    sortVariablesRef,
    chartActionRef,
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
  ])

  const selectionSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
  }, [chartActionRef, sortVariablesRef])

  return {
    sortFunction: selectionSort,
    reset: selectionSortReset,
    info,
  }
}
