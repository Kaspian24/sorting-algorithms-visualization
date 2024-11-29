import { Flipped, Flipper } from 'react-flip-toolkit'
import AlgorithmsVisibilityButtonItem from '@renderer/components/AlgorithmsVisibilityButtonItem/AlgorithmsVisibilityButtonItem'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider'
import { Button } from '@renderer/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/Dialog'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'
import { DRAG_ITEM_TYPE } from '@renderer/types/types'

export default function AlgorithmsVisibilityButton() {
  const { algorithmsVisibilityData, draggablesTransitionStateRef } =
    useAlgorithmsVisibility()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Algorithms visibility</Button>
      </DialogTrigger>
      <DialogContent className="flex h-3/6 min-h-64 w-96 flex-col">
        <DialogHeader>
          <DialogTitle>Algorithms visibility</DialogTitle>
          <DialogDescription>Change Algorithms visibility.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-0 flex-auto">
          <div className="flex flex-col gap-y-2 pr-5">
            <Flipper
              className="contents"
              flipKey={`algorithmsVisibilityButton${algorithmsVisibilityData.map(({ algorithm }) => algorithm).join('')}`}
            >
              {algorithmsVisibilityData.map(({ algorithm, visible }) => (
                <Flipped
                  key={`algorithmsVisibilityButtonItem${algorithm}`}
                  flipId={`algorithmsVisibilityButtonItem${algorithm}`}
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
                    <AlgorithmsVisibilityButtonItem
                      algorithm={algorithm}
                      visible={visible}
                      flippedProps={flippedProps}
                    />
                  )}
                </Flipped>
              ))}
            </Flipper>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
