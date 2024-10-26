import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  AlgorithmVisibilityData,
  ChartDataField,
  ChartInfoData,
  SORTING_ALGORITHM,
} from '@renderer/types/types'

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
  algorithmsVisibilityData: AlgorithmVisibilityData[]
  setAlgorithmVisibility: (
    algorithm: keyof typeof SORTING_ALGORITHM,
    state: boolean,
  ) => void
  setAlgorithmPosition: (
    algorithm: keyof typeof SORTING_ALGORITHM,
    position: number,
  ) => void
  moveAlgorithmPositionLeft: (algorithm: keyof typeof SORTING_ALGORITHM) => void
  moveAlgorithmPositionRight: (
    algorithm: keyof typeof SORTING_ALGORITHM,
  ) => void
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

function generateStarterAlgorithmsVisibility(): AlgorithmVisibilityData[] {
  return Object.keys(SORTING_ALGORITHM).map((algorithm) => ({
    algorithm: algorithm as keyof typeof SORTING_ALGORITHM,
    visible: false,
  }))
}

export function ChartsInfoProvider({ children }: ChartsInfoProviderProps) {
  const chartInfoData = useRef<React.MutableRefObject<ChartInfoData>[]>([])
  const durationRef = useRef<number>(250)
  const globalCompareActionCounterRef = useRef<number>(0)
  const globalMaxCompareActionCounterRef = useRef<number>(0)
  const directionForwardRef = useRef<boolean>(true)
  const [algorithmsVisibilityData, setAlgorithmsVisibilityData] = useState<
    AlgorithmVisibilityData[]
  >(generateStarterAlgorithmsVisibility())

  const [, setglobalMaxCompareActionCounter] = useState<number>(0)
  const [defaultChartData, setDefaultChartData] = useState<ChartDataField[]>(
    generateStarterDefaultChartData(),
  )

  const addChartInfoData = useCallback(
    (addedData: React.MutableRefObject<ChartInfoData>) => {
      chartInfoData.current.push(addedData)
      globalMaxCompareActionCounterRef.current = Math.max(
        globalMaxCompareActionCounterRef.current,
        addedData.current.maxCompareActionCounterRef.current,
      )
      setglobalMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    [],
  )

  const removeChartInfoData = useCallback(
    (removedData: React.MutableRefObject<ChartInfoData>) => {
      chartInfoData.current = chartInfoData.current.filter(
        (data) => data !== removedData,
      )
      globalMaxCompareActionCounterRef.current = chartInfoData.current.reduce(
        (acc, data) =>
          Math.max(acc, data.current.maxCompareActionCounterRef.current),
        0,
      )
      setglobalMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    [],
  )

  const setAlgorithmVisibility = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM, state: boolean) =>
      setAlgorithmsVisibilityData((prev) => {
        const position = prev.findIndex((data) => data.algorithm === algorithm)
        if (position < 0) {
          return prev
        }
        return prev.map((data, index) =>
          index === position ? { ...data, visible: state } : data,
        )
      }),
    [],
  )

  const setAlgorithmPosition = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM, newPosition: number) =>
      setAlgorithmsVisibilityData((prev) => {
        const position = prev.findIndex((data) => data.algorithm === algorithm)
        if (position < 0 || position === newPosition) {
          return prev
        }
        return prev.map((data, index) =>
          index === position
            ? { ...prev[newPosition] }
            : index === newPosition
              ? { ...prev[position] }
              : data,
        )
      }),
    [],
  )

  const moveAlgorithmPositionLeft = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM) =>
      setAlgorithmsVisibilityData((prev) => {
        const position = prev.findIndex((data) => data.algorithm === algorithm)
        let newPosition = -1
        for (let i = position - 1; i >= 0; i--) {
          if (prev[i].visible === true) {
            newPosition = i
            break
          }
        }
        if (newPosition < 0) {
          return prev
        }
        return prev.map((data, index) =>
          index === position
            ? { ...prev[newPosition] }
            : index === newPosition
              ? { ...prev[position] }
              : data,
        )
      }),
    [],
  )

  const moveAlgorithmPositionRight = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM) =>
      setAlgorithmsVisibilityData((prev) => {
        const position = prev.findIndex((data) => data.algorithm === algorithm)
        let newPosition = -1
        for (let i = position + 1; i < prev.length; i++) {
          if (prev[i].visible === true) {
            newPosition = i
            break
          }
        }
        if (newPosition < 0) {
          return prev
        }
        return prev.map((data, index) =>
          index === position
            ? { ...prev[newPosition] }
            : index === newPosition
              ? { ...prev[position] }
              : data,
        )
      }),
    [],
  )

  const value: ChartsInfoContextType = {
    chartInfoData,
    addChartInfoData,
    removeChartInfoData,
    durationRef,
    globalCompareActionCounterRef,
    globalMaxCompareActionCounterRef,
    defaultChartData,
    setDefaultChartData,
    directionForwardRef,
    algorithmsVisibilityData,
    setAlgorithmVisibility,
    setAlgorithmPosition,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
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
