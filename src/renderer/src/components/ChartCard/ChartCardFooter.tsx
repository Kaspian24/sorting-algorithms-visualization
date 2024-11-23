import { useEffect, useState } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import { CardFooter } from '@renderer/components/ui/Card'
import { Progress } from '@renderer/components/ui/Progress'

export default function ChartCardFooter() {
  const {
    linkChartActionCounterSetState,
    getChartActionCounter,
    linkChartCompareCounterSetState,
    getChartCompareCounter,
    maxChartActionCounterState,
    maxChartCompareCounterState,
  } = useChartState()
  const [chartActionCounterState, setChartActionCounterState] =
    useState<number>(() => getChartActionCounter())
  const [chartCompareCounterState, setChartCompareCounterState] =
    useState<number>(() => getChartCompareCounter())

  useEffect(() => {
    linkChartActionCounterSetState(setChartActionCounterState)
    linkChartCompareCounterSetState(setChartCompareCounterState)
  }, [linkChartActionCounterSetState, linkChartCompareCounterSetState])

  return (
    <CardFooter className="justify-center gap-4">
      <p>{chartCompareCounterState}</p>
      <Progress
        value={(chartActionCounterState / maxChartActionCounterState) * 100}
        className="w-3/4"
        indicatorClassName={`${chartActionCounterState === maxChartActionCounterState ? 'bg-red-400' : ''}`}
      />
      <p>{maxChartCompareCounterState}</p>
    </CardFooter>
  )
}
