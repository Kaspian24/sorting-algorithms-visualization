import { useEffect, useState } from 'react'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { CHART_ACTION, ChartData } from '@renderer/types/types'

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

    const duration = durationRef.current
    const isForward = directionForwardRef.current

    const width = 600
    const height = 400
    const barWidth = width / chartDataState.fields.length

    const colorMapping = (key: number) => {
      if (key === firstKey) {
        return action === CHART_ACTION.ANIMATE_SWAP ||
          action === CHART_ACTION.ANIMATE_REPLACE
          ? 'hsl(var(--chart-swap))'
          : 'hsl(var(--chart-compare-first))'
      }
      if (key === secondKey) {
        return action === CHART_ACTION.ANIMATE_SWAP
          ? 'hsl(var(--chart-swap))'
          : action === CHART_ACTION.ANIMATE_REPLACE
            ? 'hsl(var(--chart-default))'
            : 'hsl(var(--chart-compare-second))'
      }
      return action === CHART_ACTION.FINISHED
        ? 'hsl(var(--chart-finish))'
        : 'hsl(var(--chart-default))'
    }

    const transformMapping = (key: number) => {
      if (action === CHART_ACTION.ANIMATE_SWAP) {
        if (key === firstKey)
          return `translateX(${(Math.abs(firstKey - secondKey) / fields.length) * 100}%)`
        if (key === secondKey)
          return `translateX(${(-Math.abs(firstKey - secondKey) / fields.length) * 100}%)`
      } else if (action === CHART_ACTION.ANIMATE_REPLACE && key === firstKey) {
        return `scaleY(${1 / (fields[firstNumber!].number / secondNumber)})`
      }
      return 'translateX(0%) scaleY(1)'
    }

    const transitionProperty = (key: number) => {
      if (
        ((key === firstKey && action === CHART_ACTION.ANIMATE_REPLACE) ||
          ((key === firstKey || key === secondKey) &&
            action === CHART_ACTION.ANIMATE_SWAP)) &&
        isForward
      ) {
        return 'transform'
      }
      return 'none'
    }

    const xScale = (key: number) => (key / chartDataState.fields.length) * width
    const yScale = (number: number) =>
      height -
      (number /
        Math.max(
          ...defaultChartDataState.fields.map((field) => field.number),
        )) *
        height

    const newBars = chartDataState.fields.map((d) => (
      <rect
        key={d.key}
        className="bar"
        x={xScale(d.key)}
        y={yScale(d.number)}
        width={barWidth - 2}
        height={height - yScale(d.number)}
        fill={colorMapping(d.key)}
        style={{
          transitionProperty: transitionProperty(d.key),
          transitionDuration: `${duration}ms`,
          transformOrigin: 'bottom',
          transform: transformMapping(d.key),
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
