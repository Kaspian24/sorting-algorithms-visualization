import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  CHART_ACTION,
  ChartAction,
  ChartDataField,
} from '@renderer/types/types'

interface ChartStateContextType {
  chartDataRef: React.MutableRefObject<ChartDataField[]>
  chartActionCounterRef: React.MutableRefObject<number>
  chartCompareCounterRef: React.MutableRefObject<number>
  chartActionRef: React.MutableRefObject<ChartAction>
  maxChartActionCounterRef: React.MutableRefObject<number>
  maxChartCompareCounterRef: React.MutableRefObject<number>
  setMaxChartActionCounter: React.Dispatch<React.SetStateAction<number>>
  chartActionCounterState: number
  setChartActionCounter: React.Dispatch<React.SetStateAction<number>>
}

const ChartStateContext = createContext<ChartStateContextType | undefined>(
  undefined,
)

interface ChartStateProviderProps {
  children: ReactNode
}

export function ChartStateProvider({ children }: ChartStateProviderProps) {
  const { defaultChartData } = useChartsInfo()
  const maxChartActionCounterRef = useRef<number>(0)
  const maxChartCompareCounterRef = useRef<number>(0)
  const chartDataRef = useRef<ChartDataField[]>(defaultChartData)
  const chartActionRef = useRef<ChartAction>(CHART_ACTION.COMPARE)
  const chartActionCounterRef = useRef<number>(0)
  const chartCompareCounterRef = useRef<number>(0)

  const [chartActionCounterState, setChartActionCounter] = useState<number>(0)
  const [, setMaxChartActionCounter] = useState<number>(0)

  const value: ChartStateContextType = {
    chartDataRef,
    chartCompareCounterRef,
    chartActionCounterRef,
    chartActionRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    setMaxChartActionCounter,
    chartActionCounterState,
    setChartActionCounter,
  }

  return (
    <ChartStateContext.Provider value={value}>
      {children}
    </ChartStateContext.Provider>
  )
}

export function useChartState() {
  const context = useContext(ChartStateContext)

  if (!context) {
    throw new Error('useChartState must be used within ChartStateProvider')
  }
  return context
}
