import { useState } from 'react'
import ChartCardVisualization from '@renderer/components/ChartCard/ChartCardVisualization'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { ChartInfoProvider } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@renderer/components/ui/Card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
  SortingAlgorithm,
} from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'
import { X } from 'lucide-react'

export interface ChartCardProps {
  algorithm: keyof typeof SORTING_ALGORITHM
  sortingAlgorithm: SortingAlgorithm
  flippedProps: object
}

function ChartCard({
  algorithm,
  sortingAlgorithm,
  flippedProps,
}: ChartCardProps) {
  const {
    setAlgorithmsVisibility,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
  } = useAlgorithmsVisibility()
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CHART_CARD,
    algorithm,
  )

  const [showInfo, setShowInfo] = useState(false)

  return (
    <Card
      className={`min-w-137.5 flex min-h-64 flex-col ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={ref}
      data-handler-id={handlerId}
      {...flippedProps}
    >
      <ContextMenu>
        <ContextMenuTrigger className="contents">
          <CardHeader className="flex flex-row justify-between space-y-0 p-0 text-center">
            <div className="flex-1" />
            <div className="py-6">
              <CardTitle>{constantToTitleCase(algorithm)}</CardTitle>
            </div>
            <div className="flex flex-1 justify-end pr-1 pt-1">
              <Button
                className={`h-fit w-fit rounded-full p-1`}
                variant={`${showInfo ? 'reversedOutline' : 'outline'}`}
                onClick={() => setShowInfo((prev) => !prev)}
              >
                <p className="flex h-6 w-6 items-center justify-center text-lg">
                  i
                </p>
              </Button>
              <Button
                className="h-fit w-fit rounded-full p-1"
                variant="outline"
                onClick={() => setAlgorithmsVisibility(algorithm, false)}
              >
                <X />
              </Button>
            </div>
          </CardHeader>
          <ChartCardVisualization
            sortingAlgorithm={sortingAlgorithm}
            showInfo={showInfo}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setAlgorithmsVisibility(algorithm, false)}
          >
            Remove (&times;)
          </ContextMenuItem>
          <ContextMenuLabel className="text-center">Move</ContextMenuLabel>
          <ContextMenuGroup className="flex">
            <ContextMenuItem
              onClick={() => moveAlgorithmPositionLeft(algorithm)}
            >
              Left (&larr;)
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => moveAlgorithmPositionRight(algorithm)}
            >
              Right (&rarr;)
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  )
}

function ChartCardWrapper({
  algorithm,
  sortingAlgorithm,
  flippedProps,
}: ChartCardProps) {
  return (
    <ChartInfoProvider>
      <ChartCard
        algorithm={algorithm}
        sortingAlgorithm={sortingAlgorithm}
        flippedProps={flippedProps}
      />
    </ChartInfoProvider>
  )
}

export { ChartCardWrapper as ChartCard }
