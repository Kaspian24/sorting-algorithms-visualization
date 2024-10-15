import { ReactNode } from 'react'
import { ChartControlProvider } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import ChartControls from '@renderer/components/ChartControls/ChartControls'
import { ModeToggle } from '@renderer/components/ModeToggle/ModeToggle'
import { Button } from '@renderer/components/ui/Button'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'

export interface PageContentProps {
  children?: ReactNode
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <ChartControlProvider>
      <header className="flex h-12 items-center border-b">
        <ModeToggle />
        <Button onClick={() => location.reload()}>Reload</Button>
      </header>
      <ScrollArea className="h-0 flex-auto">
        <main>{children}</main>
      </ScrollArea>
      <footer className="flex h-16 items-center justify-center border-t">
        <ChartControls />
        <p>footer</p>
      </footer>
    </ChartControlProvider>
  )
}
