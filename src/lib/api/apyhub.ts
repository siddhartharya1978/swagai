const APYHUB_API_KEY = process.env.NEXT_PUBLIC_APYHUB_API_KEY || process.env.APYHUB_API_KEY
const APYHUB_API_URL = 'https://api.apyhub.com/processor/image/remove-background/file'
const PHOTOROOM_API_KEY = process.env.NEXT_PUBLIC_PHOTOROOM_API_KEY
const PHOTOROOM_API_URL = 'https://sdk.photoroom.com/v1/segment'

if (!APYHUB_API_KEY) {
  throw new Error('ApyHub API key is not set in environment variables.')
}

if (!PHOTOROOM_API_KEY) {
  throw new Error('PhotoRoom API key is not set in environment variables.')
}

// Helper function to wait between retries
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to implement exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0
  let delay = initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (retries >= maxRetries) throw error
      
      // Only retry on rate limit errors
      if (error instanceof Error && error.message.includes('429')) {
        retries++
        await wait(delay)
        delay *= 2 // Exponential backoff
        continue
      }
      throw error
    }
  }
}

export async function removeBackgroundWithApyHub(file: File | Blob): Promise<Blob> {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await retryWithBackoff(async () => {
      const res = await fetch(APYHUB_API_URL, {
        method: 'POST',
        headers: {
          'apy-token': APYHUB_API_KEY as string,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const errorMessage = errorData?.error?.message || `HTTP error ${res.status}`
        throw new Error(errorMessage)
      }

      return res
    })

    return response.blob()
  } catch (error) {
    console.error('Error in removeBackgroundWithApyHub:', error)
    throw new Error('Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

export async function removeBackgroundWithPhotoRoom(file: File | Blob): Promise<Blob> {
  try {
    const formData = new FormData()
    formData.append('image_file', file)

    const response = await fetch(PHOTOROOM_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': PHOTOROOM_API_KEY as string,
        'Accept': 'image/png, application/json',
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`PhotoRoom error (${response.status}): ${errorText}`)
    }

    return await response.blob()
  } catch (error) {
    console.error('Error in removeBackgroundWithPhotoRoom:', error)
    throw new Error('Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

export async function removeBackgroundFromFile(file: File | Blob): Promise<Blob> {
  try {
    // Try PhotoRoom first
    return await removeBackgroundWithPhotoRoom(file)
  } catch (err) {
    console.warn('PhotoRoom failed, trying ApyHub fallback...', err)
    try {
      // Try ApyHub fallback
      return await removeBackgroundWithApyHub(file)
    } catch (err2) {
      console.error('ApyHub fallback also failed:', err2)
      // Throw a combined error
      throw new Error(`PhotoRoom error: ${err instanceof Error ? err.message : err}. ApyHub error: ${err2 instanceof Error ? err2.message : err2}`)
    }
  }
} 