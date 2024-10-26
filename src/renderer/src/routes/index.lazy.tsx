import AlgorithmContextMenuCheckboxItem from '@renderer/components/AlgorithmContextMenuCheckboxItem/AlgorithmContextMenuCheckboxItem'
import { ChartCard } from '@renderer/components/ChartCard/ChartCard'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import { SORTING_ALGORITHM } from '@renderer/types/types'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { algorithmsVisibilityData } = useChartsInfo()

  return (
    <ContextMenu>
      <ContextMenuTrigger className="contents">
        <div className="grid h-full grid-cols-chartsBoard gap-4 p-10">
          {algorithmsVisibilityData
            .filter(({ visible }) => visible === true)
            .map(({ algorithm }) => (
              <ChartCard
                key={`chart${algorithm}`}
                algorithm={algorithm as keyof typeof SORTING_ALGORITHM}
                sortingAlgorithm={
                  SORTING_ALGORITHM[algorithm as keyof typeof SORTING_ALGORITHM]
                }
              />
            ))}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {algorithmsVisibilityData.map(({ algorithm, visible }) => (
          <AlgorithmContextMenuCheckboxItem
            key={`chartContextItem${algorithm}`}
            algorithm={algorithm}
            visible={visible}
          />
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
