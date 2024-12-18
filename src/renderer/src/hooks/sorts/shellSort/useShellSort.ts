import { useCallback } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import {
  CHART_ACTION,
  SortingAlgorithmVariant,
  UseSort,
} from '@renderer/types/types'
import {
  swapChartDataFields,
  visualizeChartDataFields,
} from '@renderer/utils/modifyChartData'

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

interface ShellSortVariant extends SortingAlgorithmVariant {
  variables: {
    gapFunction: (num: number) => number
  }
}

const variants: ShellSortVariant[] = [
  {
    info: {
      best: 'nlogn',
      average: 'n^4/3',
      worst: 'n^2',
      memory: '1',
      stable: false,
    },
    variables: {
      gapFunction: (num: number) => {
        return Math.floor(num / 2)
      },
    },
  },
  {
    info: {
      best: 'nlogn',
      average: 'n^4/3',
      worst: 'n^3/2',
      memory: '1',
      stable: false,
    },
    variables: {
      gapFunction: (num: number) => {
        let k = 1
        while (Math.pow(2, k) - 1 < num) {
          k++
        }
        return Math.floor(Math.pow(2, k - 1) - 1)
      },
    },
  },
]

export const useShellSort: UseSort = (variant: number = 0) => {
  const {
    chartDataRef,
    chartActionRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    sortVariablesRef,
  } = useChartInfo()

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const shellSort = useCallback(() => {
    let { i, j, gap, temp, initialized } =
      sortVariablesRef.current as ShellSortVariables
    let compareAction = chartActionRef.current
    let arr = chartDataRef.current.fields
    const n = arr.length

    if (!initialized) {
      gap = variants[variant].variables.gapFunction(n)
      i = gap
      j = i
      temp = i

      initialized = true
    }

    function shellSortFunction() {
      if (compareAction === CHART_ACTION.FINISHED) {
        return
      }
      chartActionCounterRef.current++

      if (compareAction === CHART_ACTION.SWAP) {
        swapChartDataFields(chartDataRef, j - gap, j)
        arr = chartDataRef.current.fields
        j -= gap
        temp = j
        compareAction = CHART_ACTION.COMPARE
      }

      while (gap > 0) {
        while (i < n) {
          if (j >= gap) {
            if (compareAction === CHART_ACTION.COMPARE) {
              visualizeChartDataFields(
                chartDataRef,
                chartCompareCounterRef,
                CHART_ACTION.COMPARE,
                [j - gap, temp],
              )
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
              visualizeChartDataFields(
                chartDataRef,
                chartCompareCounterRef,
                CHART_ACTION.ANIMATE_SWAP,
                [j - gap, j],
              )
              compareAction = CHART_ACTION.SWAP
              return
            }
          }

          i += 1
          j = i
          temp = j
        }
        gap = variants[variant].variables.gapFunction(gap)
        i = gap
        j = i
        temp = j
      }

      visualizeChartDataFields(
        chartDataRef,
        chartCompareCounterRef,
        CHART_ACTION.FINISHED,
        [],
      )
      compareAction = CHART_ACTION.FINISHED
      return
    }

    shellSortFunction()
    sortVariablesRef.current = { i, j, gap, temp, initialized }
    chartActionRef.current = compareAction
  }, [
    sortVariablesRef,
    chartActionRef,
    chartDataRef,
    variant,
    chartActionCounterRef,
    chartCompareCounterRef,
  ])

  const shellSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.COMPARE
  }, [chartActionRef, sortVariablesRef])

  return {
    sortFunction: shellSort,
    reset: shellSortReset,
    info: variants[variant].info,
  }
}
