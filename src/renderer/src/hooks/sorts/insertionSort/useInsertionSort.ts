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

interface InsertionSortVariables {
  i: number
  j: number
  key: number
  initialized: boolean
}

const getStarterVariables = () => {
  const starterVariables: InsertionSortVariables = {
    i: 1,
    j: 0,
    key: 0,
    initialized: false,
  }
  return starterVariables
}

export const useInsertionSort: UseSort = () => {
  const {
    chartDataRef,
    chartActionRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    sortVariablesRef,
  } = useChartInfo()

  const info: SortingAlgorithmInfo = {
    best: 'n',
    average: 'n^2',
    worst: 'n^2',
    memory: '1',
    stable: true,
  }

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const insertionSort = useCallback(() => {
    let { i, j, key, initialized } =
      sortVariablesRef.current as InsertionSortVariables
    let compareAction = chartActionRef.current
    let arr = chartDataRef.current.fields
    const n = arr.length

    if (!initialized) {
      key = arr[i].number

      initialized = true
    }

    function insertionSortFunction() {
      if (compareAction === CHART_ACTION.FINISHED) {
        return
      }
      chartActionCounterRef.current++

      if (compareAction === CHART_ACTION.SWAP) {
        swapChartDataFields(chartDataRef, j, j + 1)
        arr = chartDataRef.current.fields
        j = j - 1
        compareAction = CHART_ACTION.COMPARE
      }

      while (i < n) {
        if (j >= 0 && compareAction === CHART_ACTION.COMPARE) {
          visualizeChartDataFields(
            chartDataRef,
            chartCompareCounterRef,
            CHART_ACTION.COMPARE,
            [j, j + 1],
          )
          compareAction = CHART_ACTION.ANIMATE_SWAP
          return
        }
        while (j >= 0 && arr[j].number > key) {
          visualizeChartDataFields(
            chartDataRef,
            chartCompareCounterRef,
            CHART_ACTION.ANIMATE_SWAP,
            [j, j + 1],
          )
          compareAction = CHART_ACTION.SWAP
          return
        }
        i++
        if (i < n) {
          key = arr[i].number
          j = i - 1
        }
        compareAction = CHART_ACTION.COMPARE
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

    insertionSortFunction()
    sortVariablesRef.current = { i, j, key, initialized }
    chartActionRef.current = compareAction
  }, [
    sortVariablesRef,
    chartActionRef,
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
  ])

  const insertionSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
  }, [chartActionRef, sortVariablesRef])

  return {
    sortFunction: insertionSort,
    reset: insertionSortReset,
    info,
  }
}
