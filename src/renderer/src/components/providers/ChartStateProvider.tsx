import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  ChartDataField,
  COMPARE_ACTION,
  CompareAction,
} from '@renderer/types/types'

interface ChartStateContextType {
  chartDataRef: React.MutableRefObject<ChartDataField[]>
  compareActionCounterRef: React.MutableRefObject<number>
  highlightCounterRef: React.MutableRefObject<number>
  compareActionRef: React.MutableRefObject<CompareAction>
  maxCompareActionCounterRef: React.MutableRefObject<number>
  maxHighlightCounterRef: React.MutableRefObject<number>
  setMaxCompareActionCounter: React.Dispatch<React.SetStateAction<number>>
}

const ChartStateContext = createContext<ChartStateContextType | undefined>(
  undefined,
)

interface ChartStateProviderProps {
  children: ReactNode
}

export function ChartStateProvider({ children }: ChartStateProviderProps) {
  const { defaultChartData } = useChartsInfo()
  const maxCompareActionCounterRef = useRef<number>(0)
  const maxHighlightCounterRef = useRef<number>(0)
  const chartDataRef = useRef<ChartDataField[]>(defaultChartData)
  const compareActionRef = useRef<CompareAction>(COMPARE_ACTION.HIGHLIGHT)
  const compareActionCounterRef = useRef<number>(0)
  const highlightCounterRef = useRef<number>(0)

  const [, setMaxCompareActionCounter] = useState<number>(0)

  const value: ChartStateContextType = {
    chartDataRef,
    highlightCounterRef,
    compareActionCounterRef,
    compareActionRef,
    maxCompareActionCounterRef,
    maxHighlightCounterRef,
    setMaxCompareActionCounter,
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
