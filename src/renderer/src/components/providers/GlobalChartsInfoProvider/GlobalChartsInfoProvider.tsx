import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  initialDefaultChartData,
  numbersToChartData,
} from '@renderer/components/providers/GlobalChartsInfoProvider/utils'
import { DURATION_MS } from '@renderer/constants/constants'
import { ChartData, ChartInfoData } from '@renderer/types/types'

interface GlobalChartsInfoContextType {
  defaultChartDataRef: React.MutableRefObject<ChartData>
  globalChartsInfoDataRef: React.MutableRefObject<
    React.MutableRefObject<ChartInfoData>[]
  >
  globalChartActionCounterRef: React.MutableRefObject<number>
  globalMaxChartActionCounterRef: React.MutableRefObject<number>
  globalChartCompareCounterRef: React.MutableRefObject<number>
  globalMaxChartCompareCounterRef: React.MutableRefObject<number>
  durationRef: React.MutableRefObject<number>
  directionForwardRef: React.MutableRefObject<boolean>
  compareAsStepRef: React.MutableRefObject<boolean>

  defaultChartDataState: ChartData
  setDefaultChartData: (numbers: number[]) => void

  globalMaxChartActionCounterState: number
  globalMaxChartCompareCounterState: number

  addChartInfoData: (addedData: React.MutableRefObject<ChartInfoData>) => void
  removeChartInfoData: (
    removedData: React.MutableRefObject<ChartInfoData>,
  ) => void
}

const GlobalChartsInfoContext = createContext<
  GlobalChartsInfoContextType | undefined
>(undefined)

interface GlobalChartsInfoProviderProps {
  children: ReactNode
}

export function GlobalChartsInfoProvider({
  children,
}: GlobalChartsInfoProviderProps) {
  const defaultChartDataRef = useRef<ChartData>(initialDefaultChartData)
  const globalChartsInfoDataRef = useRef<
    React.MutableRefObject<ChartInfoData>[]
  >([])
  const globalChartActionCounterRef = useRef<number>(0)
  const globalMaxChartActionCounterRef = useRef<number>(0)
  const globalChartCompareCounterRef = useRef<number>(0)
  const globalMaxChartCompareCounterRef = useRef<number>(0)
  const durationRef = useRef<number>(DURATION_MS)
  const directionForwardRef = useRef<boolean>(true)
  const compareAsStepRef = useRef<boolean>(false)

  const [defaultChartDataState, setDefaultChartDataState] = useState<ChartData>(
    initialDefaultChartData,
  )

  const [
    globalMaxChartActionCounterState,
    setGlobalMaxChartActionCounterState,
  ] = useState<number>(0)
  const [
    globalMaxChartCompareCounterState,
    setGlobalMaxChartCompareCounterState,
  ] = useState<number>(0)

  const setDefaultChartData = useCallback((numbers: number[]) => {
    defaultChartDataRef.current = numbersToChartData(numbers)
    setDefaultChartDataState(defaultChartDataRef.current)
  }, [])

  const addChartInfoData = useCallback(
    (addedData: React.MutableRefObject<ChartInfoData>) => {
      globalChartsInfoDataRef.current.push(addedData)
      const newGlobalMaxChartActionCounter = Math.max(
        globalMaxChartActionCounterRef.current,
        addedData.current.maxChartActionCounterRef.current,
      )
      globalMaxChartActionCounterRef.current = newGlobalMaxChartActionCounter
      setGlobalMaxChartActionCounterState(newGlobalMaxChartActionCounter)

      globalChartActionCounterRef.current = Math.min(
        globalMaxChartActionCounterRef.current,
        globalChartActionCounterRef.current,
      )

      const newGlobalMaxChartCompareCounter = Math.max(
        globalMaxChartCompareCounterRef.current,
        addedData.current.maxChartCompareCounterRef.current,
      )
      globalMaxChartCompareCounterRef.current = newGlobalMaxChartCompareCounter
      setGlobalMaxChartCompareCounterState(newGlobalMaxChartCompareCounter)

      globalChartCompareCounterRef.current = Math.min(
        globalMaxChartCompareCounterRef.current,
        globalChartCompareCounterRef.current,
      )
    },
    [],
  )

  const removeChartInfoData = useCallback(
    (removedData: React.MutableRefObject<ChartInfoData>) => {
      globalChartsInfoDataRef.current = globalChartsInfoDataRef.current.filter(
        (data) => data !== removedData,
      )
      const newGlobalMaxChartActionCounter =
        globalChartsInfoDataRef.current.reduce(
          (acc, data) =>
            Math.max(acc, data.current.maxChartActionCounterRef.current),
          0,
        )
      globalMaxChartActionCounterRef.current = newGlobalMaxChartActionCounter
      setGlobalMaxChartActionCounterState(newGlobalMaxChartActionCounter)

      globalChartActionCounterRef.current = Math.min(
        globalMaxChartActionCounterRef.current,
        globalChartActionCounterRef.current,
      )

      const newGlobalMaxChartCompareCounter =
        globalChartsInfoDataRef.current.reduce(
          (acc, data) =>
            Math.max(acc, data.current.maxChartCompareCounterRef.current),
          0,
        )
      globalMaxChartCompareCounterRef.current = newGlobalMaxChartCompareCounter
      setGlobalMaxChartCompareCounterState(newGlobalMaxChartCompareCounter)

      globalChartCompareCounterRef.current = Math.min(
        globalMaxChartCompareCounterRef.current,
        globalChartCompareCounterRef.current,
      )
    },
    [],
  )

  const value: GlobalChartsInfoContextType = {
    defaultChartDataRef,
    globalChartsInfoDataRef,
    globalChartActionCounterRef,
    globalMaxChartActionCounterRef,
    globalChartCompareCounterRef,
    globalMaxChartCompareCounterRef,
    durationRef,
    directionForwardRef,
    compareAsStepRef,

    defaultChartDataState,
    setDefaultChartData,

    globalMaxChartActionCounterState,
    globalMaxChartCompareCounterState,

    addChartInfoData,
    removeChartInfoData,
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
