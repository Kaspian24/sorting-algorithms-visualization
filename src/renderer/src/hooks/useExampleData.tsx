import { useCallback } from 'react'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'

const smallUnsorted = [4, 8, 10, 7, 2, 3, 1, 9, 5, 6]
const smallPartiallySorted = [1, 2, 3, 5, 4, 6, 7, 9, 8, 10]
const smallSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const smallReversed = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const smallDuplicates = [8, 10, 3, 8, 4, 4, 3, 10, 3, 8]

const largeUnsorted = [
  14, 28, 2, 22, 5, 17, 23, 8, 4, 12, 29, 7, 20, 10, 15, 26, 1, 9, 3, 18, 25,
  11, 16, 30, 6, 19, 21, 24, 13, 27,
]
const largePartiallySorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 10, 12, 14, 15, 16, 17, 18, 19, 21, 23, 20,
  22, 24, 25, 26, 27, 29, 30,
]
const largeSorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
]
const largeReversed = [
  30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12,
  11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
]
const largeDuplicates = [
  24, 8, 25, 24, 20, 15, 25, 30, 25, 25, 11, 24, 20, 24, 8, 30, 15, 11, 4, 8, 4,
  4, 11, 15, 4, 20,
]

export default function useExampleData() {
  const { setDefaultChartData } = useChartsInfo()

  const setSmallUnsorted = useCallback(
    () => setDefaultChartData(smallUnsorted),
    [setDefaultChartData],
  )

  const setSmallPartiallySorted = useCallback(
    () => setDefaultChartData(smallPartiallySorted),
    [setDefaultChartData],
  )

  const setSmallSorted = useCallback(
    () => setDefaultChartData(smallSorted),
    [setDefaultChartData],
  )

  const setSmallReversed = useCallback(
    () => setDefaultChartData(smallReversed),
    [setDefaultChartData],
  )

  const setSmallDuplicates = useCallback(
    () => setDefaultChartData(smallDuplicates),
    [setDefaultChartData],
  )

  const setLargeUnsorted = useCallback(
    () => setDefaultChartData(largeUnsorted),
    [setDefaultChartData],
  )

  const setLargePartiallySorted = useCallback(
    () => setDefaultChartData(largePartiallySorted),
    [setDefaultChartData],
  )

  const setLargeSorted = useCallback(
    () => setDefaultChartData(largeSorted),
    [setDefaultChartData],
  )

  const setLargeReversed = useCallback(
    () => setDefaultChartData(largeReversed),
    [setDefaultChartData],
  )

  const setLargeDuplicates = useCallback(
    () => setDefaultChartData(largeDuplicates),
    [setDefaultChartData],
  )

  return {
    setSmallUnsorted,
    setSmallPartiallySorted,
    setSmallSorted,
    setSmallReversed,
    setSmallDuplicates,

    setLargeUnsorted,
    setLargePartiallySorted,
    setLargeSorted,
    setLargeReversed,
    setLargeDuplicates,
  }
}
