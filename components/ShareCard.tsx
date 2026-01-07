'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { formatAge } from '@/lib/utils/formatAge'

interface Thought {
  id: string
  age: number
  thought: string
  created_at: string
}

interface ShareCardProps {
  thought: Thought
  onClose: () => void
}

export default function ShareCard({ thought, onClose }: ShareCardProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [includeAge, setIncludeAge] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [variant] = useState(Math.random() > 0.5 ? 'centered' : 'offset')

  const handleExport = async () => {
    if (!exportRef.current || isExporting) return

    setIsExporting(true)
    try {
      const dataUrl = await toPng(exportRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        quality: 1,
      })

      if (navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], `at-this-age-${thought.id}.png`, { type: 'image/png' })
          await navigator.share({
            files: [file],
          })
        } catch (err) {
          const link = document.createElement('a')
          link.download = `at-this-age-${thought.id}.png`
          link.href = dataUrl
          link.click()
        }
      } else {
        const link = document.createElement('a')
        link.download = `at-this-age-${thought.id}.png`
        link.href = dataUrl
        link.click()
      }
    } catch (error) {
      console.error('Failed to export image:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <div
        ref={exportRef}
        className="fixed -left-[9999px] top-0"
        style={{
          width: '1080px',
          height: '1080px',
          backgroundColor: '#f7f5f2',
          fontFamily: 'Playfair Display, Georgia, serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: variant === 'offset' ? '120px 108px' : '120px',
          textAlign: 'center',
        }}
      >
        {includeAge && (
          <div
            style={{
              fontSize: '48px',
              color: 'rgba(44, 44, 44, 0.7)',
              lineHeight: '1.6',
              marginBottom: '48px',
            }}
          >
            when i was {formatAge(thought.age)} years old,
            <br />
            i thought…
          </div>
        )}
        <div
          style={{
            fontSize: '64px',
            color: '#2c2c2c',
            lineHeight: '1.6',
            marginBottom: '64px',
          }}
        >
          "{thought.thought}"
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(44, 44, 44, 0.4)',
            marginTop: 'auto',
          }}
        >
          written at a moment in time
        </div>
      </div>

      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
          <div className="mb-6">
            <h2 className="text-xl font-serif mb-4">preserve this moment</h2>
            
            <div className="mb-6 bg-[#f7f5f2] p-8 rounded" style={{ aspectRatio: '1/1' }}>
              <div
                className="w-full h-full flex flex-col justify-center items-center p-12 text-center"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  backgroundColor: '#f7f5f2',
                  ...(variant === 'offset' ? { paddingLeft: '10%', paddingRight: '10%' } : {}),
                }}
              >
                {includeAge && (
                  <div className="text-2xl md:text-3xl mb-6 text-[#2c2c2c]/70 leading-relaxed">
                    when i was {formatAge(thought.age)} years old,
                    <br />
                    i thought…
                  </div>
                )}
                <div className="text-3xl md:text-4xl text-[#2c2c2c] leading-relaxed mb-8">
                  "{thought.thought}"
                </div>
                <div className="text-xs text-[#2c2c2c]/40 mt-auto">
                  written at a moment in time
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={includeAge}
                onChange={(e) => setIncludeAge(e.target.checked)}
                className="w-4 h-4"
              />
              <span>include age</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#2c2c2c]/60 hover:text-[#2c2c2c] transition-colors"
              >
                close
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2 text-sm bg-[#2c2c2c] text-white hover:bg-[#2c2c2c]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? 'exporting...' : 'export image'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
