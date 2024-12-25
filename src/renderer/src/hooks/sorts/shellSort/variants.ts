import {
  gapHibbard,
  gapShell,
} from '@renderer/hooks/sorts/shellSort/gapFunctions'
import { SortingAlgorithmVariant } from '@renderer/types/types'

export interface ShellSortVariant extends SortingAlgorithmVariant {
  variables: {
    gapFunction: (num: number) => number
  }
}

export const variants: ShellSortVariant[] = [
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n^(4/3))',
      worst: 'O(n^(2))',
      memory: 'O(1)',
      stable: false,
    },
    variables: {
      gapFunction: gapShell,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n^(4/3))',
      worst: 'O(n^(3/2))',
      memory: 'O(1)',
      stable: false,
    },
    variables: {
      gapFunction: gapHibbard,
    },
  },
]
