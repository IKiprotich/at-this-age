'use client'

import { useState } from 'react'

interface ThoughtInputProps {
  currentAge: number | null
  onSave: (thought: string) => Promise<void>
  isSaving: boolean
}

export default function ThoughtInput({ currentAge, onSave, isSaving }: ThoughtInputProps) {
  const [thought, setThought] = useState('')
  const [isFocused, setIsFocused] = useState(false)

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
      
      <div className="mb-6 relative">
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          rows={4}
          className="w-full text-lg font-serif bg-transparent focus:outline-none resize-none relative z-10"
          style={{ 
            lineHeight: '1.75',
            padding: '0 1.5rem',
            margin: '0',
            border: 'none',
          }}
        />
        <div 
          className="absolute border-b transition-colors pointer-events-none"
          style={{
            left: '1.5rem',
            right: '1.5rem',
            top: '1.5rem', // Positioned right at text baseline where cursor blinks
            borderColor: isFocused ? 'rgba(44, 44, 44, 0.4)' : 'rgba(44, 44, 44, 0.2)',
          }}
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
