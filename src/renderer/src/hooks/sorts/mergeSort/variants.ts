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
      best: 'O(n log n)',
      average: '(n log n)',
      worst: 'O(n log n)',
      memory: 'O(n)',
      stable: true,
    },
    variables: {
      sortFunction: mergeSortTopBottom,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      memory: 'O(n)',
      stable: true,
    },
    variables: {
      sortFunction: mergeSortBottomUp,
    },
  },
]
