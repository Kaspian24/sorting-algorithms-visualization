import React, { Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Footer from '@renderer/components/Footer/Footer'
import Header from '@renderer/components/Header/Header'
import { ChartsInfoProvider } from '@renderer/components/providers/ChartsInfoProvider'
import { ThemeProvider } from '@renderer/components/providers/ThemeProvider'
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
            <Header />
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
