'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          date_of_birth: dateOfBirth,
        })

      if (error) throw error
      onComplete()
    } catch (error: any) {
      console.error('Failed to save date of birth:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="text-3xl font-serif text-[#2c2c2c] leading-relaxed">
            to begin, tell us when you were born
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
              className="w-full px-4 py-3 text-lg font-serif bg-transparent border-b border-[#2c2c2c]/20 focus:outline-none focus:border-[#2c2c2c]/40 transition-colors"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={!dateOfBirth || isSaving}
              className="px-8 py-3 text-sm tracking-wide text-[#2c2c2c] hover:text-[#2c2c2c]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'saving...' : 'continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
