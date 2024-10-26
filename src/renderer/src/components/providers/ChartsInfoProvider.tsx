import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  AlgorithmsVisibility,
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
  algorithmsVisibility: AlgorithmsVisibility
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

function generateStarterAlgorithmsVisibility(): AlgorithmsVisibility {
  let i = 0
  return Object.fromEntries(
    Object.keys(SORTING_ALGORITHM).map((algorithm) => [
      algorithm as keyof typeof SORTING_ALGORITHM,
      { visibility: true, position: i++ },
    ]),
  ) as AlgorithmsVisibility
}

export function ChartsInfoProvider({ children }: ChartsInfoProviderProps) {
  const chartInfoData = useRef<React.MutableRefObject<ChartInfoData>[]>([])
  const durationRef = useRef<number>(250)
  const globalCompareActionCounterRef = useRef<number>(0)
  const globalMaxCompareActionCounterRef = useRef<number>(0)
  const directionForwardRef = useRef<boolean>(true)
  const [algorithmsVisibility, setAlgorithmsVisibilityState] =
    useState<AlgorithmsVisibility>(generateStarterAlgorithmsVisibility())

  const [, setMaxCompareActionCounter] = useState<number>(0)
  const [defaultChartData, setDefaultChartData] = useState<ChartDataField[]>(
    generateStarterDefaultChartData(),
  )

  const switchAlgorithmsPosition = useCallback(
    (a: keyof typeof SORTING_ALGORITHM, b?: keyof typeof SORTING_ALGORITHM) => {
      setAlgorithmsVisibilityState((prev) => {
        if (!b || prev[a].position === prev[b].position) {
          return prev
        }

        return {
          ...prev,
          [a]: {
            ...prev[a],
            position: prev[b].position,
          },
          [b]: {
            ...prev[b],
            position: prev[a].position,
          },
        }
      })
    },
    [],
  )

  const addChartInfoData = useCallback(
    (addedData: React.MutableRefObject<ChartInfoData>) => {
      chartInfoData.current.push(addedData)
      globalMaxCompareActionCounterRef.current = Math.max(
        globalMaxCompareActionCounterRef.current,
        addedData.current.maxCompareActionCounterRef.current,
      )
      setMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
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
      setMaxCompareActionCounter(globalMaxCompareActionCounterRef.current)
    },
    [],
  )

  const setAlgorithmVisibility = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM, state: boolean) => {
      setAlgorithmsVisibilityState((prev) => ({
        ...prev,
        [algorithm]: {
          ...prev[algorithm],
          visibility: state,
        },
      }))
    },
    [],
  )

  const setAlgorithmPosition = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM, newPosition: number) => {
      const targetAlgorithm = Object.keys(algorithmsVisibility).find(
        (key) =>
          algorithmsVisibility[key as keyof typeof SORTING_ALGORITHM]
            .position === newPosition,
      ) as keyof typeof SORTING_ALGORITHM

      switchAlgorithmsPosition(algorithm, targetAlgorithm)
    },
    [algorithmsVisibility, switchAlgorithmsPosition],
  )

  const moveAlgorithmPositionLeft = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM) => {
      const targetAlgorithm = Object.entries(algorithmsVisibility)
        .sort(([, a], [, b]) => b.position - a.position)
        .find(
          ([, data]) =>
            data.position < algorithmsVisibility[algorithm].position &&
            data.visibility,
        )?.[0] as keyof typeof SORTING_ALGORITHM
      switchAlgorithmsPosition(algorithm, targetAlgorithm)
    },
    [algorithmsVisibility, switchAlgorithmsPosition],
  )

  const moveAlgorithmPositionRight = useCallback(
    (algorithm: keyof typeof SORTING_ALGORITHM) => {
      const targetAlgorithm = Object.entries(algorithmsVisibility)
        .sort(([, a], [, b]) => a.position - b.position)
        .find(
          ([, data]) =>
            data.position > algorithmsVisibility[algorithm].position &&
            data.visibility,
        )?.[0] as keyof typeof SORTING_ALGORITHM
      switchAlgorithmsPosition(algorithm, targetAlgorithm)
    },
    [algorithmsVisibility, switchAlgorithmsPosition],
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
    algorithmsVisibility,
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
