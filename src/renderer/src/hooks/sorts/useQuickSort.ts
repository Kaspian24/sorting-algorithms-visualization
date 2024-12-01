import { useCallback } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'

interface QuickSortVariables {
  low: number
  high: number
  stack: number[]
  top: number
  i: number
  j: number
  pivot: number
  last: boolean
  initialized: boolean
}

const getStarterVariables = () => {
  const starterVariables: QuickSortVariables = {
    low: 0,
    high: 0,
    stack: [],
    top: -1,
    i: -1,
    j: 0,
    pivot: 0,
    last: false,
    initialized: false,
  }
  return starterVariables
}

export const useQuickSort: UseSort = () => {
  const { chartDataRef, chartActionRef, sortVariablesRef } = useChartInfo()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()

  const info: SortingAlgorithmInfo = {
    best: 'nlogn',
    average: 'nlogn',
    worst: 'n^2',
    memory: 'logn',
    stable: false,
  }

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const quickSort = useCallback(
    (dryRun: boolean = false) => {
      let { low, high, top, stack, i, j, pivot, last, initialized } =
        sortVariablesRef.current as QuickSortVariables
      let compareAction = chartActionRef.current
      let arr = chartDataRef.current
      const n = arr.length

      if (!initialized) {
        high = n - 1
        stack = new Array(high - low + 1)
        stack.fill(0)
        stack[++top] = low
        stack[++top] = high
        pivot = high

        initialized = true
      }

      function quickSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          if (last) {
            swap(i + 1, pivot, dryRun)
          } else {
            swap(i, j, dryRun)
          }
          arr = chartDataRef.current
          compareAction = CHART_ACTION.COMPARE
          j++
        }

        while (top >= 0) {
          while (j <= pivot - 1) {
            if (compareAction === CHART_ACTION.COMPARE) {
              compare(j, pivot, dryRun)
              compareAction = CHART_ACTION.ANIMATE_SWAP
              return
            }
            if (
              arr[j].number <= arr[pivot].number &&
              compareAction === CHART_ACTION.ANIMATE_SWAP
            ) {
              i++
              animateSwap(i, j, dryRun)
              compareAction = CHART_ACTION.SWAP
              return
            }
            compareAction = CHART_ACTION.COMPARE
            j++
          }

          if (!last) {
            animateSwap(i + 1, pivot, dryRun)
            compareAction = CHART_ACTION.SWAP
            last = true
            return
          }

          const p = i + 1

          if (p - 1 > low) {
            stack[++top] = low
            stack[++top] = p - 1
          }

          if (p + 1 < high) {
            stack[++top] = p + 1
            stack[++top] = high
          }

          if (top >= 0) {
            high = stack[top--]
            low = stack[top--]
            pivot = high
            i = low - 1
            j = low
            last = false
          }
        }
        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      quickSortFunction()
      sortVariablesRef.current = {
        low,
        high,
        top,
        stack,
        i,
        j,
        pivot,
        last,
        initialized,
      }
      chartActionRef.current = compareAction
    },
    [
      sortVariablesRef,
      chartActionRef,
      chartDataRef,
      finish,
      swap,
      animateSwap,
      compare,
    ],
  )

  const quickSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: quickSort,
    reset: quickSortReset,
    info,
  }
}
