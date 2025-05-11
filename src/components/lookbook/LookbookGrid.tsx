'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { getLookbookItems } from '@/lib/api/lookbook'
import { LookbookItemCard } from './LookbookItemCard'
import { Loader2 } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { TooltipWrapper } from '@/components/ui/TooltipWrapper'

type LookbookItem = Database['public']['Tables']['lookbook_items']['Row']

interface LookbookGridProps {
  userId: string
}

export function LookbookGrid({ userId }: LookbookGridProps) {
  const [items, setItems] = useState<LookbookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchItems = useCallback(async () => {
    try {
      const data = await getLookbookItems(userId)
      setItems(data)
    } catch (error) {
      toast({
        title: 'Error loading lookbook',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [userId, toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <TooltipWrapper content="Save outfits to see them here" side="top" delayDuration={300}>
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No saved outfits yet</h3>
          <p className="text-sm text-gray-500">
            Generate and save outfits to see them here.
          </p>
        </div>
      </TooltipWrapper>
    )
  }

  return (
    <TooltipWrapper content="Your saved outfit combinations" side="top" delayDuration={300}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id}>
            <LookbookItemCard
              item={item}
              userId={userId}
              onDelete={fetchItems}
            />
          </div>
        ))}
      </div>
    </TooltipWrapper>
  )
} 