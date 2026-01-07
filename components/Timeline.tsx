'use client'

import { formatAge } from '@/lib/utils/formatAge'

interface Thought {
  id: string
  age: number
  thought: string
  created_at: string
}

interface TimelineProps {
  thoughts: Thought[]
  onPreserve: (thought: Thought) => void
}

export default function Timeline({ thoughts, onPreserve }: TimelineProps) {
  if (thoughts.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-24">
      <div className="space-y-8">
        {thoughts.map((thought, index) => (
          <div key={thought.id} className="pb-8 border-b border-[#2c2c2c]/10 last:border-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-[#2c2c2c]/50 mb-2 font-serif">
                  {formatAge(thought.age)}
                </div>
                <div className="text-lg font-serif text-[#2c2c2c] leading-relaxed">
                  {thought.thought}
                </div>
              </div>
              <button
                onClick={() => onPreserve(thought)}
                className="text-xs text-[#2c2c2c]/40 hover:text-[#2c2c2c]/60 transition-colors whitespace-nowrap"
              >
                preserve this moment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
