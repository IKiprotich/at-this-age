'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

interface DateOfBirthSetupProps {
  onComplete: () => void
}

export default function DateOfBirthSetup({ onComplete }: DateOfBirthSetupProps) {
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateOfBirth || isSaving) return

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const upsertData: Database['public']['Tables']['profiles']['Insert'] = {
        id: user.id,
        date_of_birth: dateOfBirth,
      }

      const { error } = await (supabase.from('profiles') as any)
        .upsert(upsertData)

      if (error) throw error
      onComplete()
    } catch (error: any) {
      console.error('Failed to save date of birth:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl soft-panel p-8 md:p-10">
        <div className="mb-16 text-center">
          <p className="text-4xl md:text-5xl font-serif text-[#2c2c2c] leading-tight tracking-tight mb-4">
            to begin
          </p>
          <p className="text-lg md:text-xl font-serif text-[#2c2c2c]/60 leading-relaxed">
            tell us when you were born
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="soft-input text-xl"
            />
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!dateOfBirth || isSaving}
              className="soft-button"
            >
              {isSaving ? 'saving...' : 'continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
