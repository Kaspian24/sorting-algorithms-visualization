import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { Checkbox } from '@renderer/components/ui/Checkbox'
import { Label } from '@renderer/components/ui/Label'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_CONTAINER_LAYOUT,
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
} from '@renderer/types/types'
import { GripVertical } from 'lucide-react'

export interface AlgorithmsVisibilityButtonItemProps {
  algorithm: keyof typeof SORTING_ALGORITHM
  visible: boolean
  flippedProps: object
}

export default function AlgorithmsVisibilityButtonItem({
  algorithm,
  visible,
  flippedProps,
}: AlgorithmsVisibilityButtonItemProps) {
  const { setAlgorithmsVisibility } = useAlgorithmsVisibility()
  const { isDragging, ref, handlerId, preview } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CONTEXT_ITEM,
    algorithm,
    DRAG_CONTAINER_LAYOUT.HANDLE,
  )
  const { t } = useTranslation('AlgorithmsNames')
  const id = useId()

  return (
    <div
      className={`flex items-center justify-between rounded border p-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={preview}
      data-handler-id={handlerId}
      {...flippedProps}
    >
      <div className="flex items-center gap-x-2">
        <Checkbox
          checked={visible}
          onClick={(e) => {
            e.preventDefault()
            setAlgorithmsVisibility(
              algorithm as keyof typeof SORTING_ALGORITHM,
              !visible,
            )
          }}
          id={id}
        />
        <Label className="text-lg" htmlFor={id}>
          {t(algorithm)}
        </Label>
      </div>
      <div ref={ref}>
        <GripVertical />
      </div>
    </div>
  )
}
