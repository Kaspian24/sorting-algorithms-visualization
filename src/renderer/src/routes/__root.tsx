import React, { Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CustomDataButton from '@renderer/components/buttons/CustomDataButton'
import Footer from '@renderer/components/Footer/Footer'
import { ModeToggle } from '@renderer/components/ModeToggle/ModeToggle'
import { ChartsInfoProvider } from '@renderer/components/providers/ChartsInfoProvider'
import { ThemeProvider } from '@renderer/components/providers/ThemeProvider'
import { Button } from '@renderer/components/ui/Button'
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
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ChartsInfoProvider>
            <header className="flex h-12 items-center border-b">
              <ModeToggle />
              <Button onClick={() => location.reload()}>Reload</Button>
              <CustomDataButton />
            </header>
            <main className="h-0 flex-auto">
              <Outlet />
            </main>
            <Footer />
          </ChartsInfoProvider>
        </ThemeProvider>
      </DndProvider>
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </div>
  ),
})
