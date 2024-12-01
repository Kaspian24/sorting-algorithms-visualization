import { useEffect, useRef } from 'react'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { ChartDataField } from '@renderer/types/types'
import * as d3 from 'd3'

export interface ChartBarChartProps {
  chartDataState: ChartDataField[]
}

export default function ChartBarChart({ chartDataState }: ChartBarChartProps) {
  const { defaultChartDataState } = useGlobalChartsInfo()

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const width = 600
    const height = 400
    const barWidth = width / chartDataState.length

    const xScale = d3
      .scaleBand()
      .domain(chartDataState.map((d) => d.key))
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(defaultChartDataState, (d) => d.number)!])
      .range([height, 0])

    const bars = svg
      .selectAll<SVGRectElement, ChartDataField>('.bar')
      .data(chartDataState, (d: ChartDataField) => d.key)

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.key)!)
      .attr('y', (d) => yScale(d.number))
      .attr('width', barWidth - 2)
      .attr('height', (d) => height - yScale(d.number))
      .attr('fill', (d) => d.fill)
      .style('transition-property', (d) => d.style.transitionProperty)
      .style('transition-duration', (d) => d.style.transitionDuration)
      .style('transform-origin', 'bottom')
      .style('transform', (d) => d.style.transform)

    bars
      .attr('x', (d) => xScale(d.key)!)
      .attr('y', (d) => yScale(d.number))
      .attr('width', barWidth - 2)
      .attr('height', (d) => height - yScale(d.number))
      .attr('fill', (d) => d.fill)
      .style('transition-property', (d) => d.style.transitionProperty)
      .style('transition-duration', (d) => d.style.transitionDuration)
      .style('transform-origin', 'bottom')
      .style('transform', (d) => d.style.transform)

    bars.exit().remove()
  }, [chartDataState, defaultChartDataState])

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
