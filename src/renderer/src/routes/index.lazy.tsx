import ChartCard from '@renderer/components/ChartCard/ChartCard'
import { ChartDataField, SORTING_ALGORITHM } from '@renderer/types/types'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

const numbers = [
  275, 200, 187, 173, 90, 90, 1, 2, 3, 10, 11, 12, 13, 14, 15, 20, 25, 30,
]

const defaultChartData: ChartDataField[] = numbers.map((number) => ({
  number: number,
  fill: 'var(--color-default)',
  className: '',
  style: {
    transform: 'translateX(0)',
  },
}))

function Index() {
  return (
    <div className="grid grid-cols-chartsBoard gap-4 p-10">
      <ChartCard
        title="selection sort"
        defaultChartData={defaultChartData}
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        defaultChartData={defaultChartData}
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        defaultChartData={defaultChartData}
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
    </div>
  )
}
