import { CardFooter } from '@renderer/components/ui/Card'
import { Progress } from '@renderer/components/ui/Progress'

interface ChartCardFooterProps {
  chartActionCounterState: number
  chartCompareCounterState: number
  maxChartActionCounterState: number
  maxChartCompareCounterState: number
}

export default function ChartCardFooter({
  chartActionCounterState,
  chartCompareCounterState,
  maxChartActionCounterState,
  maxChartCompareCounterState,
}: ChartCardFooterProps) {
  return (
    <CardFooter className="flex flex-col justify-center">
      <div className="flex w-full items-center justify-center gap-4">
        <p>{chartActionCounterState}</p>
        <Progress
          value={(chartActionCounterState / maxChartActionCounterState) * 100}
          className="w-3/4"
          indicatorClassName={`${chartActionCounterState === maxChartActionCounterState ? 'bg-red-400' : ''}`}
        />
        <p>{maxChartActionCounterState}</p>
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <p>
          Comparisons: {chartCompareCounterState} /{' '}
          {maxChartCompareCounterState}
        </p>
      </div>
    </CardFooter>
  )
}
