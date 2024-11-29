import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider'
import { ContextMenuCheckboxItem } from '@renderer/components/ui/ContextMenu'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_CONTAINER_LAYOUT,
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
} from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'

export interface AlgorithmContextMenuCheckboxItemProps {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
  flippedProps: object
}

export default function AlgorithmContextMenuCheckboxItem({
  algorithm,
  visible,
  flippedProps,
}: AlgorithmContextMenuCheckboxItemProps) {
  const { setAlgorithmVisibility } = useGlobalChartsInfo()
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CONTEXT_ITEM,
    algorithm,
    DRAG_CONTAINER_LAYOUT.VERTICAL,
  )

  return (
    <ContextMenuCheckboxItem
      className={`${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={ref}
      data-handler-id={handlerId}
      checked={visible}
      onClick={(e) => {
        e.preventDefault()
        setAlgorithmVisibility(
          algorithm as keyof typeof SORTING_ALGORITHM,
          !visible,
        )
      }}
      {...flippedProps}
    >
      {constantToTitleCase(algorithm)}
    </ContextMenuCheckboxItem>
  )
}
