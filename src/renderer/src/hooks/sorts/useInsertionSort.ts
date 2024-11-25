import { useCallback } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

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
  const { getChartData, chartActionRef, sortVariablesRef } = useChartState()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const insertionSort = useCallback(
    (dryRun: boolean = false) => {
      let { i, j, key, initialized } =
        sortVariablesRef.current as InsertionSortVariables
      let compareAction = chartActionRef.current
      let arr = getChartData()
      const n = arr.length

      if (!initialized) {
        key = arr[i].number

        initialized = true
      }

      function insertionSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          swap(j + 1, j, dryRun)
          arr = getChartData()
          j = j - 1
          compareAction = CHART_ACTION.COMPARE
        }

        while (i < n) {
          if (j >= 0 && compareAction === CHART_ACTION.COMPARE) {
            compare(j, j + 1, dryRun)
            compareAction = CHART_ACTION.ANIMATE_SWAP
            return
          }
          while (j >= 0 && arr[j].number > key) {
            animateSwap(j, j + 1, dryRun)
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

        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      insertionSortFunction()
      sortVariablesRef.current = { i, j, key, initialized }
      chartActionRef.current = compareAction
    },
    [
      sortVariablesRef,
      chartActionRef,
      getChartData,
      finish,
      animateSwap,
      swap,
      compare,
    ],
  )

  const insertionSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: insertionSort,
    reset: insertionSortReset,
  }
}
