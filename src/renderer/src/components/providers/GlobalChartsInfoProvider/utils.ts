import { exampleData } from '@renderer/components/buttons/ExampleDataButton'
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
  const numbers = exampleData[30].unsorted

  return numbersToChartData(numbers)
}

export const initialDefaultChartData = generateInitialDefaultChartData()
