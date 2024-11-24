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
  checkpointStepRef: React.MutableRefObject<number>
}

const ChartsInfoContext = createContext<ChartsInfoContextType | undefined>(
  undefined,
)

interface ChartsInfoProviderProps {
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
  const directionForwardRef = useRef<boolean>(true)
  const [algorithmsVisibilityData, setAlgorithmsVisibilityData] = useState<
    AlgorithmVisibilityData[]
  >(initialAlgorithmsVisibility)
  const draggablesTransitionStateRef = useRef<DraggablesTransitionState>(
    initialDraggablesTransitionState,
  )

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
          addedData.current.getMaxChartActionCounter(),
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
          (acc, data) => Math.max(acc, data.current.getMaxChartActionCounter()),
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
    algorithmsVisibilityData,
    setAlgorithmVisibility,
    setAlgorithmPosition,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
    swapAlgorithmsPosition,
    draggablesTransitionStateRef,
    checkpointStepRef,
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
