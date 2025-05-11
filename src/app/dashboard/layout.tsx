'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'
import * as React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Floating Help Button in bottom right */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="outline"
            className="rounded-full shadow-lg px-6 py-3 text-lg"
            onClick={() => {
              // Implement your help modal or redirect here
              alert('Help coming soon!');
            }}
          >
            Help
          </Button>
        </div>
        <header className="flex justify-end items-center gap-4 p-4">
          {/* User Menu - more prominent with avatar/initial and color */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center gap-2 rounded-full px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 shadow-md border-none">
                {/* User Initial or Avatar */}
                {user?.user_metadata?.full_name ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 font-bold text-lg">
                    {user.user_metadata.full_name[0].toUpperCase()}
                  </span>
                ) : user?.email ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 font-bold text-lg">
                    {user.email[0].toUpperCase()}
                  </span>
                ) : (
                  <User size={24} color="#fff" />
                )}
                <span className="font-semibold">
                  {user?.user_metadata?.full_name || user?.email || 'Account'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-lg border border-purple-200">
              <DropdownMenuItem asChild className="font-semibold text-purple-700 hover:bg-purple-100">
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => { await signOut(); router.push('/signin'); }} className="font-semibold text-red-600 hover:bg-red-100">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </AuthGuard>
  )
} 