import { useTranslation } from 'react-i18next'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { ContextMenuCheckboxItem } from '@renderer/components/ui/ContextMenu'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_CONTAINER_LAYOUT,
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
} from '@renderer/types/types'

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
  const { setAlgorithmsVisibility } = useAlgorithmsVisibility()
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CONTEXT_ITEM,
    algorithm,
    DRAG_CONTAINER_LAYOUT.VERTICAL,
  )
  const { t } = useTranslation('AlgorithmsNames')

  return (
    <ContextMenuCheckboxItem
      className={`${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={ref}
      data-handler-id={handlerId}
      checked={visible}
      onClick={(e) => {
        e.preventDefault()
        setAlgorithmsVisibility(
          algorithm as keyof typeof SORTING_ALGORITHM,
          !visible,
        )
      }}
      {...flippedProps}
    >
      {t(algorithm)}
    </ContextMenuCheckboxItem>
  )
}
