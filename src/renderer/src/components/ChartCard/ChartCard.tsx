import {
  ChartStateProvider,
  useChartState,
} from '@renderer/components/ChartStateProvider/ChartStateProvider'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/Card'
import { ChartContainer } from '@renderer/components/ui/Chart'
import useChartCard from '@renderer/hooks/useChartCard'
import { COMPARE_ACTION, SortingAlgorithm } from '@renderer/types/types'
import { Bar, BarChart, LabelList } from 'recharts'

export interface ChartCardProps {
  title: string
  sortingAlgorithm: SortingAlgorithm
}

function ChartCard({ title, sortingAlgorithm }: ChartCardProps) {
  const { chartConfig, renderCustomizedLabel } = useChartCard(sortingAlgorithm)
  const {
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    maxCompareActionCounterRef,
    maxHighlightCounterRef,
    compareActionRef,
  } = useChartState()

  return (
    <Card>
      <CardHeader className="border-b p-6 text-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig}>
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
      <CardFooter className="justify-center gap-4 border-t p-6">
        <p>
          {compareActionCounterRef.current}/{maxCompareActionCounterRef.current}
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
    </Card>
  )
}

function ChartCardWrapper({ title, sortingAlgorithm }: ChartCardProps) {
  return (
    <ChartStateProvider>
      <ChartCard title={title} sortingAlgorithm={sortingAlgorithm} />
    </ChartStateProvider>
  )
}

export { ChartCardWrapper as ChartCard }
