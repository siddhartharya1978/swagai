'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { deleteLookbookItem } from '@/lib/api/lookbook'
import { getWardrobeItems } from '@/lib/api/wardrobe'
import { Trash2, Calendar, Heart, Cloud, Image as ImageIcon } from 'lucide-react'
import type { Database } from '@/types/supabase'
import Image from 'next/image'
import type { OutfitSuggestion } from '@/lib/api/gemini'
import { TooltipWrapper } from '@/components/ui/TooltipWrapper'

type LookbookItem = Database['public']['Tables']['lookbook_items']['Row']
type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']

interface LookbookItemCardProps {
  item: LookbookItem
  userId: string
  onDelete: () => void
}

export function LookbookItemCard({ item, userId, onDelete }: LookbookItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [wardrobeItems, setWardrobeItems] = useState<Record<string, WardrobeItem>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const items = await getWardrobeItems(userId)
        const itemsMap = items.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {} as Record<string, WardrobeItem>)
        setWardrobeItems(itemsMap)
      } catch (error) {
        toast({
          title: 'Error loading items',
          description: 'Could not load some outfit items.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWardrobeItems()
  }, [userId, toast])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this outfit?')) return

    setIsDeleting(true)
    try {
      await deleteLookbookItem(item.id, userId)
      onDelete()
      toast({
        title: 'Outfit deleted',
        description: 'The outfit has been removed from your lookbook.',
      })
    } catch (error) {
      toast({
        title: 'Error deleting outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const outfitData = item.outfit_data as unknown as OutfitSuggestion

  return (
    <TooltipWrapper content="Click to view details of this outfit" side="top" delayDuration={300}>
      <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header with occasion and delete button */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium capitalize">{outfitData.occasion}</span>
          </div>
          <TooltipWrapper content="Remove this outfit from your lookbook" side="top" delayDuration={300}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipWrapper>
        </div>

        {/* Outfit items grid */}
        <div className="grid grid-cols-2 gap-2 p-4">
          {outfitData.item_ids.map((itemId) => {
            const wardrobeItem = wardrobeItems[itemId]
            return (
              <TooltipWrapper content="Clothing item used in this outfit" side="top" delayDuration={300} key={itemId}>
                <div
                  className="group/item relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
                >
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    </div>
                  ) : wardrobeItem ? (
                    <>
                      <Image
                        src={wardrobeItem.cleaned_image_url || ''}
                        alt={`${wardrobeItem.main_type} ${wardrobeItem.sub_type}`}
                        fill
                        className="object-contain transition-transform group-hover/item:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover/item:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 transition-opacity group-hover/item:opacity-100">
                        <p className="text-xs font-medium capitalize">
                          {wardrobeItem.main_type} {wardrobeItem.sub_type}
                        </p>
                        <p className="text-xs capitalize text-gray-200">
                          {wardrobeItem.color} {wardrobeItem.pattern}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                      <ImageIcon className="h-6 w-6" />
                      <p className="text-xs">Item not found</p>
                    </div>
                  )}
                </div>
              </TooltipWrapper>
            )
          })}
        </div>

        {/* Footer with metadata and notes */}
        <div className="border-t p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
              <Heart className="h-3 w-3" />
              {outfitData.mood}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
              <Cloud className="h-3 w-3" />
              {outfitData.weather}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{outfitData.notes}</p>
          <TooltipWrapper content="When this outfit was saved" side="top" delayDuration={300}>
            <p className="mt-2 text-xs text-gray-500">
              Saved on {new Date(item.created_at).toLocaleDateString()}
            </p>
          </TooltipWrapper>
        </div>
      </div>
    </TooltipWrapper>
  )
} 