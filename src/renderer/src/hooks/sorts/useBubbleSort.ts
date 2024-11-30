import { useCallback } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

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
  const { chartDataRef, chartActionRef, sortVariablesRef } = useChartInfo()
  const { compare, animateSwap, swap, finish, reset } = useModifyChart()

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const bubbleSort = useCallback(
    (dryRun: boolean = false) => {
      let { i, j, swapped } = sortVariablesRef.current as BubbleSortVariables
      let compareAction = chartActionRef.current
      let arr = chartDataRef.current
      const n = arr.length

      function bubbleSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.SWAP) {
          swap(j, j + 1, dryRun)
          arr = chartDataRef.current
          compareAction = CHART_ACTION.COMPARE
          j++
        }

        while (i < n - 1) {
          while (j < n - i - 1) {
            if (compareAction === CHART_ACTION.COMPARE) {
              compare(j, j + 1, dryRun)
              if (arr[j].number > arr[j + 1].number) {
                compareAction = CHART_ACTION.ANIMATE_SWAP
                swapped = true
              } else {
                j++
              }
              return
            }
            if (compareAction === CHART_ACTION.ANIMATE_SWAP) {
              animateSwap(j, j + 1, dryRun)
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

        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      bubbleSortFunction()
      sortVariablesRef.current = { i, j, swapped }
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

  const bubbleSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: bubbleSort,
    reset: bubbleSortReset,
  }
}
