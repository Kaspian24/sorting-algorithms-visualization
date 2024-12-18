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

interface BubbleSortVariables {
  i: number
  j: number
  swapped: boolean
}

const getStarterVariables = () => {
  const starterVariables: BubbleSortVariables = {
    i: 0,
    j: 0,
    swapped: false,
  }
  return starterVariables
}

export const useBubbleSort: UseSort = () => {
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

  const bubbleSort = useCallback(() => {
    let { i, j, swapped } = sortVariablesRef.current as BubbleSortVariables
    let compareAction = chartActionRef.current
    let arr = chartDataRef.current.fields
    const n = arr.length

    function bubbleSortFunction() {
      if (compareAction === CHART_ACTION.FINISHED) {
        return
      }
      chartActionCounterRef.current++

      if (compareAction === CHART_ACTION.SWAP) {
        swapChartDataFields(chartDataRef, j, j + 1)
        arr = chartDataRef.current.fields
        compareAction = CHART_ACTION.COMPARE
        j++
      }

      while (i < n - 1) {
        while (j < n - i - 1) {
          if (compareAction === CHART_ACTION.COMPARE) {
            visualizeChartDataFields(
              chartDataRef,
              chartCompareCounterRef,
              CHART_ACTION.COMPARE,
              [j, j + 1],
            )
            if (arr[j].number > arr[j + 1].number) {
              compareAction = CHART_ACTION.ANIMATE_SWAP
              swapped = true
            } else {
              j++
            }
            return
          }
          if (compareAction === CHART_ACTION.ANIMATE_SWAP) {
            visualizeChartDataFields(
              chartDataRef,
              chartCompareCounterRef,
              CHART_ACTION.ANIMATE_SWAP,
              [j, j + 1],
            )
            compareAction = CHART_ACTION.SWAP
            return
          }
        }
        j = 0

        if (swapped === false) {
          break
        }
        i++
        swapped = false
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

    bubbleSortFunction()
    sortVariablesRef.current = { i, j, swapped }
    chartActionRef.current = compareAction
  }, [
    sortVariablesRef,
    chartActionRef,
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
  ])

  const bubbleSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
  }, [chartActionRef, sortVariablesRef])

  return {
    sortFunction: bubbleSort,
    reset: bubbleSortReset,
    info,
  }
}
