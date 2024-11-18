import { useEffect, useState } from 'react'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import { ChartContainer } from '@renderer/components/ui/Chart'
import useChartCard from '@renderer/hooks/useChartCard'
import { ChartDataField, SortingAlgorithm } from '@renderer/types/types'
import { Bar, BarChart, LabelList } from 'recharts'

export interface ChartBarChartProps {
  sortingAlgorithm: SortingAlgorithm
}

export default function ChartBarChart({
  sortingAlgorithm,
}: ChartBarChartProps) {
  const { chartConfig, renderCustomizedLabel } = useChartCard(sortingAlgorithm)
  const { getChartData, linkChartDataSetState } = useChartState()
  const [chartDataState, setChartDataState] = useState<ChartDataField[]>(() =>
    getChartData(),
  )

  useEffect(() => {
    linkChartDataSetState(setChartDataState)
  }, [linkChartDataSetState])

  return (
    <ChartContainer config={chartConfig} className="h-0 flex-auto">
      <BarChart
        accessibilityLayer
        data={chartDataState}
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
  )
}
