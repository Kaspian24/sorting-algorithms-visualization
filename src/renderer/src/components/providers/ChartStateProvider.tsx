import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  CHART_ACTION,
  ChartAction,
  ChartCheckpoint,
  ChartDataField,
} from '@renderer/types/types'

interface ChartStateContextType {
  chartActionRef: React.MutableRefObject<ChartAction>
  getMaxChartActionCounter: () => number
  setMaxChartActionCounter: (value: number) => void
  maxChartActionCounterState: number
  getMaxChartCompareCounter: () => number
  setMaxChartCompareCounter: (value: number) => void
  maxChartCompareCounterState: number
  getChartData: () => ChartDataField[]
  setChartData: (value: ChartDataField[]) => void
  linkChartDataSetState: (f: (value: ChartDataField[]) => void) => void
  getChartActionCounter: () => number
  setChartActionCounter: (value: number) => void
  linkChartActionCounterSetState: (f: (value: number) => void) => void
  getChartCompareCounter: () => number
  setChartCompareCounter: (value: number) => void
  linkChartCompareCounterSetState: (f: (value: number) => void) => void
  chartCheckpointsRef: React.MutableRefObject<ChartCheckpoint[]>
  sortVariablesRef: React.MutableRefObject<object>
}

const ChartStateContext = createContext<ChartStateContextType | undefined>(
  undefined,
)

interface ChartStateProviderProps {
  children: ReactNode
}

export function ChartStateProvider({ children }: ChartStateProviderProps) {
  const { getDefaultChartData } = useChartsInfo()
  const chartActionRef = useRef<ChartAction>(CHART_ACTION.COMPARE)

  const maxChartActionCounterRef = useRef<number>(0)
  const [maxChartActionCounterState, setMaxChartActionCounterState] =
    useState<number>(0)
  const getMaxChartActionCounter = useCallback(() => {
    return maxChartActionCounterRef.current
  }, [])
  const setMaxChartActionCounter = useCallback((value: number) => {
    maxChartActionCounterRef.current = value
    setMaxChartActionCounterState(value)
  }, [])

  const maxChartCompareCounterRef = useRef<number>(0)
  const [maxChartCompareCounterState, setMaxChartCompareCounterState] =
    useState<number>(0)
  const getMaxChartCompareCounter = useCallback(() => {
    return maxChartCompareCounterRef.current
  }, [])
  const setMaxChartCompareCounter = useCallback((value: number) => {
    maxChartCompareCounterRef.current = value
    setMaxChartCompareCounterState(value)
  }, [])

  const chartDataRef = useRef<ChartDataField[]>(getDefaultChartData())
  const chartDataSetState = useRef<(value: ChartDataField[]) => void>(() => {})
  const linkChartDataSetState = useCallback(
    (f: (value: ChartDataField[]) => void) => {
      chartDataSetState.current = f
    },
    [],
  )
  const getChartData = useCallback(() => {
    return chartDataRef.current
  }, [])
  const setChartData = useCallback((value: ChartDataField[]) => {
    chartDataRef.current = value
    chartDataSetState.current(value)
  }, [])

  const chartActionCounterRef = useRef<number>(0)
  const chartActionCounterSetState = useRef<(value: number) => void>(() => {})
  const linkChartActionCounterSetState = useCallback(
    (f: (value: number) => void) => {
      chartActionCounterSetState.current = f
    },
    [],
  )
  const getChartActionCounter = useCallback(() => {
    return chartActionCounterRef.current
  }, [])
  const setChartActionCounter = useCallback((value: number) => {
    chartActionCounterRef.current = value
    chartActionCounterSetState.current(value)
  }, [])

  const chartCompareCounterRef = useRef<number>(0)
  const chartCompareCounterSetState = useRef<(value: number) => void>(() => {})
  const linkChartCompareCounterSetState = useCallback(
    (f: (value: number) => void) => {
      chartCompareCounterSetState.current = f
    },
    [],
  )
  const getChartCompareCounter = useCallback(() => {
    return chartCompareCounterRef.current
  }, [])
  const setChartCompareCounter = useCallback((value: number) => {
    chartCompareCounterRef.current = value
    chartCompareCounterSetState.current(value)
  }, [])

  const chartCheckpointsRef = useRef<ChartCheckpoint[]>([])

  const sortVariablesRef = useRef<object>({})

  const value: ChartStateContextType = {
    chartActionRef,
    getMaxChartActionCounter,
    setMaxChartActionCounter,
    maxChartActionCounterState,
    getMaxChartCompareCounter,
    setMaxChartCompareCounter,
    maxChartCompareCounterState,
    getChartData,
    setChartData,
    linkChartDataSetState,
    getChartActionCounter,
    setChartActionCounter,
    linkChartActionCounterSetState,
    getChartCompareCounter,
    setChartCompareCounter,
    linkChartCompareCounterSetState,
    chartCheckpointsRef,
    sortVariablesRef,
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
