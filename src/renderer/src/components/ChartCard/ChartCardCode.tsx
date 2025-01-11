import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  a11yLight as light,
  atomOneDark as dark,
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
            className="h-full w-full"
            language="typescript"
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
