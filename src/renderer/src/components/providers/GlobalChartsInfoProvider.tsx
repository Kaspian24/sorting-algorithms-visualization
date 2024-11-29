import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { ChartDataField, ChartInfoData } from '@renderer/types/types'

interface GlobalChartsInfoContextType {
  chartInfoData: React.MutableRefObject<React.MutableRefObject<ChartInfoData>[]>
  addChartInfoData: (addedData: React.MutableRefObject<ChartInfoData>) => void
  removeChartInfoData: (
    removedData: React.MutableRefObject<ChartInfoData>,
  ) => void
  durationRef: React.MutableRefObject<number>
  getGlobalChartActionCounter: () => number
  setGlobalChartActionCounter: (value: number) => void
  linkGlobalChartActionCounterSetState: (f: (value: number) => void) => void
  getGlobalMaxChartActionCounter: () => number
  setGlobalMaxChartActionCounter: (value: number) => void
  globalMaxChartActionCounterState: number
  getDefaultChartData: () => ChartDataField[]
  setDefaultChartData: (numbers: number[]) => void
  defaultChartDataState: ChartDataField[]
  directionForwardRef: React.MutableRefObject<boolean>
  checkpointStepRef: React.MutableRefObject<number>
}

const GlobalChartsInfoContext = createContext<
  GlobalChartsInfoContextType | undefined
>(undefined)

interface GlobalChartsInfoProviderProps {
  children: ReactNode
}

function numbersToChartDataFieldArray(numbers: number[]): ChartDataField[] {
  return numbers.map((number, index) => ({
    key: `bar${index}`,
    number: number,
    fill: 'hsl(var(--chart-1))',
    className: '',
    style: {
      transform: 'translateX(0)',
      transitionDuration: '250ms',
      transitionProperty: 'transform',
    },
  }))
}

function generateInitialDefaultChartData(): ChartDataField[] {
  const numbers = [
    14, 28, 2, 22, 5, 17, 23, 8, 4, 12, 29, 7, 20, 10, 15, 26, 1, 9, 3, 18, 25,
    11, 16, 30, 6, 19, 21, 24, 13, 27,
  ]

  return numbersToChartDataFieldArray(numbers)
}

const initialDefaultChartData = generateInitialDefaultChartData()

export function GlobalChartsInfoProvider({
  children,
}: GlobalChartsInfoProviderProps) {
  const chartInfoData = useRef<React.MutableRefObject<ChartInfoData>[]>([])
  const durationRef = useRef<number>(250)
  const directionForwardRef = useRef<boolean>(true)

  const defaultChartDataRef = useRef<ChartDataField[]>(initialDefaultChartData)
  const [defaultChartDataState, setDefaultChartDataState] = useState<
    ChartDataField[]
  >(initialDefaultChartData)
  const getDefaultChartData = useCallback(() => {
    return defaultChartDataRef.current
  }, [])
  const setDefaultChartData = useCallback((numbers: number[]) => {
    defaultChartDataRef.current = numbersToChartDataFieldArray(numbers)
    setDefaultChartDataState(defaultChartDataRef.current)
  }, [])

  const globalChartActionCounterRef = useRef<number>(0)
  const globalChartActionCounterSetState = useRef<(value: number) => void>(
    () => {},
  )
  const linkGlobalChartActionCounterSetState = useCallback(
    (f: (value: number) => void) => {
      globalChartActionCounterSetState.current = f
    },
    [],
  )
  const getGlobalChartActionCounter = useCallback(() => {
    return globalChartActionCounterRef.current
  }, [])
  const setGlobalChartActionCounter = useCallback((value: number) => {
    globalChartActionCounterRef.current = value
    globalChartActionCounterSetState.current(value)
  }, [])

  const globalMaxChartActionCounterRef = useRef<number>(0)
  const [
    globalMaxChartActionCounterState,
    setGlobalMaxChartActionCounterState,
  ] = useState<number>(0)
  const getGlobalMaxChartActionCounter = useCallback(() => {
    return globalMaxChartActionCounterRef.current
  }, [])
  const setGlobalMaxChartActionCounter = useCallback((value: number) => {
    globalMaxChartActionCounterRef.current = value
    setGlobalMaxChartActionCounterState(value)
  }, [])

  const checkpointStepRef = useRef<number>(250)

  const addChartInfoData = useCallback(
    (addedData: React.MutableRefObject<ChartInfoData>) => {
      chartInfoData.current.push(addedData)
      setGlobalMaxChartActionCounter(
        Math.max(
          globalMaxChartActionCounterRef.current,
          addedData.current.maxChartActionCounterRef.current,
        ),
      )
      setGlobalChartActionCounter(
        Math.min(
          getGlobalMaxChartActionCounter(),
          getGlobalChartActionCounter(),
        ),
      )
    },
    [
      getGlobalChartActionCounter,
      getGlobalMaxChartActionCounter,
      setGlobalChartActionCounter,
      setGlobalMaxChartActionCounter,
    ],
  )

  const removeChartInfoData = useCallback(
    (removedData: React.MutableRefObject<ChartInfoData>) => {
      chartInfoData.current = chartInfoData.current.filter(
        (data) => data !== removedData,
      )
      setGlobalMaxChartActionCounter(
        chartInfoData.current.reduce(
          (acc, data) =>
            Math.max(acc, data.current.maxChartActionCounterRef.current),
          0,
        ),
      )
      setGlobalChartActionCounter(
        Math.min(
          getGlobalMaxChartActionCounter(),
          getGlobalChartActionCounter(),
        ),
      )
    },
    [
      getGlobalChartActionCounter,
      getGlobalMaxChartActionCounter,
      setGlobalChartActionCounter,
      setGlobalMaxChartActionCounter,
    ],
  )

  const value: GlobalChartsInfoContextType = {
    chartInfoData,
    addChartInfoData,
    removeChartInfoData,
    durationRef,
    getGlobalChartActionCounter,
    setGlobalChartActionCounter,
    linkGlobalChartActionCounterSetState,
    getGlobalMaxChartActionCounter,
    setGlobalMaxChartActionCounter,
    globalMaxChartActionCounterState,
    getDefaultChartData,
    setDefaultChartData,
    defaultChartDataState,
    directionForwardRef,
    checkpointStepRef,
  }

  return (
    <GlobalChartsInfoContext.Provider value={value}>
      {children}
    </GlobalChartsInfoContext.Provider>
  )
}

export function useGlobalChartsInfo() {
  const context = useContext(GlobalChartsInfoContext)

  if (!context) {
    throw new Error(
      'useGlobalChartsInfo must be used within GlobalChartsInfoProvider',
    )
  }
  return context
}
