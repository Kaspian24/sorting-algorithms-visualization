import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { ChartDataField, CompareAction } from '@renderer/types/types'

export interface ControlData {
  sortFunction: () => void
  reset: () => void
  maxCompareActionCounterRef: React.MutableRefObject<number>
  maxHighlightCounterRef: React.MutableRefObject<number>
  chartDataRef: React.MutableRefObject<ChartDataField[]>
  compareActionCounterRef: React.MutableRefObject<number>
  highlightCounterRef: React.MutableRefObject<number>
  compareActionRef: React.MutableRefObject<CompareAction>
}

interface ChartControlContextType {
  controlData: React.MutableRefObject<React.MutableRefObject<ControlData>[]>
  addControlData: (addedData: React.MutableRefObject<ControlData>) => void
  removeControlData: (removedData: React.MutableRefObject<ControlData>) => void
  durationRef: React.MutableRefObject<number>
  globalCompareActionCounterRef: React.MutableRefObject<number>
  globalMaxCompareActionCounterRef: React.MutableRefObject<number>
  defaultChartData: ChartDataField[]
  setDefaultChartData: React.Dispatch<React.SetStateAction<ChartDataField[]>>
  directionForwardRef: React.MutableRefObject<boolean>
}

const ChartControlContext = createContext<ChartControlContextType | undefined>(
  undefined,
)

interface ChartControlProviderProps {
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

export function ChartControlProvider({ children }: ChartControlProviderProps) {
  const controlData = useRef<React.MutableRefObject<ControlData>[]>([])
  const durationRef = useRef<number>(250)
  const globalCompareActionCounterRef = useRef<number>(0)
  const globalMaxCompareActionCounterRef = useRef<number>(0)
  const directionForwardRef = useRef<boolean>(true)

  const [, setMaxCompareActionCounter] = useState<number>(0)
  const [defaultChartData, setDefaultChartData] = useState<ChartDataField[]>(
    generateStarterDefaultChartData(),
  )

  const value: ChartControlContextType = {
    controlData,
    addControlData: (addedData) => {
      controlData.current.push(addedData)
      globalMaxCompareActionCounterRef.current = Math.max(
        globalMaxCompareActionCounterRef.current,
        addedData.current.maxCompareActionCounterRef.current,
      )
      setMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    removeControlData: (removedData) => {
      controlData.current = controlData.current.filter(
        (data) => data !== removedData,
      )
      globalMaxCompareActionCounterRef.current = controlData.current.reduce(
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
    <ChartControlContext.Provider value={value}>
      {children}
    </ChartControlContext.Provider>
  )
}

export function useChartControl() {
  const context = useContext(ChartControlContext)

  if (!context) {
    throw new Error('useChartControl must be used within ChartControlProvider')
  }
  return context
}
