import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export async function createUserProfile(
  userId: string,
  profile: Omit<UserProfileInsert, 'id'>
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({ id: userId, ...profile })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { data: null, error: error as Error }
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStylePreferences(
  userId: string,
  preferences: string[]
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ style_preferences: preferences })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUserAccount(userId: string): Promise<{ error: Error | null }> {
  try {
    // 1. Delete user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)
    if (profileError) throw profileError

    // 2. Delete auth user (requires service role key or admin API)
    // This is a placeholder; actual deletion should be done securely server-side
    // For now, just return success for the profile deletion
    return { error: null }
  } catch (error) {
    console.error('Error deleting user account:', error)
    return { error: error as Error }
  }
} 