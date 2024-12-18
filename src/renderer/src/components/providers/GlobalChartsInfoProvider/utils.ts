import { CHART_ACTION, ChartData } from '@renderer/types/types'

export function numbersToChartData(numbers: number[]): ChartData {
  return {
    fields: numbers.map((number, index) => ({
      key: index,
      number: number,
    })),
    visualization: { action: CHART_ACTION.DEFAULT, numbers: [] },
  }
}

function generateInitialDefaultChartData(): ChartData {
  const numbers = [
    14, 28, 2, 22, 5, 17, 23, 8, 4, 12, 29, 7, 20, 10, 15, 26, 1, 9, 3, 18, 25,
    11, 16, 30, 6, 19, 21, 24, 13, 27,
  ]

  return numbersToChartData(numbers)
}

export const initialDefaultChartData = generateInitialDefaultChartData()
