import { ChartCard } from '@renderer/components/ChartCard/ChartCard'
import { useChartsInfo } from '@renderer/components/providers/ChartsInfoProvider'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import { SORTING_ALGORITHM } from '@renderer/types/types'
import constantToTitleCase from '@renderer/utils/constantToTitleCase'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { algorithmsVisibility, setAlgorithmVisibility } = useChartsInfo()
  return (
    <ContextMenu>
      <ContextMenuTrigger className="contents">
        <div className="grid h-full grid-cols-chartsBoard gap-4 p-10">
          {Object.entries(algorithmsVisibility)
            .filter(([, { visibility }]) => visibility === true)
            .sort(([, a], [, b]) => a.position - b.position)
            .map(([algorithm], index) => (
              <ChartCard
                key={`chart${index}`}
                algorithm={algorithm as keyof typeof SORTING_ALGORITHM}
                sortingAlgorithm={
                  SORTING_ALGORITHM[algorithm as keyof typeof SORTING_ALGORITHM]
                }
              />
            ))}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {Object.entries(algorithmsVisibility)
          .sort(([, a], [, b]) => a.position - b.position)
          .map(([algorithm, { visibility }], index) => (
            <ContextMenuCheckboxItem
              key={`chartContextItem${index}`}
              checked={visibility}
              onClick={() =>
                setAlgorithmVisibility(
                  algorithm as keyof typeof SORTING_ALGORITHM,
                  !visibility,
                )
              }
            >
              {constantToTitleCase(algorithm)}
            </ContextMenuCheckboxItem>
          ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
