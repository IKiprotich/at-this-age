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
      // Ensure fonts are loaded
      await document.fonts.ready
      
      const element = exportRef.current
      
      // Store original styles
      const originalStyles = {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        visibility: element.style.visibility,
        opacity: element.style.opacity,
        zIndex: element.style.zIndex,
      }
      
      // Temporarily position element in viewport for rendering
      element.style.position = 'fixed'
      element.style.left = '0'
      element.style.top = '0'
      element.style.visibility = 'visible'
      element.style.opacity = '1'
      element.style.zIndex = '9999'
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300))

      const dataUrl = await toPng(element, {
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        quality: 1,
        backgroundColor: '#f7f5f2',
        cacheBust: true,
      })

      // Restore original styles
      element.style.position = originalStyles.position
      element.style.left = originalStyles.left
      element.style.top = originalStyles.top
      element.style.visibility = originalStyles.visibility
      element.style.opacity = originalStyles.opacity
      element.style.zIndex = originalStyles.zIndex

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
      alert('Failed to export image. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <div
        ref={exportRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '1080px',
          height: '1080px',
          backgroundColor: '#f7f5f2',
          fontFamily: '"Playfair Display", Georgia, serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: variant === 'offset' ? '120px 108px' : '120px',
          textAlign: 'center',
          borderRadius: '48px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          visibility: 'hidden',
          opacity: '0',
        }}
      >
        {includeAge && (
          <div
            style={{
              fontSize: '48px',
              color: 'rgba(249, 115, 22, 0.8)',
              lineHeight: '1.6',
              marginBottom: '48px',
              fontWeight: 500,
              fontFamily: '"Playfair Display", Georgia, serif',
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
            fontWeight: 400,
            fontFamily: '"Playfair Display", Georgia, serif',
          }}
        >
          "{thought.thought}"
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(249, 115, 22, 0.5)',
            marginTop: 'auto',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: '"Playfair Display", Georgia, serif',
          }}
        >
          written at a moment in time
        </div>
      </div>

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl max-w-2xl w-full p-8 md:p-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-6 text-[#2c2c2c]">preserve this moment</h2>
            
            <div className="mb-8 bg-[#f7f5f2] p-6 md:p-8 rounded-3xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <div
                className="w-full h-full flex flex-col justify-center items-center p-8 md:p-12 text-center rounded-2xl"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  backgroundColor: '#f7f5f2',
                  ...(variant === 'offset' ? { paddingLeft: '10%', paddingRight: '10%' } : {}),
                }}
              >
                {includeAge && (
                  <div className="text-2xl md:text-3xl mb-6 text-[#f97316]/80 leading-relaxed font-medium">
                    when i was {formatAge(thought.age)} years old,
                    <br />
                    i thought…
                  </div>
                )}
                <div className="text-3xl md:text-4xl lg:text-5xl text-[#2c2c2c] leading-relaxed mb-8 font-normal">
                  "{thought.thought}"
                </div>
                <div className="text-xs text-[#f97316]/50 mt-auto tracking-wider uppercase">
                  written at a moment in time
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#f97316]/10">
            <label className="flex items-center gap-3 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={includeAge}
                onChange={(e) => setIncludeAge(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#f97316]/30 checked:bg-[#f97316] checked:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors cursor-pointer"
              />
              <span className="text-[#2c2c2c]/70 group-hover:text-[#2c2c2c] transition-colors font-serif">include age</span>
            </label>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm text-[#2c2c2c]/50 hover:text-[#2c2c2c]/70 transition-colors font-serif tracking-wide flex-1 sm:flex-initial"
              >
                close
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-8 py-3 text-sm bg-[#f97316] text-white hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-serif uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl flex-1 sm:flex-initial"
              >
                {isExporting ? 'downloading...' : 'download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
