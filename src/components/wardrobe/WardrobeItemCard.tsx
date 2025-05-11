import React, { useState } from 'react'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Database } from '@/types/supabase'

interface WardrobeItemCardProps {
  item: Database['public']['Tables']['wardrobe_items']['Row']
  onEdit?: (item: Database['public']['Tables']['wardrobe_items']['Row']) => void
  onDelete?: (item: Database['public']['Tables']['wardrobe_items']['Row']) => void
}

export function WardrobeItemCard({ item, onEdit, onDelete }: WardrobeItemCardProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  const imageUrl = showOriginal ? item.image_url : item.cleaned_image_url || item.image_url

  return (
    <Card className="group relative flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
      <div className="relative w-full aspect-square bg-muted-foreground/10 overflow-hidden">
        <Image
          src={imageUrl || '/placeholder.png'}
          alt={item.auto_tags?.join(', ') || 'Wardrobe item'}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-white/80 hover:bg-white"
          onClick={() => setShowOriginal(v => !v)}
        >
          {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" onClick={() => onEdit?.(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete?.(item)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base capitalize">{item.main_type || 'Item'}</span>
          <span className="text-xs rounded px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
            {item.color || 'Unknown'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.auto_tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/10">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
          {item.pattern && <span className="bg-accent/10 px-2 py-0.5 rounded">{item.pattern}</span>}
          {item.occasion && <span className="bg-accent/10 px-2 py-0.5 rounded">{item.occasion}</span>}
        </div>
      </div>
    </Card>
  )
} 