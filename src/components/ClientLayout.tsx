'use client'

import * as React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider as RadixTooltipProvider } from '@/components/ui/Tooltip'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { WelcomeModal } from '@/components/WelcomeModal'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'

function TooltipProviderWithChildren({ children }: { children: React.ReactNode }) {
  // @ts-expect-error Radix types may not include children, but it works at runtime
  return <RadixTooltipProvider>{children}</RadixTooltipProvider>
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showWelcome, setShowWelcome] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('swagai_onboarding_complete') === 'true'
      if (!completed) setShowWelcome(true)
    }
  }, [])

  const handleCloseWelcome = React.useCallback(() => {
    setShowWelcome(false)
    localStorage.setItem('swagai_onboarding_complete', 'true')
  }, [])

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {/* @ts-expect-error AuthProvider children typing */}
      <AuthProvider>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* @ts-expect-error TooltipProvider children typing */}
            <TooltipProviderWithChildren>
              <WelcomeModal show={showWelcome} onClose={handleCloseWelcome} />
              <div className="fixed top-4 left-4 z-50">
                <button
                  aria-label="How to Use"
                  className="rounded-full bg-purple-500 text-white px-4 py-2 shadow hover:bg-purple-600 transition"
                  onClick={() => setShowWelcome(true)}
                >
                  How to Use
                </button>
              </div>
              {children}
              <Toaster />
            </TooltipProviderWithChildren>
          </ThemeProvider>
        </ErrorBoundary>
      </AuthProvider>
    </SessionContextProvider>
  )
} 