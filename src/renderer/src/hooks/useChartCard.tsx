import { useEffect, useRef } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import { useChartState } from '@renderer/components/providers/ChartStateProvider'
import { ChartConfig } from '@renderer/components/ui/Chart'
import {
  CHART_ACTION,
  ChartInfoData,
  SortingAlgorithm,
} from '@renderer/types/types'
import { LabelProps } from 'recharts'

const chartConfig = {
  default: {
    color: 'hsl(var(--chart-1))',
  },
  first: {
    color: 'hsl(var(--chart-2))',
  },
  second: {
    color: 'hsl(var(--chart-3))',
  },
  swap: {
    color: 'hsl(var(--chart-4))',
  },
  finished: {
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

function measureText(value: number, fontSize: number, fontFamily: string) {
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(tempSvg)

  const textElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'text',
  )
  textElement.textContent = value.toString()
  textElement.setAttribute('font-size', `${fontSize}px`)
  textElement.setAttribute('font-family', fontFamily)
  tempSvg.appendChild(textElement)

  const bbox = textElement.getBBox()
  const labelWidth = bbox.width
  const labelHeight = bbox.height

  document.body.removeChild(tempSvg)

  return { labelWidth, labelHeight }
}

function renderCustomizedLabel({
  x,
  y,
  width,
  height,
  value,
  fontSize,
  fontFamily = 'sans-serif',
  ...props
}: LabelProps) {
  x = Number(x)
  y = Number(y)
  width = Number(width)
  height = Number(height)
  value = Number(value)
  fontSize = Number(fontSize)

  const { labelWidth, labelHeight } = measureText(value, fontSize, fontFamily)

  return width > labelWidth && height > labelHeight ? (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily={fontFamily}
      className={`recharts-text fill-foreground ${props.className}`}
      style={props.style}
    >
      <tspan>{value}</tspan>
    </text>
  ) : null
}

export default function useChartCard(sortingAlgorithm: SortingAlgorithm) {
  const {
    addChartInfoData,
    removeChartInfoData,
    globalChartActionCounterRef: globalCompareActionCounterRef,
  } = useChartsInfo()
  const { sortFunction, reset } = sortingAlgorithm()
  const {
    chartDataRef,
    chartActionRef: compareActionRef,
    chartActionCounterRef: compareActionCounterRef,
    chartCompareCounterRef: highlightCounterRef,
    maxChartActionCounterRef: maxCompareActionCounterRef,
    maxChartCompareCounterRef: maxHighlightCounterRef,
    setMaxChartActionCounter: setMaxCompareActionCounter,
  } = useChartState()

  const controlData = useRef<ChartInfoData>({
    sortFunction,
    reset,
    maxChartActionCounterRef: maxCompareActionCounterRef,
    maxChartCompareCounterRef: maxHighlightCounterRef,
    chartDataRef,
    chartActionRef: compareActionRef,
    chartActionCounterRef: compareActionCounterRef,
    chartCompareCounterRef: highlightCounterRef,
  })

  useEffect(() => {
    while (compareActionRef.current !== CHART_ACTION.FINISHED) {
      sortFunction()
    }
    maxCompareActionCounterRef.current = compareActionCounterRef.current
    maxHighlightCounterRef.current = highlightCounterRef.current
    reset()

    while (
      compareActionCounterRef.current < globalCompareActionCounterRef.current &&
      compareActionRef.current !== CHART_ACTION.FINISHED
    ) {
      sortFunction()
    }

    setMaxCompareActionCounter(maxCompareActionCounterRef.current)

    addChartInfoData(controlData)

    return () => {
      removeChartInfoData(controlData)
    }
  }, [
    addChartInfoData,
    compareActionCounterRef,
    compareActionRef,
    globalCompareActionCounterRef,
    highlightCounterRef,
    maxCompareActionCounterRef,
    maxHighlightCounterRef,
    removeChartInfoData,
    reset,
    setMaxCompareActionCounter,
    sortFunction,
  ])

  return {
    renderCustomizedLabel,
    sortFunction,
    reset,
    chartConfig,
  }
}
