'use client'

import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import type { OutfitSuggestion } from '@/lib/api/gemini'
import type { Database } from '@/types/supabase'

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']

interface OutfitDisplayProps {
  outfits: OutfitSuggestion[]
  wardrobeItems: WardrobeItem[]
  onSaveToLookbook: (outfit: OutfitSuggestion) => Promise<void>
  onFeedback: (outfitId: string, isPositive: boolean) => Promise<void>
  onTryAgain: () => void
}

export function OutfitDisplay({
  outfits,
  wardrobeItems,
  onSaveToLookbook,
  onFeedback,
  onTryAgain,
}: OutfitDisplayProps) {
  const { toast } = useToast()

  const getItemById = (id: string) => {
    return wardrobeItems.find(item => item.id === id)
  }

  const handleSave = async (outfit: OutfitSuggestion) => {
    try {
      await onSaveToLookbook(outfit)
      toast({
        title: 'Saved to lookbook',
        description: 'Your outfit has been saved successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error saving outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  const handleFeedback = async (outfitId: string, isPositive: boolean) => {
    try {
      await onFeedback(outfitId, isPositive)
      toast({
        title: 'Feedback recorded',
        description: 'Thank you for your feedback!',
      })
    } catch (error) {
      toast({
        title: 'Error recording feedback',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  if (outfits.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {outfits.map((outfit, index) => (
        <Card key={index} className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Outfit {index + 1}</h3>
              <div className="grid grid-cols-2 gap-2">
                {outfit.item_ids.map((itemId) => {
                  const item = getItemById(itemId)
                  if (!item) return null
                  const imageUrl = item.cleaned_image_url || item.image_url
                  if (!imageUrl) return null
                  return (
                    <div key={itemId} className="relative aspect-square">
                      <Image
                        src={imageUrl}
                        alt={item.auto_tags?.join(', ') || 'Wardrobe item'}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Styling Notes</h4>
                <p className="text-sm text-muted-foreground">{outfit.notes}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(outfit)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to Lookbook
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Like outfit"
                  onClick={() => handleFeedback(outfit.item_ids[0], true)}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Dislike outfit"
                  onClick={() => handleFeedback(outfit.item_ids[0], false)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button variant="outline" onClick={onTryAgain}>
          Try Different Options
        </Button>
      </div>
    </div>
  )
} 