import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { quickSort } from '@renderer/hooks/sorts/quickSort/sortingFunction'
import { variants } from '@renderer/hooks/sorts/quickSort/variants'
import { CHART_ACTION, UseSort } from '@renderer/types/types'
import { visualizeChartDataFields } from '@renderer/utils/modifyChartData'

export interface QuickSortVariables {
  iteration: number
  returned: boolean
}

export const getStarterVariables = () => {
  const starterVariables: QuickSortVariables = {
    iteration: 0,
    returned: false,
  }
  return starterVariables
}

export const useQuickSort: UseSort = (variant: number = 0) => {
  const {
    chartDataRef,
    chartActionRef,
    sortVariablesRef,
    chartCompareCounterRef,
    chartActionCounterRef,
  } = useChartInfo()
  const { defaultChartDataRef } = useGlobalChartsInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    quickSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
      0,
      chartDataRef.current.fields.length - 1,
    ),
  )

  const callNext = useCallback(() => {
    // TODO remove when compatibility with older method is not needed anymore
    if ((sortVariablesRef.current as QuickSortVariables).returned) {
      sortVariablesRef.current = getStarterVariables()
      chartDataRef.current = defaultChartDataRef.current
      chartActionRef.current = CHART_ACTION.DEFAULT
      chartActionCounterRef.current = 0
      chartCompareCounterRef.current = 0
      generatorRef.current = quickSort(
        chartDataRef,
        chartCompareCounterRef,
        variants[variant],
        0,
        chartDataRef.current.fields.length - 1,
      )

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
    variant,
  ])

  if (Object.keys(sortVariablesRef.current).length === 0) {
    sortVariablesRef.current = getStarterVariables()
  }

  const quickSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.DEFAULT
    generatorRef.current = quickSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
      0,
      chartDataRef.current.fields.length - 1,
    )
  }, [
    chartActionRef,
    chartCompareCounterRef,
    chartDataRef,
    sortVariablesRef,
    variant,
  ])

  return {
    sortFunction: callNext,
    reset: quickSortReset,
    info: variants[variant].info,
  }
}
