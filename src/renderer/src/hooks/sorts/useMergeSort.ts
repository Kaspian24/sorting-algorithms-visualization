import { useCallback } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import useModifyChart from '@renderer/hooks/useModifyChart'
import { CHART_ACTION, UseSort } from '@renderer/types/types'

interface MergeSortVariables {
  curr_size: number
  l: number
  m: number
  r: number
  i: number
  j: number
  k: number
  n1: number
  n2: number
  L: number[]
  R: number[]
  tempFirst: number[]
  tempSecond: number[]
  tempIndex: number
  initialized: boolean
}

const getStarterVariables = () => {
  const starterVariables: MergeSortVariables = {
    curr_size: 1,
    l: 0,
    m: 0,
    r: 1,
    i: 0,
    j: 0,
    k: 0,
    n1: 1,
    n2: 1,
    L: [0],
    R: [0],
    tempFirst: [],
    tempSecond: [],
    tempIndex: 0,
    initialized: false,
  }
  return starterVariables
}

export const useMergeSort: UseSort = () => {
  const { getChartData, chartActionRef, sortVariablesRef } = useChartState()
  const { compare, animateReplace, replace, finish, reset } = useModifyChart()

  const mergeSort = useCallback(
    (dryRun: boolean = false) => {
      if (Object.keys(sortVariablesRef.current).length === 0) {
        sortVariablesRef.current = getStarterVariables()
      }
      let {
        curr_size,
        l,
        m,
        r,
        i,
        j,
        k,
        n1,
        n2,
        L,
        R,
        tempFirst,
        tempSecond,
        tempIndex,
        initialized,
      } = sortVariablesRef.current as MergeSortVariables
      let compareAction = chartActionRef.current
      let arr = getChartData()
      const n = arr.length

      if (!initialized) {
        for (i = 0; i < n1; i++) {
          L[i] = arr[l + i].number
        }
        for (j = 0; j < n2; j++) {
          R[j] = arr[m + 1 + j].number
        }

        i = 0
        j = 0

        initialized = true
      }

      function mergeSortFunction() {
        if (compareAction === CHART_ACTION.FINISHED) {
          return
        }

        if (compareAction === CHART_ACTION.REPLACE) {
          replace(tempFirst[tempIndex], tempSecond[tempIndex], dryRun)
          arr = getChartData()
          tempIndex++
          if (tempIndex > tempFirst.length - 1) {
            compareAction = CHART_ACTION.COMPARE
            tempIndex = 0
            tempFirst = []
            tempSecond = []
          } else {
            compareAction = CHART_ACTION.ANIMATE_REPLACE
          }
        }

        if (compareAction === CHART_ACTION.ANIMATE_REPLACE) {
          animateReplace(tempFirst[tempIndex], tempSecond[tempIndex], dryRun)
          compareAction = CHART_ACTION.REPLACE
          return
        }

        while (curr_size <= n - 1) {
          while (l < n - 1) {
            while (i < n1 && j < n2) {
              const main_i = l + i
              const main_j = m + 1 + j

              if (L[i] <= R[j]) {
                tempFirst.push(k)
                tempSecond.push(L[i])
                i++
              } else {
                tempFirst.push(k)
                tempSecond.push(R[j])
                j++
              }
              k++

              compare(main_i, main_j, dryRun)
              return
            }

            while (i < n1) {
              tempFirst.push(k)
              tempSecond.push(L[i])
              i++
              k++
            }

            while (j < n2) {
              tempFirst.push(k)
              tempSecond.push(R[j])
              j++
              k++
            }

            l += 2 * curr_size

            m = Math.min(l + curr_size - 1, n - 1)
            r = Math.min(l + 2 * curr_size - 1, n - 1)

            n1 = m - l + 1
            n2 = r - m

            if (l < n - 1) {
              L = Array(n1).fill(0)
              R = Array(n2).fill(0)

              for (i = 0; i < n1; i++) {
                L[i] = arr[l + i].number
              }
              for (j = 0; j < n2; j++) {
                R[j] = arr[m + 1 + j].number
              }
            }

            i = 0
            j = 0
            k = l

            if (tempFirst.length > 0) {
              animateReplace(tempFirst[0], tempSecond[0], dryRun)
              compareAction = CHART_ACTION.REPLACE
            }
            return
          }
          l = 0
          curr_size = 2 * curr_size

          m = Math.min(l + curr_size - 1, n - 1)
          r = Math.min(l + 2 * curr_size - 1, n - 1)

          n1 = m - l + 1
          n2 = r - m

          if (curr_size <= n - 1) {
            L = Array(n1).fill(0)
            R = Array(n2).fill(0)
            for (i = 0; i < n1; i++) {
              L[i] = arr[l + i].number
            }
            for (j = 0; j < n2; j++) {
              R[j] = arr[m + 1 + j].number
            }
          }

          i = 0
          j = 0
          k = l
        }
        finish(dryRun)
        compareAction = CHART_ACTION.FINISHED
        return
      }

      mergeSortFunction()
      sortVariablesRef.current = {
        curr_size,
        l,
        m,
        r,
        i,
        j,
        k,
        n1,
        n2,
        L,
        R,
        tempFirst,
        tempSecond,
        tempIndex,
        initialized,
      }
      chartActionRef.current = compareAction
    },
    [
      sortVariablesRef,
      chartActionRef,
      getChartData,
      finish,
      replace,
      animateReplace,
      compare,
    ],
  )

  const mergeSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
    reset()
  }, [chartActionRef, reset, sortVariablesRef])

  return {
    sortFunction: mergeSort,
    reset: mergeSortReset,
  }
}
