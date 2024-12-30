import React, { Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Footer from '@renderer/components/Footer/Footer'
import Header from '@renderer/components/Header/Header'
import { AlgorithmsVisibilityProvider } from '@renderer/components/providers/AlgorithmsVisibilityProvider/AlgorithmsVisibilityProvider'
import { GlobalChartsInfoProvider } from '@renderer/components/providers/GlobalChartsInfoProvider/GlobalChartsInfoProvider'
import { ThemeProvider } from '@renderer/components/providers/ThemeProvider/ThemeProvider'
import { ScrollArea } from '@renderer/components/ui/ScrollArea'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const enableTanStackRouterDevtools = false

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production' || !enableTanStackRouterDevtools
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-dvh flex-col font-sans">
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <GlobalChartsInfoProvider>
            <AlgorithmsVisibilityProvider>
              <Header />
              <ScrollArea className="h-0 flex-auto">
                <main className="h-full w-full select-none">
                  <Outlet />
                </main>
              </ScrollArea>
              <Footer />
            </AlgorithmsVisibilityProvider>
          </GlobalChartsInfoProvider>
        </ThemeProvider>
      </DndProvider>
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </div>
  ),
})
