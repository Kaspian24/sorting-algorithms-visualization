import { createContext, ReactNode, useContext, useRef } from 'react'
import { useChartControl } from '@renderer/components/ChartControlProvider/ChartControlProvider'
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
}

const ChartStateContext = createContext<ChartStateContextType | undefined>(
  undefined,
)

interface ChartStateProviderProps {
  children: ReactNode
}

export function ChartStateProvider({ children }: ChartStateProviderProps) {
  const { defaultChartData } = useChartControl()
  const chartDataRef = useRef(defaultChartData)
  const highlightCounterRef = useRef(0)
  const compareActionCounterRef = useRef(0)
  const compareActionRef = useRef<CompareAction>(COMPARE_ACTION.HIGHLIGHT)

  const value: ChartStateContextType = {
    chartDataRef,
    highlightCounterRef,
    compareActionCounterRef,
    compareActionRef,
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
