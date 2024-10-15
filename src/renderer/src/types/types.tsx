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
  (defaultChartData: ChartDataField[]): {
    sortFunction: () => void
    chartDataRef: React.MutableRefObject<ChartDataField[]>
    compareActionCounterRef: React.MutableRefObject<number>
    highlightCounterRef: React.MutableRefObject<number>
    compareActionRef: React.MutableRefObject<CompareAction>
    reset: () => void
  }
}

export const SORTING_ALGORITHM = {
  SELECTION_SORT: useSelectionSort,
} as const

export type SortingAlgorithm =
  (typeof SORTING_ALGORITHM)[keyof typeof SORTING_ALGORITHM]

export interface ChartDataField {
  number: number
  fill: string
  className: string
  style: {
    transform: string
  }
}