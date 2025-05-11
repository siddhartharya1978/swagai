'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, CheckCircle, AlertTriangle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { uploadWardrobeItem, updateWardrobeItemTagsAndNotes } from '@/lib/api/wardrobe'
import { useToast } from '@/components/ui/use-toast'
import { TooltipWrapper } from '@/components/ui/TooltipWrapper'
import { useAuth } from '@/components/auth/AuthProvider'
import Image from 'next/image'
import { sha256 } from '@/lib/api/wardrobe'

interface UploadProgress {
  fileName: string
  file: File
  previewUrl: string
  progress: number
  status: 'queued' | 'uploading' | 'removing-bg' | 'tagging' | 'success' | 'error' | 'duplicate' | 'canceled'
  error?: string
  tags?: string
  notes?: string
  wardrobeItemId?: string
  fileHash?: string
}

interface WardrobeUploaderProps {
  onUpload: (file: File) => void
}

export const WardrobeUploader = ({ onUpload }: WardrobeUploaderProps) => {
  const { user } = useAuth()
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const { toast } = useToast()
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    )

    if (validFiles.length !== acceptedFiles.length) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload only JPG, JPEG, or PNG files.',
        variant: 'destructive',
      })
    }

    if (validFiles.length + uploadProgress.length > 10) {
      toast({
        title: 'Upload limit',
        description: 'You can upload up to 10 images at a time.',
        variant: 'destructive',
      })
      return
    }

    for (const file of validFiles) {
      // Compute hash for duplicate detection
      const hash = await sha256(file)
      const alreadyQueued = uploadProgress.some(u => u.fileHash === hash)
      if (alreadyQueued) {
        toast({
          title: 'Duplicate image',
          description: `${file.name} is already in your upload list.`,
          variant: 'destructive',
        })
        continue
      }
      const previewUrl = URL.createObjectURL(file)
      setUploadProgress(prev => [...prev, {
        fileName: file.name,
        file,
        previewUrl,
        progress: 0,
        status: 'queued',
        tags: '',
        notes: '',
        fileHash: hash,
      }])
    }

    const file = validFiles[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onUpload(file)
  }, [toast, onUpload])

  // Start uploads when files are added
  const startUploads = useCallback(() => {
    uploadProgress.forEach(async (item, idx) => {
      if (item.status !== 'queued') return
      setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'uploading', progress: 10 } : u))
      try {
        const userId = user?.id
        if (!userId) throw new Error('User not authenticated')
        setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'removing-bg', progress: 30 } : u))
        const { data, error, duplicate } = await uploadWardrobeItem(item.file, userId)
        if (duplicate) {
          setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'duplicate', progress: 100, error: 'Duplicate item' } : u))
          toast({ title: 'Duplicate item', description: `${item.fileName} already exists in your wardrobe.`, variant: 'destructive' })
          return
        }
        if (error) throw error
        setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'tagging', progress: 70 } : u))
        setTimeout(() => {
          setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'success', progress: 100, wardrobeItemId: data?.id, tags: data?.auto_tags?.join(', ') || '', notes: data?.notes || '' } : u))
          toast({ title: 'Upload successful', description: `${item.fileName} has been added to your wardrobe.` })
        }, 500)
      } catch (error: any) {
        let userMessage = 'Upload failed'
        let details = ''
        const errMsg = error?.message || error?.toString() || ''
        if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit')) {
          userMessage = 'Rate limit reached'
          details = 'You have reached the maximum number of uploads allowed in a short period. Please wait a few minutes and try again, or upgrade your plan if needed.'
        } else if (errMsg.includes('403') || errMsg.toLowerCase().includes('forbidden')) {
          userMessage = 'API access forbidden'
          details = 'The background removal service rejected your request. Please check your API key and permissions, or generate a new key.'
        } else {
          details = `Failed to upload ${item.fileName}. Please try again.`
        }
        setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'error', progress: 100, error: userMessage + (details ? `: ${details}` : '') } : u))
        toast({ title: userMessage, description: details || `Failed to upload ${item.fileName}. Please try again.`, variant: 'destructive' })
      }
    })
  }, [uploadProgress, toast, user])

  // Cancel upload
  const cancelUpload = (idx: number) => {
    setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, status: 'canceled', progress: 0 } : u))
  }

  // Save tags and notes for a wardrobe item
  const handleSaveTagsNotes = async (idx: number) => {
    const item = uploadProgress[idx]
    if (!item.wardrobeItemId) return
    try {
      await updateWardrobeItemTagsAndNotes(item.wardrobeItemId, item.tags || '', item.notes || '')
      toast({ title: 'Saved', description: 'Tags and notes updated.' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update tags/notes.', variant: 'destructive' })
    }
  }

  const handleTagChange = (idx: number, value: string) => {
    setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, tags: value } : u))
  }
  const handleNotesChange = (idx: number, value: string) => {
    setUploadProgress(prev => prev.map((u, i) => i === idx ? { ...u, notes: value } : u))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 10,
  })

  return (
    <div className="space-y-4">
      <TooltipWrapper content="Drag and drop your clothing photos here or click to browse" side="top" delayDuration={300}>
        <Card
          {...getRootProps()}
          className={`p-6 border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
        >
          <input
            {...getInputProps()}
            data-testid="file-input"
            accept="image/*"
          />
          {preview ? (
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-600">
                {isDragActive ? 'Drop the files here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">or click to select</p>
            </div>
          )}
        </Card>
      </TooltipWrapper>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((item, idx) => (
            <div key={item.fileName} className="flex items-center gap-4 p-2 border rounded-lg bg-white/80 shadow-sm">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={item.previewUrl}
                  alt={item.fileName}
                  fill
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-sm">{item.fileName}</span>
                  {item.status === 'uploading' && <Loader2 className="animate-spin h-4 w-4 text-primary" />}
                  {item.status === 'removing-bg' && <Loader2 className="animate-spin h-4 w-4 text-blue-500" />}
                  {item.status === 'tagging' && <Loader2 className="animate-spin h-4 w-4 text-green-500" />}
                  {item.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {item.status === 'error' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {item.status === 'duplicate' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {item.status === 'canceled' && <X className="h-4 w-4 text-muted-foreground" />}
                </div>
                <Progress value={item.progress} className={item.status === 'error' ? 'bg-destructive/20' : ''} />
                {item.error && <div className="text-xs text-destructive">{item.error}</div>}
                {item.status === 'duplicate' && <div className="text-xs text-yellow-600">Duplicate item detected. This file already exists in your wardrobe.</div>}
                {/* Editable tags */}
                {item.status === 'success' && (
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-medium">Tags (comma separated):</label>
                    <input
                      type="text"
                      value={item.tags || ''}
                      onChange={e => handleTagChange(idx, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-xs bg-white"
                      placeholder="e.g. shirt, blue, casual"
                    />
                    <label className="text-xs font-medium mt-1">Notes/Comments:</label>
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={e => handleNotesChange(idx, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-xs bg-white"
                      placeholder="Add your notes or comments here"
                    />
                    <Button size="sm" className="mt-1 w-fit" onClick={() => handleSaveTagsNotes(idx)}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {(item.status === 'uploading' || item.status === 'removing-bg' || item.status === 'tagging') && (
                  <Button variant="outline" size="sm" onClick={() => cancelUpload(idx)}>
                    Cancel
                  </Button>
                )}
                {(item.status === 'error' || item.status === 'duplicate' || item.status === 'canceled' || item.status === 'success') && (
                  <Button variant="ghost" size="icon" onClick={() => setUploadProgress(prev => prev.filter((_, i) => i !== idx))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="pt-2">
            <TooltipWrapper content="Upload selected photos to your wardrobe" side="bottom" delayDuration={300}>
              <Button onClick={startUploads} disabled={uploadProgress.every(u => u.status !== 'queued')}>
                Start Uploads
              </Button>
            </TooltipWrapper>
          </div>
        </div>
      )}
    </div>
  )
} 