import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'

import './i18n/config.ts'

import { routeTree } from './routeTree.gen'

import '@renderer/main.css'

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
})

const router = createRouter({ routeTree, history: memoryHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}
