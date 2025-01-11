import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  atomOneDark as dark,
  atomOneLight as light,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from '@renderer/components/providers/ThemeProvider/ThemeProvider'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'

export interface ChartCardCodeProps {
  code: string
}

export default function ChartCardCode({ code }: ChartCardCodeProps) {
  const { theme } = useTheme()

  return (
    <div className="flex h-0 flex-auto items-center justify-center">
      <ScrollArea
        className="h-full w-full rounded-lg"
        draggable
        onDragStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
      >
        <div className="h-full w-full select-text">
          <SyntaxHighlighter
            className="h-full w-full items-center justify-center"
            language="typescript"
            customStyle={{ display: 'flex', padding: '1rem' }}
            style={theme === 'dark' ? dark : light}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </ScrollArea>
    </div>
  )
}
