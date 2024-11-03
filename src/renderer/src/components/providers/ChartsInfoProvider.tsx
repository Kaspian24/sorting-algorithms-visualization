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
  DRAG_ITEM_TYPE,
  DraggablesTransitionState,
  DragItemType,
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
  setDefaultChartData: (numbers: number[]) => void
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
  swapAlgorithmsPosition: (
    a: keyof typeof SORTING_ALGORITHM,
    b: keyof typeof SORTING_ALGORITHM,
  ) => void
  draggablesTransitionStateRef: React.MutableRefObject<DraggablesTransitionState>
}

const ChartsInfoContext = createContext<ChartsInfoContextType | undefined>(
  undefined,
)

interface ChartsInfoProviderProps {
  children: ReactNode
}

function numbersToChartDataFieldArray(numbers: number[]): ChartDataField[] {
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

function generateInitialDefaultChartData(): ChartDataField[] {
  const numbers = [
    40, 37, 35, 34, 33, 31, 5, 6, 7, 10, 11, 12, 13, 14, 15, 20, 25, 30,
  ]

  return numbersToChartDataFieldArray(numbers)
}

const initialDefaultChartData = generateInitialDefaultChartData()

function generateInitialAlgorithmsVisibility(): AlgorithmVisibilityData[] {
  return Object.keys(SORTING_ALGORITHM).map((algorithm) => ({
    algorithm: algorithm as keyof typeof SORTING_ALGORITHM,
    visible: false,
  }))
}

const initialAlgorithmsVisibility = generateInitialAlgorithmsVisibility()

function generateInitialDraggablesTransitionStateRef(): DraggablesTransitionState {
  return Object.values(DRAG_ITEM_TYPE).reduce((acc, key) => {
    acc[key as DragItemType] = false
    return acc
  }, {} as DraggablesTransitionState)
}

const initialDraggablesTransitionState =
  generateInitialDraggablesTransitionStateRef()

export function ChartsInfoProvider({ children }: ChartsInfoProviderProps) {
  const chartInfoData = useRef<React.MutableRefObject<ChartInfoData>[]>([])
  const durationRef = useRef<number>(250)
  const globalCompareActionCounterRef = useRef<number>(0)
  const globalMaxCompareActionCounterRef = useRef<number>(0)
  const directionForwardRef = useRef<boolean>(true)
  const [algorithmsVisibilityData, setAlgorithmsVisibilityData] = useState<
    AlgorithmVisibilityData[]
  >(initialAlgorithmsVisibility)
  const draggablesTransitionStateRef = useRef<DraggablesTransitionState>(
    initialDraggablesTransitionState,
  )

  const [, setglobalMaxCompareActionCounter] = useState<number>(0)
  const [defaultChartData, setDefaultChartDataState] = useState<
    ChartDataField[]
  >(initialDefaultChartData)

  const setDefaultChartData = useCallback((numbers: number[]) => {
    setDefaultChartDataState(numbersToChartDataFieldArray(numbers))
  }, [])

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

  const swapAlgorithmsPosition = useCallback(
    (a: keyof typeof SORTING_ALGORITHM, b: keyof typeof SORTING_ALGORITHM) =>
      setAlgorithmsVisibilityData((prev) => {
        const aIndex = prev.findIndex((data) => data.algorithm === a)
        const bIndex = prev.findIndex((data) => data.algorithm === b)
        return prev.map((data, index) =>
          index == aIndex
            ? { ...prev[bIndex] }
            : index === bIndex
              ? { ...prev[aIndex] }
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
    swapAlgorithmsPosition,
    draggablesTransitionStateRef,
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
