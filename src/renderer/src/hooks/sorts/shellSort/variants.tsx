import {
  gapHibbard,
  gapSedgewick,
  gapShell,
} from '@renderer/hooks/sorts/shellSort/gapFunctions'
import {
  shellSortHibbardCode,
  shellSortSedgewickCode,
  shellSortShellCode,
} from '@renderer/hooks/sorts/shellSort/shellSortCode'
import {
  HibbardGapInfo,
  SedgewickGapInfo,
  ShellGapInfo,
} from '@renderer/hooks/sorts/shellSort/ShellSortGapsInfo'
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
    code: shellSortShellCode,
    AdditionalInfo: <ShellGapInfo />,
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
    code: shellSortHibbardCode,
    AdditionalInfo: <HibbardGapInfo />,
    variables: {
      gapFunction: gapHibbard,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n^(4/3))',
      worst: 'O(n^(4/3))',
      memory: 'O(1)',
      stable: false,
    },
    code: shellSortSedgewickCode,
    AdditionalInfo: <SedgewickGapInfo />,
    variables: {
      gapFunction: gapSedgewick,
    },
  },
]
