import { useCallback, useRef } from 'react'
import { useChartState } from '@renderer/components/ChartStateProvider/ChartStateProvider'
import useCompare from '@renderer/hooks/useCompare'
import { COMPARE_ACTION, UseSort } from '@renderer/types/types'

export const useSelectionSort: UseSort = () => {
  const { chartDataRef, compareActionRef } = useChartState()
  const { highlight, match, animateSwap, swap, finish, reset } = useCompare()

  const iRef = useRef(0)
  const jRef = useRef(1)
  const minIndexRef = useRef(0)

  const selectionSort = useCallback(() => {
    let i = iRef.current
    let j = jRef.current
    let minIndex = minIndexRef.current
    let compareAction = compareActionRef.current
    const arr = chartDataRef.current
    const n = arr.length

    function selectionSortFunction() {
      if (compareAction === COMPARE_ACTION.FINISHED) {
        return
      }

      if (compareAction === COMPARE_ACTION.ANIMATE_SWAP) {
        animateSwap(i, minIndex)
        compareAction = COMPARE_ACTION.SWAP
        return
      }

      if (compareAction === COMPARE_ACTION.SWAP) {
        swap(i, minIndex)
        compareAction = COMPARE_ACTION.HIGHLIGHT
        i++
        j = i + 1
        minIndex = i
      }

      for (; i < n - 1; ) {
        for (; j < n; ) {
          highlight(j, minIndex)
          if (arr[j].number < arr[minIndex].number) {
            minIndex = j
          }
          j++
          return
        }
        match(i, minIndex)
        compareAction = COMPARE_ACTION.ANIMATE_SWAP
        return
      }
      finish()
      compareAction = COMPARE_ACTION.FINISHED
      return
    }

    selectionSortFunction()
    iRef.current = i
    jRef.current = j
    minIndexRef.current = minIndex
    compareActionRef.current = compareAction
  }, [
    animateSwap,
    chartDataRef,
    compareActionRef,
    finish,
    highlight,
    match,
    swap,
  ])

  const selectionSortReset = useCallback(() => {
    iRef.current = 0
    jRef.current = 1
    minIndexRef.current = 0
    compareActionRef.current = COMPARE_ACTION.HIGHLIGHT
    reset()
  }, [compareActionRef, reset])

  return {
    sortFunction: selectionSort,
    reset: selectionSortReset,
  }
}
