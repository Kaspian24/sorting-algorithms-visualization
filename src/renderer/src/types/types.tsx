import { useSelectionSort } from '@renderer/hooks/sorts/useSelectrionSort'

export const CHART_ACTION = {
  COMPARE: 'COMPARE',
  MATCH: 'MATCH',
  ANIMATE_SWAP: 'ANIMATE_SWAP',
  SWAP: 'SWAP',
  FINISHED: 'FINISHED',
} as const

export type ChartAction = (typeof CHART_ACTION)[keyof typeof CHART_ACTION]

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
  TEST_1: useSelectionSort,
  TEST_2: useSelectionSort,
  TEST_3: useSelectionSort,
  TEST_4: useSelectionSort,
  TEST_5: useSelectionSort,
  TEST_6: useSelectionSort,
} as const

export type SortingAlgorithm =
  (typeof SORTING_ALGORITHM)[keyof typeof SORTING_ALGORITHM]

export type AlgorithmVisibilityData = {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
}

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
  getMaxChartActionCounter: () => number
  getMaxChartCompareCounter: () => number
  getChartData: () => ChartDataField[]
  getChartActionCounter: () => number
  getChartCompareCounter: () => number
  chartActionRef: React.MutableRefObject<ChartAction>
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
