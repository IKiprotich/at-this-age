'use client'

import { useState } from 'react'

interface ThoughtInputProps {
  currentAge: number | null
  onSave: (thought: string) => Promise<void>
  isSaving: boolean
}

export default function ThoughtInput({ currentAge, onSave, isSaving }: ThoughtInputProps) {
  const [thought, setThought] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!thought.trim() || isSaving) return
    
    await onSave(thought.trim())
    setThought('')
  }

  if (currentAge === null) {
    return null
  }

  const formattedAge = currentAge.toFixed(currentAge % 1 === 0 ? 0 : currentAge % 0.1 === 0 ? 1 : 2)

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <p className="text-4xl md:text-5xl font-serif text-[#2c2c2c] leading-relaxed">
          when i was {formattedAge} years old, i thought…
        </p>
      </div>
      
      <div className="mb-6">
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder=""
          rows={4}
          className="w-full px-6 py-4 text-lg font-serif bg-transparent border-b border-[#2c2c2c]/20 focus:outline-none focus:border-[#2c2c2c]/40 resize-none transition-colors"
        />
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={!thought.trim() || isSaving}
          className="px-8 py-3 text-sm tracking-wide text-[#2c2c2c]/60 hover:text-[#2c2c2c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          save thought
        </button>
      </div>
    </form>
  )
}
