import { MutableRefObject } from 'react'
import {
  PARTITION_TYPE,
  partitionHoare,
  partitionLomuto,
} from '@renderer/hooks/sorts/quickSort/partitionFunctions'
import { QuickSortVariant } from '@renderer/hooks/sorts/quickSort/variants'
import { ChartData } from '@renderer/types/types'

export function* quickSort(
  chartData: MutableRefObject<ChartData>,
  compareCounter: MutableRefObject<number>,
  variant: QuickSortVariant,
  low: number,
  high: number,
) {
  const partition =
    variant.variables.partitionType === PARTITION_TYPE.LOMUTO
      ? partitionLomuto
      : partitionHoare

  if (low < high) {
    const partitionGenerator = partition(
      chartData,
      compareCounter,
      variant.variables.pivotFunction,
      low,
      high,
    )
    let partitionResult = partitionGenerator.next()
    while (!partitionResult.done) {
      yield partitionResult.value
      partitionResult = partitionGenerator.next()
    }

    const index = partitionResult.value

    if (variant.variables.partitionType === PARTITION_TYPE.LOMUTO) {
      yield* quickSort(chartData, compareCounter, variant, low, index - 1)
    } else {
      yield* quickSort(chartData, compareCounter, variant, low, index)
    }

    yield* quickSort(chartData, compareCounter, variant, index + 1, high)
  }
  return
}
