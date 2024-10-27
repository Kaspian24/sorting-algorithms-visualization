import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  ChartStateProvider,
  useChartState,
} from '@renderer/components/providers/ChartStateProvider'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/Card'
import { ChartContainer } from '@renderer/components/ui/Chart'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import { Progress } from '@renderer/components/ui/Progress'
import useChartCard from '@renderer/hooks/useChartCard'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import {
  DRAG_ITEM_TYPE,
  SORTING_ALGORITHM,
  SortingAlgorithm,
} from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'
import { Bar, BarChart, LabelList } from 'recharts'

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
  const { chartConfig, renderCustomizedLabel } = useChartCard(sortingAlgorithm)
  const {
    chartDataRef,
    compareActionCounterState,
    highlightCounterRef,
    maxCompareActionCounterRef,
    maxHighlightCounterRef,
  } = useChartState()
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
      className={`flex flex-col ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={ref}
      data-handler-id={handlerId}
      {...flippedProps}
    >
      <ContextMenu>
        <ContextMenuTrigger className="contents">
          <CardHeader className="text-center">
            <CardTitle>{constantToTitleCase(algorithm)}</CardTitle>
          </CardHeader>
          <CardContent className="flex grow flex-col justify-center p-6 pt-0">
            <ChartContainer config={chartConfig} className="h-0 flex-auto">
              <BarChart
                accessibilityLayer
                data={chartDataRef.current}
                margin={{
                  top: 20,
                }}
              >
                <Bar dataKey="number" radius={8} isAnimationActive={false}>
                  <LabelList
                    position="inside"
                    offset={12}
                    fontSize={12}
                    content={renderCustomizedLabel}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="justify-center gap-4">
            <p>{highlightCounterRef.current}</p>
            <Progress
              value={
                (compareActionCounterState /
                  maxCompareActionCounterRef.current) *
                100
              }
            />
            <p>{maxHighlightCounterRef.current}</p>
          </CardFooter>
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
