import ChartCard from '@renderer/components/ChartCard/ChartCard'
import { SORTING_ALGORITHM } from '@renderer/types/types'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="grid grid-cols-chartsBoard gap-4 p-10">
      <ChartCard
        title="selection sort"
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
      <ChartCard
        title="selection sort"
        sortingAlgorithm={SORTING_ALGORITHM.SELECTION_SORT}
      />
    </div>
  )
}
