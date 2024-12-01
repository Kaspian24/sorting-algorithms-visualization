import { useBubbleSort } from '@renderer/hooks/sorts/useBubbleSort'
import { useInsertionSort } from '@renderer/hooks/sorts/useInsertionSort'
import { useMergeSort } from '@renderer/hooks/sorts/useMergeSort'
import { useQuickSort } from '@renderer/hooks/sorts/useQuickSort'
import { useSelectionSort } from '@renderer/hooks/sorts/useSelectionSort'
import { useShellSort } from '@renderer/hooks/sorts/useShellSort'

export const CHART_ACTION = {
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
    sortFunction: (dryRun?: boolean) => void
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
  QUICK_SORT: useQuickSort,
} as const

export type SortingAlgorithm =
  (typeof SORTING_ALGORITHM)[keyof typeof SORTING_ALGORITHM]

export type AlgorithmVisibilityData = {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
}

export interface ChartDataField {
  key: string
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
  sortFunction: (dryRun?: boolean) => void
  reset: () => void
  chartDataRef: React.MutableRefObject<ChartDataField[]>
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
  data: ChartDataField[]
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
