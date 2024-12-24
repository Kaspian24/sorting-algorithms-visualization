import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { bubbleSort } from '@renderer/hooks/sorts/bubbleSort/sortingFunction'
import {
  CHART_ACTION,
  SortingAlgorithmInfo,
  UseSort,
} from '@renderer/types/types'
import { visualizeChartDataFields } from '@renderer/utils/modifyChartData'

interface BubbleSortVariables {
  iteration: number
  returned: boolean
}

const getStarterVariables = () => {
  const starterVariables: BubbleSortVariables = {
    iteration: 0,
    returned: false,
  }
  return starterVariables
}

export const useBubbleSort: UseSort = () => {
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
    bubbleSort(chartDataRef, chartCompareCounterRef),
  )

  const callNext = useCallback(() => {
    // TODO remove when compatibility with older method is not needed anymore
    if ((sortVariablesRef.current as BubbleSortVariables).returned) {
      sortVariablesRef.current = getStarterVariables()
      chartDataRef.current = defaultChartDataRef.current
      chartActionRef.current = CHART_ACTION.DEFAULT
      chartActionCounterRef.current = 0
      chartCompareCounterRef.current = 0
      generatorRef.current = bubbleSort(chartDataRef, chartCompareCounterRef)

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

  const bubbleSortReset = useCallback(() => {
    sortVariablesRef.current = getStarterVariables()
    chartActionRef.current = CHART_ACTION.DEFAULT
    generatorRef.current = bubbleSort(chartDataRef, chartCompareCounterRef)
  }, [chartActionRef, chartCompareCounterRef, chartDataRef, sortVariablesRef])

  return {
    sortFunction: callNext,
    reset: bubbleSortReset,
    info,
  }
}
