'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateAge } from '@/lib/utils/age'
import ThoughtInput from '@/components/ThoughtInput'
import Timeline from '@/components/Timeline'
import ShareCard from '@/components/ShareCard'
import Auth from '@/components/Auth'
import DateOfBirthSetup from '@/components/DateOfBirthSetup'

interface Thought {
  id: string
  age: number
  thought: string
  created_at: string
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null)
  const [currentAge, setCurrentAge] = useState<number | null>(null)
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth')
        .eq('id', user.id)
        .single<{ date_of_birth: string | null }>()

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to load profile:', error)
        setIsLoading(false)
        return
      }

      if (data?.date_of_birth) {
        setDateOfBirth(data.date_of_birth)
        setCurrentAge(calculateAge(data.date_of_birth))
      } else {
        // Explicitly set to null if no date of birth exists
        setDateOfBirth(null)
        setCurrentAge(null)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setDateOfBirth(null)
      setCurrentAge(null)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const loadThoughts = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', user.id)
        .order('age', { ascending: true })

      if (error) throw error
      if (data) setThoughts(data)
    } catch (error) {
      console.error('Failed to load thoughts:', error)
    }
  }, [supabase])

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsLoading(true)
        loadProfile()
        loadThoughts()
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth state changes (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsLoading(true)
        loadProfile()
        loadThoughts()
      } else {
        setDateOfBirth(null)
        setCurrentAge(null)
        setThoughts([])
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, loadProfile, loadThoughts])

  const handleSaveThought = async (thoughtText: string) => {
    if (!user || !dateOfBirth || isSaving) return

    setIsSaving(true)
    try {
      const age = calculateAge(dateOfBirth)

      const { data, error } = await supabase
        .from('thoughts')
        .insert({
          user_id: user.id,
          age,
          thought: thoughtText,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setThoughts([...thoughts, data].sort((a, b) => a.age - b.age))
      }
    } catch (error) {
      console.error('Failed to save thought:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDateOfBirthComplete = async () => {
    setIsLoading(true)
    await loadProfile()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl font-serif text-[#f97316]/40">...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  if (!dateOfBirth) {
    return <DateOfBirthSetup onComplete={handleDateOfBirthComplete} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-shrink-0 px-6 pt-6 pb-4">
            <div className="max-w-6xl mx-auto flex justify-end">
              <button
                onClick={handleSignOut}
                className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors font-serif"
              >
                sign out
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 pb-12">
            <div className="max-w-6xl mx-auto w-full">
              <ThoughtInput
                currentAge={currentAge}
                onSave={handleSaveThought}
                isSaving={isSaving}
              />
            </div>
          </div>

          <div className="flex-shrink-0 px-6 pb-12">
            <div className="max-w-6xl mx-auto w-full">
              <Timeline
                thoughts={thoughts}
                onPreserve={setSelectedThought}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedThought && (
        <ShareCard
          thought={selectedThought}
          onClose={() => setSelectedThought(null)}
        />
      )}
    </div>
  )
}
