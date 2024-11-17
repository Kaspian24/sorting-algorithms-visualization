import { useId } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { Checkbox } from '@renderer/components/ui/Checkbox'
import { Label } from '@renderer/components/ui/Label'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_CONTAINER_LAYOUT,
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
} from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'
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
  const { setAlgorithmVisibility } = useChartsInfo()
  const { isDragging, ref, handlerId, preview } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CONTEXT_ITEM,
    algorithm,
    DRAG_CONTAINER_LAYOUT.HANDLE,
  )
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
            setAlgorithmVisibility(
              algorithm as keyof typeof SORTING_ALGORITHM,
              !visible,
            )
          }}
          id={id}
        />
        <Label className="text-lg" htmlFor={id}>
          {constantToTitleCase(algorithm)}
        </Label>
      </div>
      <div ref={ref}>
        <GripVertical />
      </div>
    </div>
  )
}
