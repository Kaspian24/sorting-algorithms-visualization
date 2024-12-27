import { useEffect, useState } from 'react'
import {
  getColorMappingFunction,
  getTransformMappingFunction,
  getTransitionPropertyMappingFunction,
} from '@renderer/components/ChartCard/utils'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { ChartData } from '@renderer/types/types'

export interface ChartBarChartProps {
  chartDataState: ChartData
}

export default function ChartBarChart({ chartDataState }: ChartBarChartProps) {
  const { defaultChartDataState, directionForwardRef, durationRef } =
    useGlobalChartsInfo()

  const [bars, setBars] = useState<React.JSX.Element[]>([])

  useEffect(() => {
    const { fields, visualization } = chartDataState
    const { numbers, action } = visualization

    const firstNumber = numbers?.[0]
    const secondNumber = numbers?.[1]
    const firstKey = fields?.[firstNumber]?.key
    const secondKey = fields?.[secondNumber]?.key

    const width = 600
    const height = 400
    const barWidth = width / chartDataState.fields.length

    const maxNumber = Math.max(
      ...defaultChartDataState.fields.map((field) => field.number),
    )

    const xScale = (key: number) => (key / chartDataState.fields.length) * width
    const yScale = (number: number) => height - (number / maxNumber) * height

    const colorMapping = getColorMappingFunction(action, firstKey, secondKey)
    const transformMapping = getTransformMappingFunction(
      action,
      firstKey,
      secondKey,
      firstNumber,
      secondNumber,
      fields,
    )
    const transitionPropertyMapping = getTransitionPropertyMappingFunction(
      directionForwardRef.current,
      action,
      firstKey,
      secondKey,
    )

    const newBars = chartDataState.fields.map((field) => (
      <rect
        key={field.key}
        className="bar"
        x={xScale(field.key)}
        y={yScale(field.number)}
        width={barWidth - 2}
        height={height - yScale(field.number)}
        fill={colorMapping(field.key)}
        style={{
          transitionProperty: transitionPropertyMapping(field.key),
          transitionDuration: `${durationRef.current}ms`,
          transformOrigin: 'bottom',
          transform: transformMapping(field.key),
        }}
      />
    ))

    setBars(newBars)
  }, [chartDataState, defaultChartDataState, directionForwardRef, durationRef])

  return (
    <div className="h-0 flex-auto">
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {bars}
      </svg>
    </div>
  )
}
