import { useCallback, useRef } from 'react'
import { useChartInfo } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { shellSort } from '@renderer/hooks/sorts/shellSort/sortingFunction'
import { variants } from '@renderer/hooks/sorts/shellSort/variants'
import { UseSort } from '@renderer/types/types'

export const useShellSort: UseSort = (variant: number = 0) => {
  const { chartDataRef, chartCompareCounterRef } = useChartInfo()

  const generatorRef = useRef<Generator<number, void, unknown>>(
    shellSort(chartDataRef, chartCompareCounterRef, variants[variant]),
  )

  const reset = useCallback(() => {
    generatorRef.current = shellSort(
      chartDataRef,
      chartCompareCounterRef,
      variants[variant],
    )
  }, [chartCompareCounterRef, chartDataRef, variant])

  return {
    sortFunctionGeneratorRef: generatorRef,
    reset,
    info: variants[variant].info,
    code: variants[variant].code,
  }
}
