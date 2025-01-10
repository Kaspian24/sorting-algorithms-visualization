import { ScrollArea } from '@renderer/components/ui/ScrollArea'

export interface ChartCardCodeProps {
  code: string
}

export default function ChartCardCode({ code }: ChartCardCodeProps) {
  return (
    <div className="flex h-0 flex-auto items-center justify-center">
      <ScrollArea
        className="h-full w-full"
        draggable
        onDragStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-fit select-text whitespace-break-spaces">
            {code}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
