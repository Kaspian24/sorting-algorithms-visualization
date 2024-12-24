import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { selectionSort } from '@renderer/hooks/sorts/selectionSort/sortingFunction'
import { SortingAlgorithmInfo, UseSort } from '@renderer/types/types'

const info: SortingAlgorithmInfo = {
  best: 'n^2',
  average: 'n^2',
  worst: 'n^2',
  memory: '1',
  stable: false,
}

export const useSelectionSort: UseSort = () => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    selectionSort(chartDataRef, chartCompareCounterRef),
  )

  const reset = useCallback(() => {
    generatorRef.current = selectionSort(chartDataRef, chartCompareCounterRef)
  }, [chartCompareCounterRef, chartDataRef])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info,
  }
}
