import { useCallback, useRef } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

export const useSelectionSort: UseSort = () => {
  const { getChartData, chartActionRef } = useChartState()
  const { compare, match, animateSwap, swap, finish, reset } = useModifyChart()

  const iRef = useRef(0)
  const jRef = useRef(1)
  const minIndexRef = useRef(0)

  const selectionSort = useCallback(() => {
    let i = iRef.current
    let j = jRef.current
    let minIndex = minIndexRef.current
    let compareAction = chartActionRef.current

    let arr = getChartData()
    const n = arr.length

    function selectionSortFunction() {
      if (compareAction === CHART_ACTION.FINISHED) {
        return
      }

      if (compareAction === CHART_ACTION.ANIMATE_SWAP) {
        animateSwap(i, minIndex)
        compareAction = CHART_ACTION.SWAP
        return
      }

      if (compareAction === CHART_ACTION.SWAP) {
        swap(i, minIndex)
        arr = getChartData()
        compareAction = CHART_ACTION.COMPARE
        i++
        j = i + 1
        minIndex = i
      }

      for (; i < n - 1; ) {
        for (; j < n; ) {
          compare(j, minIndex)
          if (arr[j].number < arr[minIndex].number) {
            minIndex = j
          }
          j++
          return
        }
        match(i, minIndex)
        compareAction = CHART_ACTION.ANIMATE_SWAP
        return
      }
      finish()
      compareAction = CHART_ACTION.FINISHED
      return
    }
    selectionSortFunction()

    iRef.current = i
    jRef.current = j
    minIndexRef.current = minIndex
    chartActionRef.current = compareAction
  }, [chartActionRef, getChartData, finish, animateSwap, swap, match, compare])

  const selectionSortReset = useCallback(() => {
    iRef.current = 0
    jRef.current = 1
    minIndexRef.current = 0
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset])

  return {
    sortFunction: selectionSort,
    reset: selectionSortReset,
  }
}
