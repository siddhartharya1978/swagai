import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <ErrorBoundary>{children}</ErrorBoundary>,
    ...options,
  })
}

export * from '@testing-library/react'
export { render } 