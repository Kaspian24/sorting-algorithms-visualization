import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
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
}

export default function AlgorithmContextMenuCheckboxItem({
  algorithm,
  visible,
}: AlgorithmContextMenuCheckboxItemProps) {
  const { setAlgorithmVisibility } = useChartsInfo()
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
    >
      {constantToTitleCase(algorithm)}
    </ContextMenuCheckboxItem>
  )
}
