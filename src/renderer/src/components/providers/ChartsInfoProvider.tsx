import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { ChartDataField, ChartInfoData } from '@renderer/types/types'

interface ChartsInfoContextType {
  chartInfoData: React.MutableRefObject<React.MutableRefObject<ChartInfoData>[]>
  addChartInfoData: (addedData: React.MutableRefObject<ChartInfoData>) => void
  removeChartInfoData: (
    removedData: React.MutableRefObject<ChartInfoData>,
  ) => void
  durationRef: React.MutableRefObject<number>
  globalCompareActionCounterRef: React.MutableRefObject<number>
  globalMaxCompareActionCounterRef: React.MutableRefObject<number>
  defaultChartData: ChartDataField[]
  setDefaultChartData: React.Dispatch<React.SetStateAction<ChartDataField[]>>
  directionForwardRef: React.MutableRefObject<boolean>
}

const ChartsInfoContext = createContext<ChartsInfoContextType | undefined>(
  undefined,
)

interface ChartsInfoProviderProps {
  children: ReactNode
}

function generateStarterDefaultChartData(): ChartDataField[] {
  const numbers = [
    275, 200, 187, 173, 90, 90, 1, 2, 3, 10, 11, 12, 13, 14, 15, 20, 25, 30,
  ]

  return numbers.map((number) => ({
    number: number,
    fill: 'var(--color-default)',
    className: '',
    style: {
      transform: 'translateX(0)',
      transitionDuration: '250ms',
      transitionProperty: 'transform',
    },
  }))
}

export function ChartsInfoProvider({ children }: ChartsInfoProviderProps) {
  const chartInfoData = useRef<React.MutableRefObject<ChartInfoData>[]>([])
  const durationRef = useRef<number>(250)
  const globalCompareActionCounterRef = useRef<number>(0)
  const globalMaxCompareActionCounterRef = useRef<number>(0)
  const directionForwardRef = useRef<boolean>(true)

  const [, setMaxCompareActionCounter] = useState<number>(0)
  const [defaultChartData, setDefaultChartData] = useState<ChartDataField[]>(
    generateStarterDefaultChartData(),
  )

  const value: ChartsInfoContextType = {
    chartInfoData,
    addChartInfoData: (addedData) => {
      chartInfoData.current.push(addedData)
      globalMaxCompareActionCounterRef.current = Math.max(
        globalMaxCompareActionCounterRef.current,
        addedData.current.maxCompareActionCounterRef.current,
      )
      setMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    removeChartInfoData: (removedData) => {
      chartInfoData.current = chartInfoData.current.filter(
        (data) => data !== removedData,
      )
      globalMaxCompareActionCounterRef.current = chartInfoData.current.reduce(
        (acc, data) =>
          Math.max(acc, data.current.maxCompareActionCounterRef.current),
        0,
      )
      setMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    durationRef,
    globalCompareActionCounterRef,
    globalMaxCompareActionCounterRef,
    defaultChartData,
    setDefaultChartData,
    directionForwardRef,
  }

  return (
    <ChartsInfoContext.Provider value={value}>
      {children}
    </ChartsInfoContext.Provider>
  )
}

export function useChartsInfo() {
  const context = useContext(ChartsInfoContext)

  if (!context) {
    throw new Error('useChartsInfo must be used within ChartsInfoProvider')
  }
  return context
}
