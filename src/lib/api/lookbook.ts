import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import type { OutfitSuggestion } from './gemini'

type LookbookItem = Database['public']['Tables']['lookbook_items']['Row']
type LookbookItemInsert = Database['public']['Tables']['lookbook_items']['Insert']

export async function saveToLookbook(
  outfit: OutfitSuggestion,
  userId: string
): Promise<{ data: LookbookItem | null; error: Error | null }> {
  try {
    const newLookbookItem: LookbookItemInsert = {
      user_id: userId,
      outfit_data: outfit as unknown as Database['public']['Tables']['lookbook_items']['Insert']['outfit_data'],
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('lookbook_items')
      .insert(newLookbookItem)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error saving to lookbook:', JSON.stringify(error, null, 2), error)
    return { data: null, error: error as Error }
  }
}

export async function getLookbookItems(userId: string): Promise<LookbookItem[]> {
  const { data, error } = await supabase
    .from('lookbook_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function deleteLookbookItem(itemId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('lookbook_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)

  if (error) throw error
} 