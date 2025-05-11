'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { generateOutfit, getMissingCategorySuggestion } from '@/lib/api/gemini'
import { saveToLookbook } from '@/lib/api/lookbook'
import type { OutfitSuggestion } from '@/lib/api/gemini'
import { ThumbsUp, ThumbsDown, Save, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TooltipWrapper } from '@/components/ui/TooltipWrapper'

const OCCASIONS = [
  'casual',
  'formal',
  'business',
  'party',
  'date',
  'sports',
  'beach',
  'travel',
] as const

const MOODS = [
  'happy',
  'confident',
  'relaxed',
  'energetic',
  'elegant',
  'playful',
  'professional',
  'cozy',
] as const

const WEATHER = [
  'sunny',
  'rainy',
  'cloudy',
  'cold',
  'warm',
  'hot',
  'snowy',
  'windy',
] as const

const CATEGORIES = [
  'clothing',
  'footwear',
  'handbags',
  'headgear',
  'sunglasses',
  'belts',
  'others',
]

interface OutfitGeneratorProps {
  userId: string
  wardrobeItems: any[] // Use the correct type if available
}

export function OutfitGenerator({ userId, wardrobeItems }: OutfitGeneratorProps) {
  const [occasion, setOccasion] = useState<string>('')
  const [mood, setMood] = useState<string>('')
  const [weather, setWeather] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [outfit, setOutfit] = useState<OutfitSuggestion | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [missingSuggestion, setMissingSuggestion] = useState<string | null>(null)
  const { toast } = useToast()

  // Determine if dropdowns are filled
  const dropdownsFilled = occasion && mood && weather;
  // Determine if custom prompt is filled
  const customPromptFilled = customPrompt.trim().length > 0;
  // Disable Generate button only if neither is filled
  const disableGenerate = !customPromptFilled && !dropdownsFilled;
  // Disable text field if any dropdown is selected
  const disableTextField = !!occasion || !!mood || !!weather;

  const handleGenerate = async () => {
    if (!customPrompt && (!occasion || !mood || !weather)) {
      toast({
        title: 'Missing information',
        description: 'Please select all options or enter a custom prompt before generating outfits.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setOutfit(null)
    setIsSaved(false)
    setFeedback(null)
    setMissingSuggestion(null)

    try {
      const generatedOutfit = await generateOutfit({
        userId,
        occasion,
        mood,
        weather,
        customPrompt,
      })
      setOutfit(generatedOutfit)

      // Check for missing categories
      const userCategories = new Set(wardrobeItems.map(item => item.main_type || item.category || 'others'))
      const missingCategories = CATEGORIES.filter(cat => !Array.from(userCategories).map(x => x.toLowerCase()).includes(cat))
      if (missingCategories.length > 0) {
        // Call Gemini for suggestion
        const suggestion = await getMissingCategorySuggestion({
          missingCategories,
          occasion: generatedOutfit.occasion,
          mood: generatedOutfit.mood,
          weather: generatedOutfit.weather,
        })
        setMissingSuggestion(suggestion)
      }
    } catch (error) {
      toast({
        title: 'Error generating outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToLookbook = async () => {
    if (!outfit) return

    try {
      const { error } = await saveToLookbook(outfit, userId)
      if (error) throw error

      setIsSaved(true)
      toast({
        title: 'Outfit saved',
        description: 'Your outfit has been saved to your lookbook.',
      })
    } catch (error) {
      toast({
        title: 'Error saving outfit',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type)
    toast({
      title: 'Thank you for your feedback!',
      description: `You ${type === 'up' ? 'liked' : 'disliked'} this outfit.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Generate Your Outfit</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Occasion</label>
            <TooltipWrapper content="Select where you'll be wearing this outfit" side="top" delayDuration={300}>
              <Select value={occasion} onValueChange={setOccasion} disabled={!!customPromptFilled}>
                <SelectTrigger aria-label="Occasion">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipWrapper>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mood</label>
            <TooltipWrapper content="Choose how you want to feel in this outfit" side="top" delayDuration={300}>
              <Select value={mood} onValueChange={setMood} disabled={!!customPromptFilled}>
                <SelectTrigger aria-label="Mood">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {MOODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipWrapper>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weather</label>
            <TooltipWrapper content="Select the weather conditions" side="top" delayDuration={300}>
              <Select value={weather} onValueChange={setWeather} disabled={!!customPromptFilled}>
                <SelectTrigger aria-label="Weather">
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  {WEATHER.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w.charAt(0).toUpperCase() + w.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipWrapper>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Or enter your own prompt</label>
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="E.g. I want an outfit for a movie night with friends"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-primary bg-white"
            disabled={disableTextField}
          />
          <p className="text-xs text-muted-foreground">If you enter a custom prompt, the dropdowns will be ignored.</p>
        </div>

        <TooltipWrapper content="Let AI create an outfit from your wardrobe" side="bottom" delayDuration={300}>
          <Button
            onClick={handleGenerate}
            disabled={disableGenerate || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Outfit'
            )}
          </Button>
        </TooltipWrapper>
      </div>

      {/* Results Section */}
      {outfit && (
        <div className="space-y-6 rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Generated Outfit</h3>
            <div className="flex items-center gap-2">
              <TooltipWrapper content="Like this outfit" side="top" delayDuration={300}>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Like"
                  onClick={() => handleFeedback('up')}
                  className={cn(feedback === 'up' && 'bg-green-100')}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipWrapper>
              <TooltipWrapper content="Dislike this outfit" side="top" delayDuration={300}>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Dislike"
                  onClick={() => handleFeedback('down')}
                  className={cn(feedback === 'down' && 'bg-red-100')}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </TooltipWrapper>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-medium">Styling Notes</h4>
                <p className="text-sm text-gray-600">{outfit.notes}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  {outfit.occasion}
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                  {outfit.mood}
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  {outfit.weather}
                </span>
              </div>

              <div className="flex gap-2">
                <TooltipWrapper content="Save this outfit to your lookbook" side="top" delayDuration={300}>
                  <Button
                    onClick={handleSaveToLookbook}
                    disabled={isSaved}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaved ? 'Saved to Lookbook' : 'Save to Lookbook'}
                  </Button>
                </TooltipWrapper>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Again
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {outfit.item_ids.map((itemId) => {
                const item = wardrobeItems.find((w) => w.id === itemId);
                if (!item) return null;
                const imageUrl = item.cleaned_image_url || item.image_url;
                if (!imageUrl) return null;
                return (
                  <div
                    key={itemId}
                    className="aspect-square overflow-hidden rounded-lg border bg-gray-100 w-32 h-32 flex items-center justify-center"
                  >
                    <img
                      src={imageUrl}
                      alt={item.auto_tags?.join(', ') || 'Wardrobe item'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 