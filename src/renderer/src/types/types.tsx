import { useBubbleSort } from '@renderer/hooks/sorts/bubbleSort/useBubbleSort'
import { useInsertionSort } from '@renderer/hooks/sorts/insertionSort/useInsertionSort'
import { useMergeSort } from '@renderer/hooks/sorts/mergeSort/useMergeSort'
import { useQuickSort } from '@renderer/hooks/sorts/quickSort/useQuickSort'
import { useSelectionSort } from '@renderer/hooks/sorts/selectionSort/useSelectionSort'
import { useShellSort } from '@renderer/hooks/sorts/shellSort/useShellSort'

export const CHART_ACTION = {
  DEFAULT: 'DEFAULT',
  COMPARE: 'COMPARE',
  ANIMATE_SWAP: 'ANIMATE_SWAP',
  SWAP: 'SWAP',
  ANIMATE_REPLACE: 'ANIMATE_REPLACE',
  REPLACE: 'REPLACE',
  FINISHED: 'FINISHED',
} as const

export type ChartAction = (typeof CHART_ACTION)[keyof typeof CHART_ACTION]

export interface UseSort {
  (variant?: number): {
    sortFunction: () => void
    reset: () => void
    info: SortingAlgorithmInfo
  }
}

export const SORTING_ALGORITHM = {
  SELECTION_SORT: useSelectionSort,
  MERGE_SORT: useMergeSort,
  INSERTION_SORT: useInsertionSort,
  BUBBLE_SORT: useBubbleSort,
  SHELL_SORT: useShellSort,
  SHELL_SORT_HIBBARD: () => useShellSort(1),
  QUICK_SORT_LOMUTO_LAST_AS_PIVOT: useQuickSort,
  QUICK_SORT_LOMUTO_MEDIAN_OF_THREE_AS_PIVOT: () => useQuickSort(1),
  QUICK_SORT_HOARE_FIRST_AS_PIVOT: () => useQuickSort(2),
  QUICK_SORT_HOARE_MIDDLE_AS_PIVOT: () => useQuickSort(3),
} as const

export type SortingAlgorithm =
  (typeof SORTING_ALGORITHM)[keyof typeof SORTING_ALGORITHM]

export type AlgorithmVisibilityData = {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
}

export interface ChartData {
  fields: ChartDataField[]
  visualization: { action: ChartAction; numbers: number[] }
}

export interface ChartDataField {
  key: number
  number: number
}

export interface ChartInfoData {
  sortFunction: () => void
  reset: () => void
  chartDataRef: React.MutableRefObject<ChartData>
  chartActionCounterRef: React.MutableRefObject<number>
  chartCompareCounterRef: React.MutableRefObject<number>
  maxChartActionCounterRef: React.MutableRefObject<number>
  maxChartCompareCounterRef: React.MutableRefObject<number>
  chartActionRef: React.MutableRefObject<ChartAction>
  goToCheckpoint: (checkpoint: number) => boolean
  setStep: () => void
}

export const DRAG_ITEM_TYPE = {
  CHART_CARD: 'CHART_CARD',
  CONTEXT_ITEM: 'CONTEXT_ITEM',
} as const

export type DragItemType = (typeof DRAG_ITEM_TYPE)[keyof typeof DRAG_ITEM_TYPE]

export type DraggablesTransitionState = { [key in DragItemType]: boolean }

export const DRAG_CONTAINER_LAYOUT = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
  GRID: 'GRID',
  HANDLE: 'HANDLE',
} as const

export type DragContainerLayout =
  (typeof DRAG_CONTAINER_LAYOUT)[keyof typeof DRAG_CONTAINER_LAYOUT]

export type ChartCheckpoint = {
  checkpoint: number
  data: ChartData
  sortVariables: object
  chartActionCounter: number
  chartCompareCounter: number
  chartAction: ChartAction
}

export interface SortingAlgorithmInfo {
  best: string
  average: string
  worst: string
  memory: string
  stable: boolean
}

export interface SortingAlgorithmVariant {
  info: SortingAlgorithmInfo
  variables: object
}
