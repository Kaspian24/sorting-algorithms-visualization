import React, { Suspense } from 'react'
import PageContent from '@renderer/components/PageContent/PageContent'
import { ThemeProvider } from '@renderer/components/ThemeProvider/ThemeProvider'
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
        <PageContent>
          <Outlet />
        </PageContent>
      </ThemeProvider>
      <Suspense>
        <TanStackRouterDevtools position="top-right" />
      </Suspense>
    </div>
  ),
})
