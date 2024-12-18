import { useEffect, useRef } from 'react'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { CHART_ACTION, ChartData, ChartDataField } from '@renderer/types/types'
import * as d3 from 'd3'

export interface ChartBarChartProps {
  chartDataState: ChartData
}

export default function ChartBarChart({ chartDataState }: ChartBarChartProps) {
  const { defaultChartDataState, directionForwardRef, durationRef } =
    useGlobalChartsInfo()

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const { fields, visualization } = chartDataState
    const { numbers, action } = visualization

    const firstIndex = numbers?.[0]
    const secondIndex = numbers?.[1]
    const firstKey = fields?.[firstIndex]?.key
    const secondKey = fields?.[secondIndex]?.key

    const duration = durationRef.current
    const isForward = directionForwardRef.current

    const svg = d3.select(svgRef.current)
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
        return `scaleY(${1 / (fields[firstIndex!].number / secondKey)})`
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

    const xScale = d3
      .scaleBand()
      .domain(chartDataState.fields.map((d) => d.key.toString()))
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(defaultChartDataState.fields, (d) => d.number)!])
      .range([height, 0])

    const bars = svg
      .selectAll<SVGRectElement, ChartDataField>('.bar')
      .data(chartDataState.fields, (d: ChartDataField) => d.key)

    bars.enter().append('rect').attr('class', 'bar')

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .merge(bars)
      .attr('x', (d) => xScale(d.key.toString())!)
      .attr('y', (d) => yScale(d.number))
      .attr('width', barWidth - 2)
      .attr('height', (d) => height - yScale(d.number))
      .attr('fill', (d) => colorMapping(d.key))
      .style('transition-property', (d) => transitionProperty(d.key))
      .style('transition-duration', `${duration}ms`)
      .style('transform-origin', 'bottom')
      .style('transform', (d) => transformMapping(d.key))

    bars.exit().remove()
  }, [chartDataState, defaultChartDataState, directionForwardRef, durationRef])

  return (
    <div className="h-0 flex-auto">
      <svg
        ref={svgRef}
        viewBox="0 0 600 400"
        preserveAspectRatio="none"
        className="h-full w-full"
      ></svg>
    </div>
  )
}
