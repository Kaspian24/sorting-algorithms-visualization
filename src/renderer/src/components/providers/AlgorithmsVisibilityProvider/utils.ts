import {
  AlgorithmVisibilityData,
  DRAG_ITEM_TYPE,
  DraggablesTransitionState,
  DragItemType,
  SORTING_ALGORITHM,
} from '@renderer/types/types'

function generateInitialAlgorithmsVisibility(): AlgorithmVisibilityData[] {
  return Object.keys(SORTING_ALGORITHM).map((algorithm) => ({
    algorithm: algorithm as keyof typeof SORTING_ALGORITHM,
    visible: false,
  }))
}

function generateInitialDraggablesTransitionState(): DraggablesTransitionState {
  return Object.values(DRAG_ITEM_TYPE).reduce((acc, key) => {
    acc[key as DragItemType] = false
    return acc
  }, {} as DraggablesTransitionState)
}

export const initialAlgorithmsVisibility = generateInitialAlgorithmsVisibility()

export const initialDraggablesTransitionState =
  generateInitialDraggablesTransitionState()
