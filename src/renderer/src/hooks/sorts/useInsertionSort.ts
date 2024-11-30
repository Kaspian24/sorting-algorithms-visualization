import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'

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
  const { chartDataRef, chartActionRef, sortVariablesRef } = useChartInfo()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()
  const { t } = useTranslation('useInsertionSort')

  const info: SortingAlgorithmInfo = {
    name: t('name'),
    description: t('description'),
    best: 'n',
    average: 'n^2',
    worst: 'n^2',
    memory: '1',
    stable: true,
  }

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const insertionSort = useCallback(
    (dryRun: boolean = false) => {
      let { i, j, key, initialized } =
        sortVariablesRef.current as InsertionSortVariables
      let compareAction = chartActionRef.current
      let arr = chartDataRef.current
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
          arr = chartDataRef.current
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
      chartDataRef,
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
    info,
  }
}
