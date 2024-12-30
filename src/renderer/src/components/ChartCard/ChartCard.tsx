import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChartCardContent from '@renderer/components/ChartCard/ChartCardContent'
import { useAlgorithmsVisibility } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { ChartInfoProvider } from '@renderer/components/providers/ChartInfoProvider/ChartInfoProvider'
import { Button } from '@renderer/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@renderer/components/ui/Card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@renderer/components/ui/ContextMenu'
import useDragAlgorithm from '@renderer/hooks/useDragAlgorithm'
import { DRAG_ITEM_TYPE, SORTING_ALGORITHM } from '@renderer/types/types'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export interface ChartCardProps {
  algorithm: keyof typeof SORTING_ALGORITHM
  flippedProps: object
}

function ChartCard({ algorithm, flippedProps }: ChartCardProps) {
  const {
    setAlgorithmsVisibility,
    moveAlgorithmPositionLeft,
    moveAlgorithmPositionRight,
  } = useAlgorithmsVisibility()
  const { isDragging, ref, handlerId } = useDragAlgorithm(
    DRAG_ITEM_TYPE.CHART_CARD,
    algorithm,
  )
  const { t } = useTranslation(['ChartCard', 'AlgorithmsNames'])

  const [showInfo, setShowInfo] = useState(false)

  return (
    <Card
      className={`flex min-h-64 min-w-137.5 flex-col ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      ref={ref}
      data-handler-id={handlerId}
      {...flippedProps}
    >
      <ContextMenu>
        <ContextMenuTrigger className="contents">
          <CardHeader className="flex flex-row justify-between space-y-0 p-0 text-center">
            <div className="flex-1" />
            <div className="py-6">
              <CardTitle>{t(algorithm, { ns: 'AlgorithmsNames' })}</CardTitle>
            </div>
            <div className="flex flex-1 justify-end gap-x-2 pr-1 pt-1">
              <Button
                className={`h-fit w-fit rounded-full p-1`}
                variant={`${showInfo ? 'reversedOutline' : 'outline'}`}
                onClick={() => setShowInfo((prev) => !prev)}
              >
                <p className="flex h-6 w-6 items-center justify-center text-lg">
                  i
                </p>
              </Button>
              <Button
                className="h-fit w-fit rounded-full p-1"
                variant="outline"
                onClick={() => setAlgorithmsVisibility(algorithm, false)}
              >
                <X />
              </Button>
            </div>
          </CardHeader>
          <ChartCardContent
            useSort={
              SORTING_ALGORITHM[algorithm as keyof typeof SORTING_ALGORITHM]
            }
            showInfo={showInfo}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex justify-between"
            onClick={() => setAlgorithmsVisibility(algorithm, false)}
          >
            <span>{t('remove')}</span>
            <X size={16} />
          </ContextMenuItem>
          <ContextMenuLabel className="text-center">
            {t('move')}
          </ContextMenuLabel>
          <ContextMenuGroup className="flex">
            <ContextMenuItem
              onClick={() => moveAlgorithmPositionLeft(algorithm)}
            >
              <ArrowLeft size={16} /> <span>{t('left')}</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => moveAlgorithmPositionRight(algorithm)}
            >
              <span>{t('right')}</span> <ArrowRight size={16} />
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  )
}

function ChartCardWrapper({ algorithm, flippedProps }: ChartCardProps) {
  return (
    <ChartInfoProvider>
      <ChartCard algorithm={algorithm} flippedProps={flippedProps} />
    </ChartInfoProvider>
  )
}

export { ChartCardWrapper as ChartCard }
