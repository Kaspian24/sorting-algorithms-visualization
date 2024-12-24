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
      best: 'nlogn',
      average: 'n^4/3',
      worst: 'n^2',
      memory: '1',
      stable: false,
    },
    variables: {
      gapFunction: gapShell,
    },
  },
  {
    info: {
      best: 'nlogn',
      average: 'n^4/3',
      worst: 'n^3/2',
      memory: '1',
      stable: false,
    },
    variables: {
      gapFunction: gapHibbard,
    },
  },
]
