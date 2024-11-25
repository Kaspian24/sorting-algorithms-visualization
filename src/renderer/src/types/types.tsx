import { useInsertionSort } from '@renderer/hooks/sorts/useInsertionSort'
import { useMergeSort } from '@renderer/hooks/sorts/useMergeSort'
import { useSelectionSort } from '@renderer/hooks/sorts/useSelectionSort'

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
  (): {
    sortFunction: (dryRun?: boolean) => void
    reset: () => void
  }
}

export const SORTING_ALGORITHM = {
  SELECTION_SORT: useSelectionSort,
  MERGE_SORT: useMergeSort,
  INSERTION_SORT: useInsertionSort,
  TEST_1: useSelectionSort,
  TEST_2: useSelectionSort,
  TEST_3: useSelectionSort,
  TEST_4: useSelectionSort,
  TEST_5: useSelectionSort,
  TEST_6: useSelectionSort,
  TEST_7: useSelectionSort,
  TEST_8: useSelectionSort,
  TEST_9: useSelectionSort,
  TEST_10: useSelectionSort,
  TEST_11: useSelectionSort,
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
  getMaxChartActionCounter: () => number
  getMaxChartCompareCounter: () => number
  getChartData: () => ChartDataField[]
  getChartActionCounter: () => number
  getChartCompareCounter: () => number
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
