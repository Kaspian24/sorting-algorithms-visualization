import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { CompareAction } from '@renderer/types/types'

interface ControlData {
  sortFunction: () => void
  compareActionCounterRef: React.MutableRefObject<number>
  compareActionRef: React.MutableRefObject<CompareAction>
  reset: () => void
  maxCompareActionCounter: number
}

interface ChartControlContextType {
  controlData: React.MutableRefObject<ControlData[]>
  addControlData: (addedData: ControlData) => void
  removeControlData: (removedData: ControlData) => void
  durationRef: React.MutableRefObject<number>
  compareActionCounterRef: React.MutableRefObject<number>
  maxCompareActionCounterRef: React.MutableRefObject<number>
}

const ChartControlContext = createContext<ChartControlContextType | undefined>(
  undefined,
)

interface ChartControlProviderProps {
  children: ReactNode
}

export function ChartControlProvider({ children }: ChartControlProviderProps) {
  const controlData = useRef<ControlData[]>([])
  const durationRef = useRef<number>(250)
  const compareActionCounterRef = useRef<number>(0)
  const maxCompareActionCounterRef = useRef<number>(0)

  const [, setMaxCompareActionCounter] = useState<number>(0)

  const value: ChartControlContextType = {
    controlData,
    addControlData: (addedData) => {
      controlData.current.push(addedData)
      maxCompareActionCounterRef.current = Math.max(
        maxCompareActionCounterRef.current,
        addedData.maxCompareActionCounter,
      )
      setMaxCompareActionCounter(maxCompareActionCounterRef.current)
    },
    removeControlData: (removedData) => {
      controlData.current = controlData.current.filter(
        (data) => data !== removedData,
      )
      maxCompareActionCounterRef.current = controlData.current.reduce(
        (acc, data) => Math.max(acc, data.maxCompareActionCounter),
        0,
      )
      setMaxCompareActionCounter(maxCompareActionCounterRef.current)
    },
    durationRef,
    compareActionCounterRef,
    maxCompareActionCounterRef,
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
