import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'
import { autoTagClothingItem } from './gemini'
import { removeBackgroundFromFile } from './apyhub'

export async function sha256(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

type WardrobeItem = Database['public']['Tables']['wardrobe_items']['Row']
type WardrobeItemInsert = Database['public']['Tables']['wardrobe_items']['Insert']

export async function uploadWardrobeItem(
  file: File,
  userId: string
): Promise<{ data: WardrobeItem | null; error: Error | null; duplicate?: boolean }> {
  try {
    // 0. Generate SHA-256 hash of the image
    const imageHash = await sha256(file)

    // 1. Check for duplicates
    const { data: existing, error: dupError } = await supabase
      .from('wardrobe_items')
      .select('id')
      .eq('user_id', userId)
      .eq('image_hash', imageHash)
      .maybeSingle()
    if (dupError) throw dupError
    if (existing) {
      return { data: null, error: new Error('Duplicate item detected.'), duplicate: true }
    }

    // 2. Upload original image to wardrobe bucket
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}` // No leading slash
    const filePath = fileName
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wardrobe')
      .upload(filePath, file)
    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      // If you see a 400 error, check your Supabase storage bucket policies for authenticated upload permissions.
      throw uploadError
    }

    // 3. Get the public URL
    const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('wardrobe')
      .getPublicUrl(filePath)

    // 4. Remove background using ApyHub
    const cleanedImageBlob = await removeBackgroundFromFile(file)
    const cleanedFileName = `${userId}/${Date.now()}-cleaned.png`
    const cleanedFilePath = `${cleanedFileName}`
    const { data: cleanedUploadData, error: cleanedUploadError } = await supabase.storage
      .from('wardrobe-cleaned')
      .upload(cleanedFilePath, cleanedImageBlob)
    if (cleanedUploadError) {
      console.error('Supabase cleaned image upload error:', cleanedUploadError)
      throw cleanedUploadError
    }

    const { data: { publicUrl: cleanedImageUrl } } = supabase.storage
      .from('wardrobe-cleaned')
      .getPublicUrl(cleanedFilePath)

    // 5. Call Gemini API to auto-tag the clothing item
    let autoTagResult;
    try {
      autoTagResult = await autoTagClothingItem(cleanedImageUrl)
    } catch (e) {
      console.error('Gemini auto-tagging failed:', e);
      autoTagResult = {
        main_type: '',
        sub_type: '',
        color: '',
        pattern: '',
        occasion: '',
        auto_tags: [],
      };
    }

    // 6. Create wardrobe item record
    const newItem: WardrobeItemInsert = {
      user_id: userId,
      image_url: imageUrl,
      cleaned_image_url: cleanedImageUrl,
      main_type: autoTagResult.main_type,
      sub_type: autoTagResult.sub_type,
      color: autoTagResult.color,
      pattern: autoTagResult.pattern,
      occasion: autoTagResult.occasion,
      auto_tags: autoTagResult.auto_tags,
      image_hash: imageHash,
    }

    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert(newItem)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error uploading wardrobe item:', error)
    return { data: null, error: error as Error }
  }
}

export async function getWardrobeItems(userId: string) {
  const { data, error } = await supabase
    .from('wardrobe_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function deleteWardrobeItem(itemId: string, userId: string) {
  // 1. Get the item to find the image URLs
  const { data: item, error: fetchError } = await supabase
    .from('wardrobe_items')
    .select('image_url, cleaned_image_url')
    .eq('id', itemId)
    .eq('user_id', userId)
    .single()

  if (fetchError) throw fetchError

  // 2. Delete images from storage
  if (item.image_url) {
    const imagePath = item.image_url.split('/').pop()
    if (imagePath) {
      await supabase.storage.from('wardrobe').remove([imagePath])
    }
  }

  if (item.cleaned_image_url) {
    const cleanedImagePath = item.cleaned_image_url.split('/').pop()
    if (cleanedImagePath) {
      await supabase.storage.from('wardrobe-cleaned').remove([cleanedImagePath])
    }
  }

  // 3. Delete the database record
  const { error: deleteError } = await supabase
    .from('wardrobe_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)

  if (deleteError) throw deleteError
}

export async function updateWardrobeItemTagsAndNotes(itemId: string, tags: string, notes: string) {
  // Convert comma-separated tags to array
  const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
  const { error } = await supabase
    .from('wardrobe_items')
    .update({ auto_tags: tagsArray, notes })
    .eq('id', itemId)
  if (error) throw error
} 