import { useCallback } from 'react'
import { useGlobalChartsInfo } from '@renderer/components/providers/GlobalChartsInfoProvider'

const smallUnsorted = [4, 8, 10, 7, 2, 3, 1, 9, 5, 6]
const smallPartiallySorted = [1, 2, 3, 5, 4, 6, 7, 9, 8, 10]
const smallSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const smallReversed = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const smallDuplicates = [8, 10, 3, 8, 4, 4, 3, 10, 3, 8]

const mediumUnsorted = [
  14, 28, 2, 22, 5, 17, 23, 8, 4, 12, 29, 7, 20, 10, 15, 26, 1, 9, 3, 18, 25,
  11, 16, 30, 6, 19, 21, 24, 13, 27,
]
const mediumPartiallySorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 10, 12, 14, 15, 16, 17, 18, 19, 21, 23, 20,
  22, 24, 25, 26, 27, 28, 29, 30,
]
const mediumSorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
]
const mediumReversed = [
  30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12,
  11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
]
const mediumDuplicates = [
  24, 8, 25, 24, 20, 15, 25, 30, 25, 25, 11, 24, 20, 24, 8, 30, 15, 11, 4, 8, 4,
  4, 11, 15, 4, 20, 11, 4, 4, 25,
]

const largeUnsorted = [
  45, 76, 34, 89, 23, 12, 56, 91, 18, 64, 7, 37, 99, 29, 3, 81, 27, 88, 42, 73,
  94, 14, 22, 15, 69, 53, 11, 49, 38, 2, 67, 61, 86, 77, 19, 57, 85, 25, 31, 4,
  66, 16, 82, 50, 41, 33, 9, 30, 98, 6, 55, 21, 75, 58, 92, 13, 8, 72, 84, 5,
  43, 35, 40, 63, 47, 95, 1, 96, 44, 59, 48, 10, 26, 24, 80, 46, 100, 74, 83,
  17, 28, 87, 20, 32, 36, 71, 70, 93, 54, 60, 79, 52, 39, 78, 68, 62, 97, 90,
  51, 65,
]

const largePartiallySorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21, 23,
  25, 24, 22, 27, 26, 28, 29, 30, 31, 33, 32, 34, 35, 36, 37, 39, 38, 40, 41,
  43, 42, 44, 45, 47, 46, 49, 48, 50, 51, 53, 52, 54, 55, 56, 57, 59, 58, 60,
  61, 63, 62, 64, 65, 66, 67, 69, 68, 70, 71, 72, 73, 74, 75, 77, 76, 78, 79,
  80, 81, 83, 82, 84, 85, 87, 86, 88, 89, 90, 91, 93, 92, 94, 95, 96, 97, 98,
  99, 100,
]

const largeSorted = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  99, 100,
]

const largeReversed = [
  100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82,
  81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63,
  62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44,
  43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25,
  24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4,
  3, 2, 1,
]

const largeDuplicates = [
  10, 20, 30, 40, 10, 20, 30, 50, 60, 70, 20, 10, 30, 50, 60, 30, 70, 10, 20,
  30, 10, 20, 50, 40, 10, 60, 50, 30, 40, 20, 50, 60, 30, 40, 10, 70, 50, 60,
  30, 40, 10, 50, 20, 70, 30, 50, 60, 40, 20, 70, 10, 30, 50, 20, 60, 40, 70,
  10, 30, 50, 60, 30, 40, 10, 70, 20, 50, 30, 40, 60, 10, 20, 70, 30, 50, 60,
  30, 40, 20, 10, 70, 30, 50, 20, 60, 40, 70, 10, 30, 20, 60, 50, 40, 40, 10,
  20, 30, 60, 60, 50,
]

export default function useExampleData() {
  const { setDefaultChartData } = useGlobalChartsInfo()

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

  const setMediumUnsorted = useCallback(
    () => setDefaultChartData(mediumUnsorted),
    [setDefaultChartData],
  )

  const setMediumPartiallySorted = useCallback(
    () => setDefaultChartData(mediumPartiallySorted),
    [setDefaultChartData],
  )

  const setMediumSorted = useCallback(
    () => setDefaultChartData(mediumSorted),
    [setDefaultChartData],
  )

  const setMediumReversed = useCallback(
    () => setDefaultChartData(mediumReversed),
    [setDefaultChartData],
  )

  const setMediumDuplicates = useCallback(
    () => setDefaultChartData(mediumDuplicates),
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

    setMediumUnsorted,
    setMediumPartiallySorted,
    setMediumSorted,
    setMediumReversed,
    setMediumDuplicates,

    setLargeUnsorted,
    setLargePartiallySorted,
    setLargeSorted,
    setLargeReversed,
    setLargeDuplicates,
  }
}
