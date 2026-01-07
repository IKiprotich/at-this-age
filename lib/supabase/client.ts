import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Safe storage adapter that handles browser context and storage restrictions
// This matches localStorage's synchronous interface but gracefully handles errors
const createSafeStorage = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Return a no-op storage for SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }

  // Try to use localStorage, but handle cases where it's blocked
  try {
    const test = '__supabase_storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    
    // Return a safe wrapper around localStorage
    return {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key)
        } catch {
          return null
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value)
        } catch {
          // Silently fail if storage is blocked
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key)
        } catch {
          // Silently fail if storage is blocked
        }
      },
    }
  } catch {
    // If localStorage is completely blocked, return a no-op storage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
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
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  return supabaseClient
}
