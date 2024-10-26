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
  const { algorithmsVisibilityData, setAlgorithmVisibility } = useChartsInfo()
  return (
    <ContextMenu>
      <ContextMenuTrigger className="contents">
        <div className="grid h-full grid-cols-chartsBoard gap-4 p-10">
          {algorithmsVisibilityData
            .filter(({ visible }) => visible === true)
            .map(({ algorithm }, index) => (
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
        {algorithmsVisibilityData.map(({ algorithm, visible }, index) => (
          <ContextMenuCheckboxItem
            key={`chartContextItem${index}`}
            checked={visible}
            onClick={(e) => {
              e.preventDefault()
              setAlgorithmVisibility(
                algorithm as keyof typeof SORTING_ALGORITHM,
                !visible,
              )
            }}
          >
            {constantToTitleCase(algorithm)}
          </ContextMenuCheckboxItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
