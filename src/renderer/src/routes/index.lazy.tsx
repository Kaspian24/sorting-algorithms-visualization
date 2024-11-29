import { Flipped, Flipper } from 'react-flip-toolkit'
import AlgorithmContextMenuCheckboxItem from '@renderer/components/AlgorithmContextMenuCheckboxItem/AlgorithmContextMenuCheckboxItem'
import { ChartCard } from '@renderer/components/ChartCard/ChartCard'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider'
import StartCard from '@renderer/components/StartCard/StartCard'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import { DRAG_ITEM_TYPE, SORTING_ALGORITHM } from '@renderer/types/types'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { algorithmsVisibilityData, draggablesTransitionStateRef } =
    useAlgorithmsVisibility()

  return (
    <ContextMenu>
      <ContextMenuTrigger className="contents">
        <div className="grid h-full grid-cols-chartsBoard gap-4 p-10">
          <Flipper
            className="contents"
            flipKey={`charts${JSON.stringify(algorithmsVisibilityData)}`}
            onStart={() =>
              (draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CHART_CARD] =
                true)
            }
            onComplete={() =>
              (draggablesTransitionStateRef.current[DRAG_ITEM_TYPE.CHART_CARD] =
                false)
            }
          >
            {algorithmsVisibilityData
              .filter(({ visible }) => visible === true)
              .map(({ algorithm }) => (
                <Flipped key={`chart${algorithm}`} flipId={`chart${algorithm}`}>
                  {(flippedProps) => (
                    <ChartCard
                      algorithm={algorithm as keyof typeof SORTING_ALGORITHM}
                      sortingAlgorithm={
                        SORTING_ALGORITHM[
                          algorithm as keyof typeof SORTING_ALGORITHM
                        ]
                      }
                      flippedProps={flippedProps}
                    />
                  )}
                </Flipped>
              ))}
            {algorithmsVisibilityData.every(
              ({ visible }) => visible === false,
            ) && <StartCard />}
          </Flipper>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <Flipper
          className="contents"
          flipKey={`chartsContexts${algorithmsVisibilityData.map(({ algorithm }) => algorithm).join('')}`}
        >
          {algorithmsVisibilityData.map(({ algorithm, visible }) => (
            <Flipped
              key={`chartContextItem${algorithm}`}
              flipId={`chartContextItem${algorithm}`}
              onStart={() =>
                (draggablesTransitionStateRef.current[
                  DRAG_ITEM_TYPE.CONTEXT_ITEM
                ] = true)
              }
              onComplete={() =>
                (draggablesTransitionStateRef.current[
                  DRAG_ITEM_TYPE.CONTEXT_ITEM
                ] = false)
              }
            >
              {(flippedProps) => (
                <AlgorithmContextMenuCheckboxItem
                  algorithm={algorithm}
                  visible={visible}
                  flippedProps={flippedProps}
                />
              )}
            </Flipped>
          ))}
        </Flipper>
      </ContextMenuContent>
    </ContextMenu>
  )
}
