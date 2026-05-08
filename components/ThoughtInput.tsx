'use client'

import { useState } from 'react'

interface ThoughtInputProps {
  currentAge: number | null
  onSave: (thought: string) => Promise<void>
  isSaving: boolean
}

export default function ThoughtInput({ currentAge, onSave, isSaving }: ThoughtInputProps) {
  const [thought, setThought] = useState('')
  const promptSuggestions = [
    'today i am learning to',
    'right now i am afraid of',
    'lately i keep thinking about',
    'the version of me i am becoming is',
  ]

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
      
      <div className="mb-8 relative max-w-4xl mx-auto soft-panel p-4 md:p-6">
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder=""
          rows={3}
          className="w-full text-xl md:text-2xl font-serif bg-transparent focus:outline-none resize-none relative z-10 rounded-xl"
          style={{ 
            lineHeight: '1.6',
            padding: '0 2rem',
            margin: '0',
            border: 'none',
          }}
        />
      </div>

      <div className="mb-10 max-w-4xl mx-auto">
        <div className="text-xs text-[#2c2c2c]/50 mb-3 font-serif tracking-wide uppercase">
          need a prompt?
        </div>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setThought(prompt)}
              className="px-3 py-2 text-xs text-[#2c2c2c]/60 hover:text-[#2c2c2c] border border-[#f97316]/20 hover:border-[#f97316]/35 hover:bg-[#f97316]/5 rounded-full transition-colors font-serif tracking-wide uppercase"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={!thought.trim() || isSaving}
          className="soft-button"
        >
          {isSaving ? 'saving...' : 'save thought'}
        </button>
      </div>
    </form>
  )
}
