import { MutableRefObject } from 'react'
import {
  mergeSortBottomUp,
  mergeSortTopBottom,
} from '@renderer/hooks/sorts/mergeSort/sortingFunction'
import { ChartData, SortingAlgorithmVariant } from '@renderer/types/types'

export interface MergeSortVariant extends SortingAlgorithmVariant {
  variables: {
    sortFunction: (
      chartData: MutableRefObject<ChartData>,
      compareCounter: MutableRefObject<number>,
      left: number,
      right: number,
    ) => Generator<number, void, unknown>
  }
}

export const variants: MergeSortVariant[] = [
  {
    info: {
      best: 'nlogn',
      average: 'nlogn',
      worst: 'nlogn',
      memory: 'n',
      stable: true,
    },
    variables: {
      sortFunction: mergeSortTopBottom,
    },
  },
  {
    info: {
      best: 'nlogn',
      average: 'nlogn',
      worst: 'nlogn',
      memory: 'n',
      stable: true,
    },
    variables: {
      sortFunction: mergeSortBottomUp,
    },
  },
]
