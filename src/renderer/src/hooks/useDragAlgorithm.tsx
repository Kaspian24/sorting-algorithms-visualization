import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider'
import {
  DRAG_CONTAINER_LAYOUT,
  DragContainerLayout,
  DragItemType,
  SORTING_ALGORITHM,
} from '@renderer/types/types'
import type { Identifier, XYCoord } from 'dnd-core'

interface DragItem {
  index: number
  algorithm: keyof typeof SORTING_ALGORITHM
  type: string
}

export default function useDragAlgorithm(
  ITEM_TYPE: DragItemType,
  algorithm: keyof typeof SORTING_ALGORITHM,
  containerLayout: DragContainerLayout = DRAG_CONTAINER_LAYOUT.GRID,
) {
  const ref = useRef<HTMLDivElement>(null)
  const { swapAlgorithmsPosition, draggablesTransitionStateRef } =
    useGlobalChartsInfo()

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: () => ({ algorithm }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return
      }

      if (item.algorithm === algorithm) {
        return
      }

      if (draggablesTransitionStateRef.current[ITEM_TYPE]) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const xSwapTreshold = 0.5
      const ySwapTreshold = 0.5

      const clientOffset = monitor.getClientOffset()

      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      const minX = (hoverBoundingRect.width / 2) * xSwapTreshold
      const maxX = (hoverBoundingRect.width / 2) * (1 + xSwapTreshold)
      const isCursorNearCenterX = hoverClientX > minX && hoverClientX < maxX

      const minY = (hoverBoundingRect.height / 2) * ySwapTreshold
      const maxY = (hoverBoundingRect.height / 2) * (1 + ySwapTreshold)
      const isCursorNearCenterY = hoverClientY > minY && hoverClientY < maxY

      if (
        (containerLayout === DRAG_CONTAINER_LAYOUT.HORIZONTAL ||
          containerLayout === DRAG_CONTAINER_LAYOUT.GRID) &&
        !isCursorNearCenterX
      ) {
        return
      }

      if (
        (containerLayout === DRAG_CONTAINER_LAYOUT.VERTICAL ||
          containerLayout === DRAG_CONTAINER_LAYOUT.GRID) &&
        !isCursorNearCenterY
      ) {
        return
      }

      swapAlgorithmsPosition(item.algorithm, algorithm)
    },
  })
  drag(drop(ref))

  return { isDragging, ref, handlerId, preview }
}
