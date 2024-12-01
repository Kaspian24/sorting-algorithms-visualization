import { ChartDataField } from '@renderer/types/types'

export function numbersToChartDataFieldArray(
  numbers: number[],
): ChartDataField[] {
  return numbers.map((number, index) => ({
    key: `bar${index}`,
    number: number,
    fill: 'hsl(var(--chart-default))',
    className: '',
    style: {
      transform: 'translateX(0)',
      transitionDuration: '250ms',
      transitionProperty: 'transform',
    },
  }))
}

function generateInitialDefaultChartData(): ChartDataField[] {
  const numbers = [
    14, 28, 2, 22, 5, 17, 23, 8, 4, 12, 29, 7, 20, 10, 15, 26, 1, 9, 3, 18, 25,
    11, 16, 30, 6, 19, 21, 24, 13, 27,
  ]

  return numbersToChartDataFieldArray(numbers)
}

export const initialDefaultChartData = generateInitialDefaultChartData()
