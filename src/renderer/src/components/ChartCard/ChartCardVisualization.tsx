import ChartBarChart from '@renderer/components/ChartCard/ChartBarChart'
import ChartCardFooter from '@renderer/components/ChartCard/ChartCardFooter'
import ChartCardInfo from '@renderer/components/ChartCard/ChartCardInfo'
import { CardContent } from '@renderer/components/ui/Card'
import useChartCard from '@renderer/hooks/useChartCard'
import { SortingAlgorithm } from '@renderer/types/types'

export interface ChartCardVisualizationProps {
  sortingAlgorithm: SortingAlgorithm
  showInfo: boolean
}

export default function ChartCardVisualization({
  sortingAlgorithm,
  showInfo,
}: ChartCardVisualizationProps) {
  const {
    chartDataState,
    chartActionCounterState,
    chartCompareCounterState,
    maxChartActionCounterState,
    maxChartCompareCounterState,
    info,
  } = useChartCard(sortingAlgorithm)

  return (
    <>
      <CardContent className="flex grow flex-col justify-center p-6 pt-0">
        {showInfo ? (
          <ChartCardInfo info={info} />
        ) : (
          <ChartBarChart chartDataState={chartDataState} />
        )}
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
