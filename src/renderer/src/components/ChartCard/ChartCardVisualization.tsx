import ChartBarChart from '@renderer/components/ChartCard/ChartBarChart'
import ChartCardFooter from '@renderer/components/ChartCard/ChartCardFooter'
import { CardContent } from '@renderer/components/ui/Card'
import useChartCard from '@renderer/hooks/useChartCard'
import { SortingAlgorithm } from '@renderer/types/types'

export interface ChartCardVisualizationProps {
  sortingAlgorithm: SortingAlgorithm
}

export default function ChartCardVisualization({
  sortingAlgorithm,
}: ChartCardVisualizationProps) {
  const {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
  } = useChartCard(sortingAlgorithm)

  return (
    <>
      <CardContent className="flex grow flex-col justify-center p-6 pt-0">
        <ChartBarChart chartDataState={chartDataState} />
      </CardContent>
      <ChartCardFooter
        chartActionCounterState={chartActionCounterState}
        chartCompareCounterState={chartCompareCounterState}
        maxChartActionCounterState={maxChartActionCounterState}
        maxChartCompareCounterState={maxChartCompareCounterState}
      />
    </>
  )
}
