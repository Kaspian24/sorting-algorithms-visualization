import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { insertionSort } from '@renderer/hooks/sorts/insertionSort/sortingFunction'
import { SortingAlgorithmInfo, UseSort } from '@renderer/types/types'

const info: SortingAlgorithmInfo = {
  best: 'n',
  average: 'n^2',
  worst: 'n^2',
  memory: '1',
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
