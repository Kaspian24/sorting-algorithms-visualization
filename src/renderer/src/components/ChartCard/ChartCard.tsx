import ChartBarChart from '@renderer/components/ChartCard/ChartBarChart'
import ChartCardFooter from '@renderer/components/ChartCard/ChartCardFooter'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { ChartStateProvider } from '@renderer/components/providers/ChartStateProvider'
import { Button } from '@renderer/components/ui/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/Card'
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
    setAlgorithmVisibility,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
  } = useChartsInfo()
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CHART_CARD,
    algorithm,
  )

  return (
    <Card
      className={`flex min-h-64 min-w-115 flex-col ${isDragging ? 'opacity-50' : 'opacity-100'}`}
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
                className="h-fit w-fit rounded-full p-1"
                variant="outline"
                onClick={() => setAlgorithmVisibility(algorithm, false)}
              >
                <X />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex grow flex-col justify-center p-6 pt-0">
            <ChartBarChart sortingAlgorithm={sortingAlgorithm} />
          </CardContent>
          <ChartCardFooter />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setAlgorithmVisibility(algorithm, false)}
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
    <ChartStateProvider>
      <ChartCard
        algorithm={algorithm}
        sortingAlgorithm={sortingAlgorithm}
        flippedProps={flippedProps}
      />
    </ChartStateProvider>
  )
}

export { ChartCardWrapper as ChartCard }
