import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { insertionSort } from '@renderer/hooks/sorts/insertionSort/sortingFunction'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'
import { visualizeChartDataFields } from '@renderer/utils/modifyChartData'

interface InsertionSortVariables {
  iteration: number
  returned: boolean
}

const getStarterVariables = () => {
  const starterVariables: InsertionSortVariables = {
    iteration: 0,
    returned: false,
  }
  return starterVariables
}

export const useInsertionSort: UseSort = () => {
  const {
    chartDataRef,
    chartActionRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    sortVariablesRef,
  } = useChartInfo()
  const { defaultChartDataRef } = useGlobalChartsInfo()

  const info: SortingAlgorithmInfo = {
    best: 'n',
    average: 'n^2',
    worst: 'n^2',
    memory: '1',
    stable: true,
  }

  const generatorRef = useRef<Generator<number, void, unknown>>(
    insertionSort(chartDataRef, chartCompareCounterRef),
  )

  const callNext = useCallback(() => {
    // TODO remove when compatibility with older method is not needed anymore
    if ((sortVariablesRef.current as InsertionSortVariables).returned) {
      sortVariablesRef.current = getStarterVariables()
      chartDataRef.current = defaultChartDataRef.current
      chartActionRef.current = CHART_ACTION.DEFAULT
      chartActionCounterRef.current = 0
      chartCompareCounterRef.current = 0
      generatorRef.current = insertionSort(chartDataRef, chartCompareCounterRef)

      sortVariablesRef.current = {
        returned: false,
      }
    }

    if (chartActionRef.current === CHART_ACTION.FINISHED) {
      return
    }
    const result = generatorRef.current.next()
    chartActionCounterRef.current++
    if (result.done) {
      visualizeChartDataFields(
        chartDataRef,
        chartCompareCounterRef,
        CHART_ACTION.FINISHED,
        [],
      )
      chartActionRef.current = CHART_ACTION.FINISHED
    }
  }, [
    chartActionCounterRef,
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    defaultChartDataRef,
    sortVariablesRef,
  ])

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const insertionSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.DEFAULT
    generatorRef.current = insertionSort(chartDataRef, chartCompareCounterRef)
  }, [chartActionRef, chartCompareCounterRef, chartDataRef, sortVariablesRef])

  return {
    sortFunction: callNext,
    reset: insertionSortReset,
    info,
  }
}
