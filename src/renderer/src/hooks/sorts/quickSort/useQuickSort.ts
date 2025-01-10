import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { quickSort } from '@renderer/hooks/sorts/quickSort/sortingFunction'
import { variants } from '@renderer/hooks/sorts/quickSort/variants'
import { UseSort } from '@renderer/types/types'

export const useQuickSort: UseSort = (variant: number = 0) => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    quickSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
      0,
      chartDataRef.current.fields.length - 1,
    ),
  )

  const reset = useCallback(() => {
    generatorRef.current = quickSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
      0,
      chartDataRef.current.fields.length - 1,
    )
  }, [chartCompareCounterRef, chartDataRef, variant])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info: variants[variant].info,
    code: variants[variant].code,
  }
}
