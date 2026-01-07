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
    <div className="w-full">
      <div className="space-y-12">
        {thoughts.map((thought, index) => (
          <div key={thought.id} className="pb-12 border-b border-[#f97316]/10 last:border-0">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#f97316]/60 mb-3 font-serif tracking-wider uppercase">
                  {formatAge(thought.age)}
                </div>
                <div className="text-xl md:text-2xl font-serif text-[#2c2c2c] leading-relaxed">
                  {thought.thought}
                </div>
              </div>
              <button
                onClick={() => onPreserve(thought)}
                className="text-xs text-[#f97316]/60 hover:text-[#f97316] transition-colors whitespace-nowrap font-serif tracking-wide uppercase flex-shrink-0"
              >
                preserve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
