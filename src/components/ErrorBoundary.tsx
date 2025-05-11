'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface State {
  hasError: boolean
  error?: Error
}

interface ErrorInfo {
  componentStack: string
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 space-y-4 text-center">
            <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Add type assertion for testing
export const ErrorBoundaryForTesting = ErrorBoundary as React.ComponentType<{
  children: React.ReactNode
}> 