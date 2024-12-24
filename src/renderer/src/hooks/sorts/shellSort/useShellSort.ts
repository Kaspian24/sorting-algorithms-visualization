import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { shellSort } from '@renderer/hooks/sorts/shellSort/sortingFunction'
import { variants } from '@renderer/hooks/sorts/shellSort/variants'
import { CHART_ACTION, UseSort } from '@renderer/types/types'
import { visualizeChartDataFields } from '@renderer/utils/modifyChartData'

interface ShellSortVariables {
  iteration: number
  returned: boolean
}

const getStarterVariables = () => {
  const starterVariables: ShellSortVariables = {
    iteration: 0,
    returned: false,
  }
  return starterVariables
}

export const useShellSort: UseSort = (variant: number = 0) => {
  const {
    chartDataRef,
    chartActionRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    sortVariablesRef,
  } = useChartInfo()
  const { defaultChartDataRef } = useGlobalChartsInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    shellSort(chartDataRef, chartCompareCounterRef, variants[variant]),
  )

  const callNext = useCallback(() => {
    // TODO remove when compatibility with older method is not needed anymore
    if ((sortVariablesRef.current as ShellSortVariables).returned) {
      sortVariablesRef.current = getStarterVariables()
      chartDataRef.current = defaultChartDataRef.current
      chartActionRef.current = CHART_ACTION.DEFAULT
      chartActionCounterRef.current = 0
      chartCompareCounterRef.current = 0
      generatorRef.current = shellSort(
        chartDataRef,
        chartCompareCounterRef,
        variants[variant],
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

  const shellSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.DEFAULT
    generatorRef.current = shellSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
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
    reset: shellSortReset,
    info: variants[variant].info,
  }
}
