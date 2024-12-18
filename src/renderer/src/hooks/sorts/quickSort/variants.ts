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
      best: 'nlogn',
      average: 'nlogn',
      worst: 'n^2',
      memory: 'logn',
      stable: false,
    },
    variables: {
      partitionType: PARTITION_TYPE.LOMUTO,
      pivotFunction: pivotEnd,
    },
  },
  {
    info: {
      best: 'nlogn',
      average: 'nlogn',
      worst: 'n^2',
      memory: 'logn',
      stable: false,
    },
    variables: {
      partitionType: PARTITION_TYPE.LOMUTO,
      pivotFunction: pivotMedianOfThree,
    },
  },
  {
    info: {
      best: 'n',
      average: 'nlogn',
      worst: 'n^2',
      memory: 'logn',
      stable: false,
    },
    variables: {
      partitionType: PARTITION_TYPE.HOARE,
      pivotFunction: pivotStart,
    },
  },
  {
    info: {
      best: 'n',
      average: 'nlogn',
      worst: 'n^2',
      memory: 'logn',
      stable: false,
    },
    variables: {
      partitionType: PARTITION_TYPE.HOARE,
      pivotFunction: pivotMiddle,
    },
  },
]
