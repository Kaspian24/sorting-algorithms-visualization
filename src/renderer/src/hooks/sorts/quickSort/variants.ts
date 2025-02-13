import {
  PARTITION_TYPE,
  PartitionType,
} from '@renderer/hooks/sorts/quickSort/partitionFunctions'
import {
  pivotEnd,
  PivotFunction,
  pivotMedianOfThree,
  pivotMiddle,
  pivotStart,
} from '@renderer/hooks/sorts/quickSort/pivotFunctions'
import {
  quickSortHoareMiddleCode,
  quickSortHoareStartCode,
  quickSortLomutoEndCode,
  quickSortLomutoMedianCode,
} from '@renderer/hooks/sorts/quickSort/quickSortCode'
import { SortingAlgorithmVariant } from '@renderer/types/types'

export interface QuickSortVariant extends SortingAlgorithmVariant {
  variables: {
    partitionType: PartitionType
    pivotFunction: PivotFunction
  }
}

export const variants: QuickSortVariant[] = [
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^(2))',
      memory: 'O(log n)',
      stable: false,
    },
    code: quickSortLomutoEndCode,
    variables: {
      partitionType: PARTITION_TYPE.LOMUTO,
      pivotFunction: pivotEnd,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^(2))',
      memory: 'O(log n)',
      stable: false,
    },
    code: quickSortLomutoMedianCode,
    variables: {
      partitionType: PARTITION_TYPE.LOMUTO,
      pivotFunction: pivotMedianOfThree,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^(2))',
      memory: 'O(log n)',
      stable: false,
    },
    code: quickSortHoareStartCode,
    variables: {
      partitionType: PARTITION_TYPE.HOARE,
      pivotFunction: pivotStart,
    },
  },
  {
    info: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^(2))',
      memory: 'O(log n)',
      stable: false,
    },
    code: quickSortHoareMiddleCode,
    variables: {
      partitionType: PARTITION_TYPE.HOARE,
      pivotFunction: pivotMiddle,
    },
  },
]
