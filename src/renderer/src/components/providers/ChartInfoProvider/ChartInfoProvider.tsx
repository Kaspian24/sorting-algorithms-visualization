import { createContext, ReactNode, useContext, useRef } from 'react'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import {
  CHART_ACTION,
  ChartAction,
  ChartCheckpoint,
  ChartData,
} from '@renderer/types/types'

interface ChartInfoContextType {
  chartActionRef: React.MutableRefObject<ChartAction>
  maxChartActionCounterRef: React.MutableRefObject<number>
  maxChartCompareCounterRef: React.MutableRefObject<number>
  chartDataRef: React.MutableRefObject<ChartData>
  chartActionCounterRef: React.MutableRefObject<number>
  chartCompareCounterRef: React.MutableRefObject<number>
  chartCheckpointsRef: React.MutableRefObject<ChartCheckpoint[]>
  sortVariablesRef: React.MutableRefObject<object>
}

const ChartInfoContext = createContext<ChartInfoContextType | undefined>(
  undefined,
)

interface ChartInfoProviderProps {
  children: ReactNode
}

export function ChartInfoProvider({ children }: ChartInfoProviderProps) {
  const { defaultChartDataRef } = useGlobalChartsInfo()

  const chartActionRef = useRef<ChartAction>(CHART_ACTION.COMPARE)
  const maxChartActionCounterRef = useRef<number>(0)
  const maxChartCompareCounterRef = useRef<number>(0)
  const chartDataRef = useRef<ChartData>(defaultChartDataRef.current)
  const chartActionCounterRef = useRef<number>(0)
  const chartCompareCounterRef = useRef<number>(0)
  const chartCheckpointsRef = useRef<ChartCheckpoint[]>([])
  const sortVariablesRef = useRef<object>({})

  const value: ChartInfoContextType = {
    chartActionRef,
    maxChartActionCounterRef,
    maxChartCompareCounterRef,
    chartDataRef,
    chartActionCounterRef,
    chartCompareCounterRef,
    chartCheckpointsRef,
    sortVariablesRef,
  }

  return (
    <ChartInfoContext.Provider value={value}>
      {children}
    </ChartInfoContext.Provider>
  )
}

export function useChartInfo() {
  const context = useContext(ChartInfoContext)

  if (!context) {
    throw new Error('useChartInfo must be used within ChartInfoProvider')
  }
  return context
}
