import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Check if storage is available
const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const test = '__supabase_storage_test__'
    if (typeof Storage !== 'undefined' && window.localStorage) {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    }
  } catch {
    return false
  }
  return false
}

// Safe storage adapter that handles browser context and storage restrictions
// This matches localStorage's synchronous interface but gracefully handles errors
const createSafeStorage = () => {
  const storageAvailable = isStorageAvailable()
  
  // Return a safe wrapper around localStorage or no-op if unavailable
  return {
    getItem: (key: string) => {
      if (!storageAvailable) return null
      try {
        return localStorage.getItem(key)
      } catch (error) {
        // Suppress storage access errors
        return null
      }
    },
    setItem: (key: string, value: string) => {
      if (!storageAvailable) return
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        // Suppress storage access errors - silently fail
      }
    },
    removeItem: (key: string) => {
      if (!storageAvailable) return
      try {
        localStorage.removeItem(key)
      } catch (error) {
        // Suppress storage access errors - silently fail
      }
    },
  }
}

export const createClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: createSafeStorage(),
      autoRefreshToken: true,
      persistSession: isStorageAvailable(),
      detectSessionInUrl: true,
      storageKey: 'sb-auth-token',
    },
  })
  
  return supabaseClient
}
