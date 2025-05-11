import type { Database } from '@/types/supabase'
import { supabase } from '@/lib/supabase'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

const STYLIST_SYSTEM_PROMPT = `You are SWAG AI, a world-class fashion stylist and wardrobe specialist with expertise spanning global fashion trends, Indian ethnic wear, fusion styles, and personalized styling.\n\n## Your Fashion Expertise\n- Expert knowledge of global fashion from casual to haute couture across all seasons and occasions\n- Deep understanding of Indian ethnic wear including regional variations (Salwar kameez, Sarees, Lehengas, Kurtas, Indo-western fusion)\n- Mastery of fabric types, color theory, body types, and occasion-appropriate styling\n- Current knowledge of emerging fashion trends, sustainable fashion practices, and vintage/classic styles\n- Ability to blend traditional elements with contemporary fashion for unique fusion looks\n\n## Your Styling Approach\n- Personalize recommendations based on user's body type, preferences, and existing wardrobe\n- Consider climate, cultural context, and occasion appropriateness\n- Create balanced outfits with proper proportions, complementary colors, and thoughtful accessorizing\n- Provide specific, actionable styling advice with technical fashion terminology\n- Balance trend-awareness with timeless style principles\n- Respect cultural significance of traditional garments while innovating respectfully\n\n## When Creating Outfit Suggestions\n1. Analyze available wardrobe items carefully, noting colors, patterns, fabrics, and style categories\n2. Consider the specified occasion, mood, weather, and any style preferences\n3. Select complementary pieces that create a cohesive, balanced outfit\n4. Explain your styling decisions with fashion rationale (color theory, silhouette, proportion)\n5. Suggest specific styling techniques (half-tuck, sleeve roll, draping methods for sarees/dupattas)\n6. Recommend accessorizing details that elevate the look (jewelry, bags, footwear)\n7. Provide confidence-boosting comments about how the outfit enhances the wearer's features\n\n## When Commenting on Outfits\n- Use precise fashion terminology and industry language\n- Reference relevant designer influences or fashion eras when appropriate\n- Highlight the strengths of the combination (color harmony, silhouette, texture play)\n- Suggest minor adjustments that could further enhance the look\n- Include specific compliments about how the outfit will look on the wearer\n- For Indian ethnic wear, note traditional elements and any regional influences\n\n## Style Guidance by Body Type\n- For apple shapes: Create vertical lines, emphasize legs, use empire waistlines\n- For pear shapes: Balance with structured shoulders, A-line silhouettes, statement accessories above the waist\n- For hourglass: Celebrate natural waist definition, fitted styles, balanced proportions\n- For athletic/rectangle: Create curves with peplums, draped fabrics, layering\n- For petite: Avoid overwhelming fabrics, use vertical lines, appropriate proportions\n- For plus size: Focus on fit over size, strategic color blocking, quality fabrics that drape well\n- For tall frames: Play with layering, horizontal breaks, statement pieces\n\nAlways be encouraging, specific, and thoughtful in your recommendations, acknowledging both fashion rules and when to beautifully break them. Your goal is to help users discover their personal style, feel confident, and create memorable looks from their existing wardrobe.`

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key is not set in environment variables.')
}

export interface AutoTagResult {
  main_type: string
  sub_type: string
  color: string
  pattern: string
  occasion: string
  auto_tags: string[]
}

export interface OutfitSuggestion {
  item_ids: string[]
  notes: string
  occasion: string
  mood: string
  weather: string
  generated_at: string
}

// Utility to robustly extract and clean JSON from LLM responses
function extractFirstJsonObject(text: string): string {
  // Remove code block markers (```json, ```)
  let cleaned = text.replace(/```json|```/gi, '').trim();
  // Find the first JSON object in the string
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

export async function autoTagClothingItem(imageUrl: string): Promise<AutoTagResult> {
  const prompt = `${STYLIST_SYSTEM_PROMPT}\n\nAnalyze the clothing item in this image and return a JSON object with:\n- main_type (e.g., shirt, pants, dress, footwear, handbag, headgear, sunglasses, belt, other)\n- sub_type (e.g., t-shirt, jeans, maxi dress, sneakers, tote bag, cap, etc.)\n- color (e.g., blue, red, multicolor)\n- pattern (e.g., solid, striped, floral)\n- occasion (e.g., casual, formal, party)\n- auto_tags (array of keywords about the item)\n- category (one of: clothing, footwear, handbags, headgear, sunglasses, belts, others)\nOnly return the JSON object, no extra text.`

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: await fetchImageAsBase64(imageUrl) } }
        ]
      }
    ]
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error('Failed to call Gemini Vision API')
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  try {
    const cleaned = extractFirstJsonObject(text);
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini response was not valid JSON: ' + text)
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function generateOutfit({
  userId,
  occasion,
  mood,
  weather,
  customPrompt,
}: {
  userId: string
  occasion: string
  mood: string
  weather: string
  customPrompt?: string
}): Promise<OutfitSuggestion> {
  // 1. Fetch user's wardrobe items
  const { data: wardrobeItems, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  if (!wardrobeItems || wardrobeItems.length === 0) {
    throw new Error('No wardrobe items found for this user.')
  }

  // 2. Construct prompt for Gemini
  const prompt = customPrompt && customPrompt.trim().length > 0
    ? `${STYLIST_SYSTEM_PROMPT}\n\nYou are a fashion AI. Given the following wardrobe items (as JSON), select a stylish outfit for the user. The user says: "${customPrompt}". When writing notes, reference items by their description (color, type, style), not by ID. Select only one item per main category (e.g., one top, one bottom, one footwear, etc.). Return a JSON object with:\n- item_ids: array of selected wardrobe item IDs\n- notes: styling notes and advice for the outfit\n- occasion, mood, weather (infer from the prompt or leave blank if not clear)\nOnly return the JSON object, no extra text.`
    : `${STYLIST_SYSTEM_PROMPT}\n\nYou are a fashion AI. Given the following wardrobe items (as JSON), select a stylish outfit for the user. An outfit can include a top, bottom, dress, outerwear, shoes, and accessories. The user wants an outfit for the following context:\n- Occasion: ${occasion}\n- Mood: ${mood}\n- Weather: ${weather}\n\nSelect the best combination of items from the wardrobe. Select only one item per main category (e.g., one top, one bottom, one footwear, etc.). When writing notes, reference items by their description (color, type, style), not by ID. Return a JSON object with:\n- item_ids: array of selected wardrobe item IDs\n- notes: styling notes and advice for the outfit\n- occasion, mood, weather (repeat back)\nOnly return the JSON object, no extra text.`

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { text: JSON.stringify(wardrobeItems) }
        ]
      }
    ]
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error('Failed to call Gemini API for outfit generation')
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  try {
    const cleaned = extractFirstJsonObject(text);
    const parsed = JSON.parse(cleaned);
    return {
      item_ids: parsed.item_ids,
      notes: parsed.notes,
      occasion: parsed.occasion,
      mood: parsed.mood,
      weather: parsed.weather,
      generated_at: new Date().toISOString(),
    }
  } catch {
    throw new Error('Gemini response was not valid JSON: ' + text)
  }
}

export async function getMissingCategorySuggestion({ missingCategories, occasion, mood, weather }: { missingCategories: string[], occasion: string, mood: string, weather: string }): Promise<string> {
  const prompt = `${STYLIST_SYSTEM_PROMPT}\n\nThe user is generating an outfit for the following context:\n- Occasion: ${occasion}\n- Mood: ${mood}\n- Weather: ${weather}\n\nHowever, their wardrobe is missing the following categories: ${missingCategories.join(', ')}.\n\nSuggest 1-2 specific, creative items for each missing category (with color/style suggestions) as bullet points. Be concise. Do not write long paragraphs. Example format:\n- Footwear: White leather sneakers\n- Sunglasses: Black aviator sunglasses\n- Belts: Brown woven leather belt`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error('Failed to call Gemini API for missing category suggestion')
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text.trim()
} 