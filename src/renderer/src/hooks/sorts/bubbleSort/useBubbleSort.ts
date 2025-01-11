import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { bubbleSortCode } from '@renderer/hooks/sorts/bubbleSort/bubblesortCode'
import { bubbleSort } from '@renderer/hooks/sorts/bubbleSort/sortingFunction'
import { SortingAlgorithmInfo, UseSort } from '@renderer/types/types'

const info: SortingAlgorithmInfo = {
  best: 'O(n)',
  average: 'O(n^(2))',
  worst: 'O(n^(2))',
  memory: 'O(1)',
  stable: true,
}

export const useBubbleSort: UseSort = () => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    bubbleSort(chartDataRef, chartCompareCounterRef),
  )

  const reset = useCallback(() => {
    generatorRef.current = bubbleSort(chartDataRef, chartCompareCounterRef)
  }, [chartCompareCounterRef, chartDataRef])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info,
    code: bubbleSortCode,
  }
}
