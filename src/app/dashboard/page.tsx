'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WardrobeUploader } from '@/components/wardrobe/WardrobeUploader'
import { ClosetGrid } from '@/components/wardrobe/ClosetGrid'
import { OutfitGenerator } from '@/components/outfits/OutfitGenerator'
import { OutfitDisplay } from '@/components/outfits/OutfitDisplay'
import { LookbookGrid } from '@/components/lookbook/LookbookGrid'
import { useToast } from '@/components/ui/use-toast'
import { saveToLookbook } from '@/lib/api/lookbook'
import { recordFeedback } from '@/lib/api/feedback'
import { getWardrobeItems } from '@/lib/api/wardrobe'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OutfitSuggestion } from '@/lib/api/gemini'
import type { Database } from '@/types/supabase'
import { useAuth } from '@/components/auth/AuthProvider'

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']

type Tab = 'wardrobe' | 'outfits' | 'lookbook'

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('wardrobe')
  const [isGenerating, setIsGenerating] = useState(false)
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([])
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    setUserId(userId);
    const fetchWardrobeItems = async () => {
      try {
        const items = await getWardrobeItems(userId)
        setWardrobeItems(items)
      } catch (error) {
        toast({
          title: 'Error loading wardrobe',
          description: 'Please try again later.',
          variant: 'destructive',
        })
      }
    }
    fetchWardrobeItems()
  }, [toast, user])

  const handleOutfitsGenerated = (newOutfits: OutfitSuggestion[]) => {
    setOutfits(newOutfits)
  }

  const handleSaveToLookbook = async (outfit: OutfitSuggestion) => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save outfits.',
        variant: 'destructive',
      })
      return
    }
    try {
      const { error } = await saveToLookbook(outfit, userId)
      if (error) throw error
      toast({
        title: 'Saved to lookbook',
        description: 'Your outfit has been saved successfully.',
      })
      setActiveTab('lookbook')
    } catch (error) {
      toast({
        title: 'Error saving outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  const handleFeedback = async (outfitId: string, isPositive: boolean) => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to provide feedback.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await recordFeedback(outfitId, userId, isPositive)
      if (error) throw error

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

  const handleTryAgain = () => {
    setOutfits([])
  }

  if (!userId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Style Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your wardrobe, generate outfits, and save your favorite looks.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
          <TabsTrigger value="outfits">Outfit Generator</TabsTrigger>
          <TabsTrigger value="lookbook">Lookbook</TabsTrigger>
        </TabsList>

        <TabsContent value="wardrobe" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Upload New Items</h2>
            <WardrobeUploader onUpload={async () => {
              // Refetch wardrobe items after upload
              if (userId) {
                const items = await getWardrobeItems(userId)
                setWardrobeItems(items)
              }
            }} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">My Closet</h2>
            <ClosetGrid />
          </section>
        </TabsContent>

        <TabsContent value="outfits" className="space-y-6">
          <OutfitGenerator
            userId={userId}
            isLoading={isGenerating}
            setIsLoading={setIsGenerating}
            wardrobeItems={wardrobeItems}
          />
          <OutfitDisplay
            outfits={outfits}
            wardrobeItems={wardrobeItems}
            onSaveToLookbook={handleSaveToLookbook}
            onFeedback={handleFeedback}
            onTryAgain={handleTryAgain}
          />
        </TabsContent>

        <TabsContent value="lookbook">
          <LookbookGrid userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 