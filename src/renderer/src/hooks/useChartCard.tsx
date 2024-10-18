import { useCallback, useEffect, useState } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import { ChartConfig } from '@renderer/components/ui/Chart'
import { COMPARE_ACTION, SortingAlgorithm } from '@renderer/types/types'
import { LabelProps } from 'recharts'

export default function useChartCard(sortingAlgorithm: SortingAlgorithm) {
  const [maxCompareActionCounter, setMaxCompareActionsCounter] = useState(0)
  const [maxHighlightCounter, setMaxHighlightCounter] = useState(0)
  const {
    addControlData,
    removeControlData,
    compareActionCounterRef: globalCompareActionCounterRef,
  } = useChartControl()
  const {
    sortFunction,
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    compareActionRef,
    reset,
  } = sortingAlgorithm()

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

  const measureText = useCallback(
    (value: number, fontSize: number, fontFamily: string) => {
      const tempSvg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
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
    },
    [],
  )

  const renderCustomizedLabel = useCallback(
    ({
      x,
      y,
      width,
      height,
      value,
      fontSize,
      fontFamily = 'sans-serif',
      ...props
    }: LabelProps) => {
      x = Number(x)
      y = Number(y)
      width = Number(width)
      height = Number(height)
      value = Number(value)
      fontSize = Number(fontSize)

      const { labelWidth, labelHeight } = measureText(
        value,
        fontSize,
        fontFamily,
      )

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
    },
    [measureText],
  )

  useEffect(() => {
    while (compareActionRef.current !== COMPARE_ACTION.FINISHED) {
      sortFunction()
    }
    setMaxCompareActionsCounter(compareActionCounterRef.current)
    setMaxHighlightCounter(highlightCounterRef.current)
    reset()

    while (
      compareActionCounterRef.current < globalCompareActionCounterRef.current &&
      compareActionRef.current !== COMPARE_ACTION.FINISHED
    ) {
      sortFunction()
    }

    const instance = {
      sortFunction,
      compareActionCounterRef,
      compareActionRef,
      reset,
      maxCompareActionCounter,
    }

    addControlData(instance)

    return () => {
      removeControlData(instance)
    }
  }, [
    addControlData,
    compareActionCounterRef,
    compareActionRef,
    globalCompareActionCounterRef,
    highlightCounterRef,
    maxCompareActionCounter,
    removeControlData,
    reset,
    sortFunction,
  ])

  return {
    sortFunction,
    chartDataRef,
    compareActionCounterRef,
    highlightCounterRef,
    compareActionRef,
    reset,
    maxCompareActionCounter,
    maxHighlightCounter,
    chartConfig,
    renderCustomizedLabel,
  }
}
