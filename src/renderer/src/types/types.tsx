import { useSelectionSort } from '@renderer/hooks/sorts/useSelectrionSort'

export const COMPARE_ACTION = {
  HIGHLIGHT: 'HIGHLIGHT',
  MATCH: 'MATCH',
  ANIMATE_SWAP: 'ANIMATE_SWAP',
  SWAP: 'SWAP',
  FINISHED: 'FINISHED',
} as const

export type CompareAction = (typeof COMPARE_ACTION)[keyof typeof COMPARE_ACTION]

export interface UseSort {
  (): {
    sortFunction: () => void
    reset: () => void
  }
}

export const SORTING_ALGORITHM = {
  SELECTION_SORT: useSelectionSort,
  TEST_ONE: useSelectionSort,
  TEST_TWO: useSelectionSort,
  TEST_THREE: useSelectionSort,
} as const

export type SortingAlgorithm =
  (typeof SORTING_ALGORITHM)[keyof typeof SORTING_ALGORITHM]

export interface ChartDataField {
  number: number
  fill: string
  className: string
  style: {
    transform: string
    transitionDuration: string
    transitionProperty: string
  }
}

export interface ChartInfoData {
  sortFunction: () => void
  reset: () => void
  maxCompareActionCounterRef: React.MutableRefObject<number>
  maxHighlightCounterRef: React.MutableRefObject<number>
  chartDataRef: React.MutableRefObject<ChartDataField[]>
  compareActionCounterRef: React.MutableRefObject<number>
  highlightCounterRef: React.MutableRefObject<number>
  compareActionRef: React.MutableRefObject<CompareAction>
}

export type AlgorithmVisibilityData = {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
}
