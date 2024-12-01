import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  initialAlgorithmsVisibility,
  initialDraggablesTransitionState,
} from '@renderer/components/providers/AlgorithmsVisibilityProvider/utils'
import {
  AlgorithmVisibilityData as AlgorithmsVisibilityData,
  DraggablesTransitionState,
  SORTING_ALGORITHM,
} from '@renderer/types/types'

interface AlgorithmsVisibilityContextType {
  algorithmsVisibilityData: AlgorithmsVisibilityData[]
  setAlgorithmsVisibility: (
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

const AlgorithmsVisibilityContext = createContext<
  AlgorithmsVisibilityContextType | undefined
>(undefined)

interface AlgorithmsVisibilityProviderProps {
  children: ReactNode
}

export function AlgorithmsVisibilityProvider({
  children,
}: AlgorithmsVisibilityProviderProps) {
  const [algorithmsVisibilityData, setAlgorithmsVisibilityData] = useState<
    AlgorithmsVisibilityData[]
  >(initialAlgorithmsVisibility)
  const draggablesTransitionStateRef = useRef<DraggablesTransitionState>(
    initialDraggablesTransitionState,
  )

  const setAlgorithmsVisibility = useCallback(
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

  const value: AlgorithmsVisibilityContextType = {
    algorithmsVisibilityData,
    setAlgorithmsVisibility: setAlgorithmsVisibility,
    setAlgorithmPosition,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
    swapAlgorithmsPosition,
    draggablesTransitionStateRef,
  }

  return (
    <AlgorithmsVisibilityContext.Provider value={value}>
      {children}
    </AlgorithmsVisibilityContext.Provider>
  )
}

export function useAlgorithmsVisibility() {
  const context = useContext(AlgorithmsVisibilityContext)

  if (!context) {
    throw new Error(
      'useAlgorithmsVisibility must be used within AlgorithmsVisibilityProvider',
    )
  }
  return context
}
