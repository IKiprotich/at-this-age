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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-16 text-center">
        <p className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#2c2c2c] leading-tight tracking-tight">
          when i was {formattedAge} years old, i thought…
        </p>
      </div>
      
      <div className="mb-8 relative max-w-4xl mx-auto">
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          rows={3}
          className="w-full text-xl md:text-2xl font-serif bg-transparent focus:outline-none resize-none relative z-10"
          style={{ 
            lineHeight: '1.6',
            padding: '0 2rem',
            margin: '0',
            border: 'none',
          }}
        />
        <div 
          className="absolute border-b transition-colors pointer-events-none"
          style={{
            left: '2rem',
            right: '2rem',
            top: '1.9rem', // Adjusted for larger text-xl/2xl font size
            borderColor: isFocused ? 'rgba(249, 115, 22, 0.6)' : 'rgba(249, 115, 22, 0.3)',
            borderWidth: '1px',
          }}
        />
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={!thought.trim() || isSaving}
          className="px-12 py-4 text-sm tracking-wider bg-[#f97316] text-white hover:bg-[#ea580c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-serif uppercase"
        >
          {isSaving ? 'saving...' : 'save thought'}
        </button>
      </div>
    </form>
  )
}
