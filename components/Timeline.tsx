'use client'

import { useMemo, useState } from 'react'
import { formatAge } from '@/lib/utils/formatAge'

interface Thought {
  id: string
  age: number
  thought: string
  archived_at: string | null
  created_at: string
}

interface TimelineProps {
  thoughts: Thought[]
  currentAge: number | null
  onPreserve: (thought: Thought) => void
  onEdit: (thoughtId: string, nextThoughtText: string) => Promise<void>
  onArchive: (thoughtId: string) => Promise<void>
}

export default function Timeline({ thoughts, currentAge, onPreserve, onEdit, onArchive }: TimelineProps) {
  if (thoughts.length === 0) {
    return null
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [showResurfacedInTimeline, setShowResurfacedInTimeline] = useState(false)
  const [editingThoughtId, setEditingThoughtId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)
  const [isArchivingId, setIsArchivingId] = useState<string | null>(null)

  const filteredThoughts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const parsedMinAge = minAge === '' ? null : Number(minAge)
    const parsedMaxAge = maxAge === '' ? null : Number(maxAge)

    return thoughts.filter((thought) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        thought.thought.toLowerCase().includes(normalizedSearch)
      const matchesMinAge = parsedMinAge === null || thought.age >= parsedMinAge
      const matchesMaxAge = parsedMaxAge === null || thought.age <= parsedMaxAge

      return matchesSearch && matchesMinAge && matchesMaxAge
    })
  }, [thoughts, searchTerm, minAge, maxAge])

  const resurfacedThoughts = useMemo(() => {
    if (currentAge === null) return []

    const ageWindow = 0.5

    return thoughts
      .filter((thought) => Math.abs(thought.age - currentAge) <= ageWindow)
      .sort((a, b) => Math.abs(a.age - currentAge) - Math.abs(b.age - currentAge))
      .slice(0, 3)
  }, [thoughts, currentAge])

  const displayThoughts = useMemo(() => {
    if (showResurfacedInTimeline) return filteredThoughts

    const resurfacedIds = new Set(resurfacedThoughts.map((thought) => thought.id))
    return filteredThoughts.filter((thought) => !resurfacedIds.has(thought.id))
  }, [filteredThoughts, resurfacedThoughts, showResurfacedInTimeline])

  const hasActiveFilters =
    searchTerm.trim().length > 0 || minAge.trim().length > 0 || maxAge.trim().length > 0

  const handleClearFilters = () => {
    setSearchTerm('')
    setMinAge('')
    setMaxAge('')
  }

  const startEditing = (thought: Thought) => {
    setEditingThoughtId(thought.id)
    setEditingText(thought.thought)
  }

  const cancelEditing = () => {
    setEditingThoughtId(null)
    setEditingText('')
  }

  const submitEditing = async (thoughtId: string) => {
    const trimmed = editingText.trim()
    if (!trimmed || isSubmittingEdit) return

    setIsSubmittingEdit(true)
    try {
      await onEdit(thoughtId, trimmed)
      cancelEditing()
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const handleArchive = async (thoughtId: string) => {
    if (isArchivingId) return
    setIsArchivingId(thoughtId)
    try {
      await onArchive(thoughtId)
    } finally {
      setIsArchivingId(null)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10 space-y-4 soft-panel p-5 md:p-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search thoughts"
          className="soft-input"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            min="0"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            placeholder="min age"
            className="soft-input"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            placeholder="max age"
            className="soft-input"
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="text-xs text-[#2c2c2c]/50 font-serif tracking-wide uppercase">
            showing {displayThoughts.length} of {thoughts.length}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
            >
              clear filters
            </button>
          )}
        </div>
        {resurfacedThoughts.length > 0 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowResurfacedInTimeline((prev) => !prev)}
              className="text-xs text-[#2c2c2c]/50 hover:text-[#2c2c2c]/70 transition-colors font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
            >
              {showResurfacedInTimeline ? 'hide resurfaced from timeline' : 'show resurfaced in timeline'}
            </button>
          </div>
        )}
      </div>

      {resurfacedThoughts.length > 0 && (
        <div className="mb-12">
          <div className="text-xs text-[#f97316]/60 mb-4 font-serif tracking-wider uppercase">
            on this age
          </div>
          <div className="space-y-6">
            {resurfacedThoughts.map((thought) => (
              <div key={`resurfaced-${thought.id}`} className="p-5 border border-[#f97316]/15 rounded-3xl bg-white/45">
                <div className="text-xs text-[#f97316]/60 mb-2 font-serif tracking-wider uppercase">
                  {formatAge(thought.age)}
                </div>
                <div className="text-lg md:text-xl font-serif text-[#2c2c2c] leading-relaxed mb-4">
                  {thought.thought}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onPreserve(thought)}
                    className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                  >
                    preserve
                  </button>
                  <button
                    onClick={() => startEditing(thought)}
                    className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => handleArchive(thought.id)}
                    disabled={isArchivingId === thought.id}
                    className="text-xs text-[#2c2c2c]/45 hover:text-[#2c2c2c]/70 disabled:opacity-40 transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                  >
                    {isArchivingId === thought.id ? 'archiving...' : 'archive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {displayThoughts.length === 0 && (
        <div className="py-8 text-center text-sm text-[#2c2c2c]/50 font-serif">
          no thoughts match your filters
        </div>
      )}

      <div className="space-y-4">
        {displayThoughts.map((thought) => (
          <div key={thought.id} className="pb-8 px-5 pt-5 border border-[#f97316]/12 rounded-3xl bg-white/40">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#f97316]/60 mb-3 font-serif tracking-wider uppercase">
                  {formatAge(thought.age)}
                </div>
                {editingThoughtId === thought.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-lg md:text-xl font-serif bg-white/65 border border-[#f97316]/25 rounded-2xl focus:outline-none focus:border-[#f97316]/50 transition-colors resize-none"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => submitEditing(thought.id)}
                        disabled={!editingText.trim() || isSubmittingEdit}
                        className="soft-button !px-4 !py-2 !text-xs"
                      >
                        {isSubmittingEdit ? 'saving...' : 'save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="subtle-button !px-3 !py-2 !text-xs"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xl md:text-2xl font-serif text-[#2c2c2c] leading-relaxed">
                    {thought.thought}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-4">
                <button
                  onClick={() => onPreserve(thought)}
                  className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                >
                  preserve
                </button>
                <button
                  onClick={() => startEditing(thought)}
                  className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                >
                  edit
                </button>
                <button
                  onClick={() => handleArchive(thought.id)}
                  disabled={isArchivingId === thought.id}
                  className="text-xs text-[#2c2c2c]/45 hover:text-[#2c2c2c]/70 disabled:opacity-40 transition-colors whitespace-nowrap font-serif tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-[#f97316]/10"
                >
                  {isArchivingId === thought.id ? 'archiving...' : 'archive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
