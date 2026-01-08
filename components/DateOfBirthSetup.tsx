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
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
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
              className="w-full px-6 py-4 text-xl font-serif bg-transparent border-b border-[#f97316]/20 focus:outline-none focus:border-[#f97316]/50 transition-colors"
            />
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!dateOfBirth || isSaving}
              className="px-12 py-4 text-sm tracking-wider bg-[#f97316] text-white hover:bg-[#ea580c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-serif uppercase"
            >
              {isSaving ? 'saving...' : 'continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
