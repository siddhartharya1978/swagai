'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { WardrobeItemCard } from './WardrobeItemCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getWardrobeItems, deleteWardrobeItem } from '@/lib/api/wardrobe'
import type { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'
import { TooltipWrapper } from '@/components/ui/TooltipWrapper'
import { withTooltip } from '@/lib/utils'
import { useAuth } from '@/components/auth/AuthProvider'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
]

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']

type FilterState = {
  main_type: string
  color: string
  pattern: string
  occasion: string
  search: string
  sort: string
}

const initialFilter: FilterState = {
  main_type: 'all',
  color: 'all',
  pattern: 'all',
  occasion: 'all',
  search: '',
  sort: 'newest',
}

export function ClosetGrid() {
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterState>(initialFilter)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadItems = useCallback(async () => {
    try {
      const userId = user?.id
      if (!userId) throw new Error('User not authenticated')
      const data = await getWardrobeItems(userId)
      setItems(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Error loading wardrobe items.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleDelete = async (item: WardrobeItem) => {
    try {
      const userId = user?.id
      if (!userId) throw new Error('User not authenticated')
      await deleteWardrobeItem(item.id, userId)
      setItems(items.filter(i => i.id !== item.id))
      toast({ title: 'Deleted', description: 'Item deleted from wardrobe.' })
    } catch (error) {
      toast({ title: 'Error', description: 'Error deleting item.', variant: 'destructive' })
    }
  }

  // Filtering and sorting
  const filteredItems = useMemo(() => {
    let filtered = items
    if (filter.main_type !== 'all') filtered = filtered.filter(i => i.main_type === filter.main_type)
    if (filter.color !== 'all') filtered = filtered.filter(i => i.color === filter.color)
    if (filter.pattern !== 'all') filtered = filtered.filter(i => i.pattern === filter.pattern)
    if (filter.occasion !== 'all') filtered = filtered.filter(i => i.occasion === filter.occasion)
    if (filter.search) {
      const search = filter.search.toLowerCase()
      filtered = filtered.filter(i =>
        i.main_type?.toLowerCase().includes(search) ||
        i.color?.toLowerCase().includes(search) ||
        i.pattern?.toLowerCase().includes(search) ||
        i.occasion?.toLowerCase().includes(search) ||
        i.auto_tags?.some(tag => tag.toLowerCase().includes(search))
      )
    }
    if (filter.sort === 'newest') filtered = filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    if (filter.sort === 'oldest') filtered = filtered.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''))
    return filtered
  }, [items, filter])

  // Unique values for filters
  const mainTypes = useMemo(() => ['all', ...Array.from(new Set(items.map(i => i.main_type).filter(Boolean)))], [items])
  const colors = useMemo(() => ['all', ...Array.from(new Set(items.map(i => i.color).filter(Boolean)))], [items])
  const patterns = useMemo(() => ['all', ...Array.from(new Set(items.map(i => i.pattern).filter(Boolean)))], [items])
  const occasions = useMemo(() => ['all', ...Array.from(new Set(items.map(i => i.occasion).filter(Boolean)))], [items])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        {withTooltip(
          <Select value={filter.main_type} onValueChange={v => setFilter(f => ({ ...f, main_type: v }))}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              {mainTypes.map(type => <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>)}
            </SelectContent>
          </Select>,
          { content: 'Filter your wardrobe by category', side: 'top', delayDuration: 300 }
        )}
        {withTooltip(
          <Select value={filter.color} onValueChange={v => setFilter(f => ({ ...f, color: v }))}>
            <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
            <SelectContent>
              {colors.map(color => <SelectItem key={color} value={color}>{color === 'all' ? 'All Colors' : color}</SelectItem>)}
            </SelectContent>
          </Select>,
          { content: 'Filter your wardrobe by color', side: 'top', delayDuration: 300 }
        )}
        {withTooltip(
          <Select value={filter.pattern} onValueChange={v => setFilter(f => ({ ...f, pattern: v }))}>
            <SelectTrigger><SelectValue placeholder="Pattern" /></SelectTrigger>
            <SelectContent>
              {patterns.map(pattern => <SelectItem key={pattern} value={pattern}>{pattern === 'all' ? 'All Patterns' : pattern}</SelectItem>)}
            </SelectContent>
          </Select>,
          { content: 'Filter your wardrobe by pattern', side: 'top', delayDuration: 300 }
        )}
        {withTooltip(
          <Select value={filter.occasion} onValueChange={v => setFilter(f => ({ ...f, occasion: v }))}>
            <SelectTrigger><SelectValue placeholder="Occasion" /></SelectTrigger>
            <SelectContent>
              {occasions.map(occasion => <SelectItem key={occasion} value={occasion}>{occasion === 'all' ? 'All Occasions' : occasion}</SelectItem>)}
            </SelectContent>
          </Select>,
          { content: 'Filter your wardrobe by occasion', side: 'top', delayDuration: 300 }
        )}
        {withTooltip(
          <Input
            placeholder="Search by tag, type, color..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />, { content: 'Search your entire wardrobe by any property', side: 'top', delayDuration: 300 }
        )}
        {withTooltip(
          <Select value={filter.sort} onValueChange={v => setFilter(f => ({ ...f, sort: v }))}>
            <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>,
          { content: 'Sort your items by date or name', side: 'top', delayDuration: 300 }
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No items found. Try adjusting your filters or upload some clothes!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <WardrobeItemCard
              key={item.id}
              item={item}
              onEdit={() => toast({ title: 'Edit not implemented', description: 'Tag editing coming soon!' })}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 