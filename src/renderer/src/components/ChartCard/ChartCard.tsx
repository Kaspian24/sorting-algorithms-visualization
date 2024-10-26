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
  ContextMenuItem,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import useChartCard from '@renderer/hooks/useChartCard'
import {
  COMPARE_ACTION,
  SORTING_ALGORITHM,
  SortingAlgorithm,
} from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'
import { Bar, BarChart, LabelList } from 'recharts'

export interface ChartCardProps {
  algorithm: keyof typeof SORTING_ALGORITHM
  sortingAlgorithm: SortingAlgorithm
}

function ChartCard({ algorithm, sortingAlgorithm }: ChartCardProps) {
  const { chartConfig, renderCustomizedLabel } = useChartCard(sortingAlgorithm)
  const {
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    maxCompareActionCounterRef,
    maxHighlightCounterRef,
    compareActionRef,
  } = useChartState()
  const {
    setAlgorithmVisibility,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
  } = useChartsInfo()

  return (
    <Card className="flex flex-col">
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
            <p>
              {compareActionCounterRef.current}/
              {maxCompareActionCounterRef.current}
            </p>
            <p>
              {highlightCounterRef.current}/{maxHighlightCounterRef.current}
            </p>
            <p>
              {compareActionRef.current === COMPARE_ACTION.FINISHED
                ? 'finished'
                : 'not finished'}
            </p>
          </CardFooter>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setAlgorithmVisibility(algorithm, false)}
          >
            Remove (&times;)
          </ContextMenuItem>
          <ContextMenuItem onClick={() => moveAlgorithmPositionLeft(algorithm)}>
            Move left (&larr;)
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => moveAlgorithmPositionRight(algorithm)}
          >
            Move right (&rarr;)
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  )
}

function ChartCardWrapper({ algorithm, sortingAlgorithm }: ChartCardProps) {
  return (
    <ChartStateProvider>
      <ChartCard algorithm={algorithm} sortingAlgorithm={sortingAlgorithm} />
    </ChartStateProvider>
  )
}

export { ChartCardWrapper as ChartCard }
