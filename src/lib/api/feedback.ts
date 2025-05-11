import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type OutfitFeedback = Database['public']['Tables']['outfit_feedback']['Row']
type OutfitFeedbackInsert = Database['public']['Tables']['outfit_feedback']['Insert']

export async function recordFeedback(
  outfitId: string,
  userId: string,
  isPositive: boolean
): Promise<{ data: OutfitFeedback | null; error: Error | null }> {
  try {
    const newFeedback: OutfitFeedbackInsert = {
      user_id: userId,
      outfit_id: outfitId,
      is_positive: isPositive,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('outfit_feedback')
      .insert(newFeedback)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error recording feedback:', error)
    return { data: null, error: error as Error }
  }
}

export async function getOutfitFeedback(outfitId: string): Promise<{
  positive: number
  negative: number
}> {
  const { data, error } = await supabase
    .from('outfit_feedback')
    .select('is_positive')
    .eq('outfit_id', outfitId)

  if (error) throw error

  return {
    positive: data.filter(f => f.is_positive).length,
    negative: data.filter(f => !f.is_positive).length,
  }
} 