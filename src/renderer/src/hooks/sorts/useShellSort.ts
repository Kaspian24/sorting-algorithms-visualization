import { useCallback } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

interface ShellSortVariables {
  i: number
  j: number
  gap: number
  temp: number
  initialized: boolean
}

const getStarterVariables = () => {
  const starterVariables: ShellSortVariables = {
    i: 0,
    j: 0,
    gap: 0,
    temp: 0,
    initialized: false,
  }
  return starterVariables
}

export const useShellSort: UseSort = () => {
  const { getChartData, chartActionRef, sortVariablesRef } = useChartState()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const shellSort = useCallback(
    (dryRun: boolean = false) => {
      let { i, j, gap, temp, initialized } =
        sortVariablesRef.current as ShellSortVariables
      let compareAction = chartActionRef.current
      let arr = getChartData()
      const n = arr.length

      if (!initialized) {
        gap = Math.floor(n / 2)
        i = gap
        j = i
        temp = i

        initialized = true
      }

      function shellSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          swap(j - gap, j, dryRun)
          arr = getChartData()
          j -= gap
          temp = j
          compareAction = CHART_ACTION.COMPARE
        }

        while (gap > 0) {
          while (i < n) {
            if (j >= gap) {
              if (compareAction === CHART_ACTION.COMPARE) {
                compare(j - gap, temp, dryRun)
                if (arr[j - gap].number > arr[temp].number) {
                  compareAction = CHART_ACTION.ANIMATE_SWAP
                } else {
                  i += 1
                  j = i
                  temp = j
                }
                return
              }
              if (CHART_ACTION.ANIMATE_SWAP) {
                animateSwap(j - gap, j, dryRun)
                compareAction = CHART_ACTION.SWAP
                return
              }
            }

            i += 1
            j = i
            temp = j
          }
          gap = Math.floor(gap / 2)
          i = gap
          j = i
          temp = j
        }

        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      shellSortFunction()
      sortVariablesRef.current = { i, j, gap, temp, initialized }
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

  const shellSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: shellSort,
    reset: shellSortReset,
  }
}
