import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { variants } from '@renderer/hooks/sorts/mergeSort/variants'
import { UseSort } from '@renderer/types/types'

export const useMergeSort: UseSort = (variant: number = 0) => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    variants[variant].variables.sortFunction(
      chartDataRef,
      chartCompareCounterRef,
      0,
      chartDataRef.current.fields.length - 1,
    ),
  )

  const reset = useCallback(() => {
    generatorRef.current = variants[variant].variables.sortFunction(
      chartDataRef,
      chartCompareCounterRef,
      0,
      chartDataRef.current.fields.length - 1,
    )
  }, [chartCompareCounterRef, chartDataRef, variant])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info: variants[variant].info,
  }
}
