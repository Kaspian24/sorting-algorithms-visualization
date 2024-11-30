import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'

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
  const { chartDataRef, chartActionRef, sortVariablesRef } = useChartInfo()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()
  const { t } = useTranslation('useSelectionSort')

  const info: SortingAlgorithmInfo = {
    name: t('name'),
    description: t('description'),
    best: 'n^2',
    average: 'n^2',
    worst: 'n^2',
    memory: '1',
    stable: false,
  }

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const selectionSort = useCallback(
    (dryRun: boolean = false) => {
      let { i, j, min_idx } = sortVariablesRef.current as SelectionSortVariables
      let compareAction = chartActionRef.current
      let arr = chartDataRef.current
      const n = arr.length

      function selectionSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          swap(i, min_idx, dryRun)
          arr = chartDataRef.current
          compareAction = CHART_ACTION.COMPARE
          i++
          j = i + 1
          min_idx = i
        }

        while (i < n - 1) {
          while (j < n) {
            compare(min_idx, j, dryRun)
            if (arr[j].number < arr[min_idx].number) {
              min_idx = j
            }
            j++
            return
          }
          animateSwap(i, min_idx, dryRun)
          compareAction = CHART_ACTION.SWAP
          return
        }
        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      selectionSortFunction()
      sortVariablesRef.current = { i, j, min_idx }
      chartActionRef.current = compareAction
    },
    [
      sortVariablesRef,
      chartActionRef,
      chartDataRef,
      finish,
      animateSwap,
      swap,
      compare,
    ],
  )

  const selectionSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: selectionSort,
    reset: selectionSortReset,
    info,
  }
}
