import React, { Suspense } from 'react'
import { ChartControlProvider } from '@renderer/components/ChartControlProvider/ChartControlProvider'
import ChartControls from '@renderer/components/ChartControls/ChartControls'
import { ModeToggle } from '@renderer/components/ModeToggle/ModeToggle'
import { ThemeProvider } from '@renderer/components/ThemeProvider/ThemeProvider'
import { Button } from '@renderer/components/ui/Button'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col font-sans">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ChartControlProvider>
          <header className="flex h-12 items-center border-b">
            <ModeToggle />
            <Button onClick={() => location.reload()}>Reload</Button>
          </header>
          <ScrollArea className="h-0 flex-auto">
            <main>
              <Outlet />
            </main>
          </ScrollArea>
          <footer className="flex h-16 items-center justify-center border-t">
            <ChartControls />
            <p>footer</p>
          </footer>
        </ChartControlProvider>
      </ThemeProvider>
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </div>
  ),
})
