import React, { Suspense } from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@renderer/components/ThemeProvider/ThemeProvider'
import { ModeToggle } from '@renderer/components/ModeToggle/ModeToggle'

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
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="flex h-12 items-center border-b">
          <div className="flex gap-2 p-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
          </div>
          <ModeToggle />
        </header>
        <main className="flex grow flex-col">
          <Outlet />
        </main>
        <footer className="flex h-16 border-t"></footer>
      </ThemeProvider>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
})
