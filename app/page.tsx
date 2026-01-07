'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile()
        loadThoughts()
      } else {
        setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile()
        loadThoughts()
      } else {
        setDateOfBirth(null)
        setCurrentAge(null)
        setThoughts([])
        setIsLoading(false)
      }
    })
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data?.date_of_birth) {
        setDateOfBirth(data.date_of_birth)
        setCurrentAge(calculateAge(data.date_of_birth))
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadThoughts = async () => {
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
  }

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

  const handleDateOfBirthComplete = () => {
    loadProfile()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-serif text-[#2c2c2c]/40">...</div>
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
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-right mb-8">
          <button
            onClick={handleSignOut}
            className="text-xs text-[#2c2c2c]/40 hover:text-[#2c2c2c]/60 transition-colors"
          >
            sign out
          </button>
        </div>

        <ThoughtInput
          currentAge={currentAge}
          onSave={handleSaveThought}
          isSaving={isSaving}
        />

        <Timeline
          thoughts={thoughts}
          onPreserve={setSelectedThought}
        />
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
