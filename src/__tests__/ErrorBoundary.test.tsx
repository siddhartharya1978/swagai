import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundaryForTesting } from '@/components/ErrorBoundary'
import React from 'react'

// Mock window.location.reload
const mockReload = jest.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

const ThrowError = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected errors
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockReload.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundaryForTesting>
        <div>Test content</div>
      </ErrorBoundaryForTesting>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundaryForTesting>
        <ThrowError />
      </ErrorBoundaryForTesting>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('resets error state when Try again is clicked', () => {
    render(
      <ErrorBoundaryForTesting>
        <ThrowError />
      </ErrorBoundaryForTesting>
    )
    const tryAgainButton = screen.getByText('Try again')
    fireEvent.click(tryAgainButton)
    expect(mockReload).toHaveBeenCalled()
  })
}) 