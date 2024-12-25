import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { insertionSort } from '@renderer/hooks/sorts/insertionSort/sortingFunction'
import { SortingAlgorithmInfo, UseSort } from '@renderer/types/types'

const info: SortingAlgorithmInfo = {
  best: 'O(n)',
  average: 'O(n^(2))',
  worst: 'O(n^(2))',
  memory: 'O(1)',
  stable: true,
}

export const useInsertionSort: UseSort = () => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    insertionSort(chartDataRef, chartCompareCounterRef),
  )

  const reset = useCallback(() => {
    generatorRef.current = insertionSort(chartDataRef, chartCompareCounterRef)
  }, [chartCompareCounterRef, chartDataRef])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info,
  }
}
