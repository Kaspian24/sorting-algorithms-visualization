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
  chartDataState: ChartDataField[]
  getChartActionCounter: () => number
  setChartActionCounter: (value: number) => void
  chartActionCounterState: number
  getChartCompareCounter: () => number
  setChartCompareCounter: (value: number) => void
  chartCompareCounterState: number
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
  const [chartDataState, setChartDataState] = useState<ChartDataField[]>(() =>
    getDefaultChartData(),
  )
  const getChartData = useCallback(() => {
    return chartDataRef.current
  }, [])
  const setChartData = useCallback((value: ChartDataField[]) => {
    chartDataRef.current = value
    setChartDataState(value)
  }, [])

  const chartActionCounterRef = useRef<number>(0)
  const [chartActionCounterState, setChartActionCounterState] =
    useState<number>(0)
  const getChartActionCounter = useCallback(() => {
    return chartActionCounterRef.current
  }, [])
  const setChartActionCounter = useCallback((value: number) => {
    chartActionCounterRef.current = value
    setChartActionCounterState(value)
  }, [])

  const chartCompareCounterRef = useRef<number>(0)
  const [chartCompareCounterState, setChartCompareCounterState] =
    useState<number>(0)
  const getChartCompareCounter = useCallback(() => {
    return chartCompareCounterRef.current
  }, [])
  const setChartCompareCounter = useCallback((value: number) => {
    chartCompareCounterRef.current = value
    setChartCompareCounterState(value)
  }, [])

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
    chartDataState,
    getChartActionCounter,
    setChartActionCounter,
    chartActionCounterState,
    getChartCompareCounter,
    setChartCompareCounter,
    chartCompareCounterState,
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
