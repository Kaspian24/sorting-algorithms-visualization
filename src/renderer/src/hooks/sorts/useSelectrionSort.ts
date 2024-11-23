import { useCallback } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

export const useSelectionSort: UseSort = () => {
  const { getChartData, chartActionRef, sortVariablesRef } = useChartState()
  const { compare, match, animateSwap, swap, finish, reset } = useModifyChart()

  const selectionSort = useCallback(
    (dryRun: boolean = false) => {
      if (Object.keys(sortVariablesRef.current).length === 0) {
        sortVariablesRef.current = {
          i: 0,
          j: 1,
          minIndex: 0,
        }
      }
      let { i, j, minIndex } = sortVariablesRef.current as {
        i: number
        j: number
        minIndex: number
      }
      let compareAction = chartActionRef.current

      let arr = getChartData()
      const n = arr.length

      function selectionSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.ANIMATE_SWAP) {
          animateSwap(i, minIndex, dryRun)
          compareAction = CHART_ACTION.SWAP
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          swap(i, minIndex, dryRun)
          arr = getChartData()
          compareAction = CHART_ACTION.COMPARE
          i++
          j = i + 1
          minIndex = i
        }

        for (; i < n - 1; ) {
          for (; j < n; ) {
            compare(j, minIndex, dryRun)
            if (arr[j].number < arr[minIndex].number) {
              minIndex = j
            }
            j++
            return
          }
          match(i, minIndex, dryRun)
          compareAction = CHART_ACTION.ANIMATE_SWAP
          return
        }
        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }
      selectionSortFunction()

      sortVariablesRef.current = { i, j, minIndex }
      chartActionRef.current = compareAction
    },
    [
      sortVariablesRef,
      chartActionRef,
      getChartData,
      finish,
      animateSwap,
      swap,
      match,
      compare,
    ],
  )

  const selectionSortReset = useCallback(() => {
    sortVariablesRef.current = {
      i: 0,
      j: 1,
      minIndex: 0,
    }
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: selectionSort,
    reset: selectionSortReset,
  }
}
