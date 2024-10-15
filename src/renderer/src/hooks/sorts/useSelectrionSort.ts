import { useCallback, useRef } from 'react'
import useCompare from '@renderer/hooks/useCompare'
import {
  ChartDataField,
  COMPARE_ACTION,
  CompareAction,
  UseSort,
} from '@renderer/types/types'

export const useSelectionSort: UseSort = (
  defaultChartData: ChartDataField[],
) => {
  const {
    highlight,
    match,
    animateSwap,
    swap,
    finish,
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    reset,
  } = useCompare(defaultChartData)

  const iRef = useRef(0)
  const jRef = useRef(1)
  const minIndexRef = useRef(0)
  const compareActionRef = useRef<CompareAction>(COMPARE_ACTION.HIGHLIGHT)

  const selectionSort = useCallback(() => {
    let i = iRef.current
    let j = jRef.current
    let minIndex = minIndexRef.current
    let compareAction = compareActionRef.current

    function updateRefs() {
      iRef.current = i
      jRef.current = j
      minIndexRef.current = minIndex
      compareActionRef.current = compareAction
    }

    const arr = chartDataRef.current
    const n = arr.length

    if (compareAction === COMPARE_ACTION.FINISHED) {
      return updateRefs()
    }

    if (compareAction === COMPARE_ACTION.ANIMATE_SWAP) {
      animateSwap(i, minIndex)
      compareAction = COMPARE_ACTION.SWAP
      return updateRefs()
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
        return updateRefs()
      }
      match(i, minIndex)
      compareAction = COMPARE_ACTION.ANIMATE_SWAP
      return updateRefs()
    }
    finish()
    compareAction = COMPARE_ACTION.FINISHED
    return updateRefs()
  }, [animateSwap, chartDataRef, finish, highlight, match, swap])

  const selectionSortReset = useCallback(() => {
    iRef.current = 0
    jRef.current = 1
    minIndexRef.current = 0
    compareActionRef.current = COMPARE_ACTION.HIGHLIGHT
    reset()
  }, [reset])

  return {
    sortFunction: selectionSort,
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    compareActionRef,
    reset: selectionSortReset,
  }
}
