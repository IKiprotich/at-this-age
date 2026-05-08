'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isMagicLink, setIsMagicLink] = useState(false)

  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email to confirm your account')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMessage('Check your email for the magic link')
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl soft-panel p-8 md:p-10">
        <div className="mb-16 text-center">
          {isSignUp ? (
            <div>
              <p className="text-4xl md:text-5xl font-serif text-[#2c2c2c] leading-tight tracking-tight mb-4">
                capture your thoughts
              </p>
              <p className="text-lg md:text-xl font-serif text-[#2c2c2c]/60 leading-relaxed">
                at every moment in your life
              </p>
            </div>
          ) : (
            <div>
              <p className="text-4xl md:text-5xl font-serif text-[#2c2c2c] leading-tight tracking-tight mb-4">
                welcome back
              </p>
              <p className="text-lg md:text-xl font-serif text-[#2c2c2c]/60 leading-relaxed">
                continue your journey
              </p>
            </div>
          )}
        </div>

        <div className="mb-8 flex gap-3 justify-center text-sm rounded-2xl bg-[#f97316]/5 p-1">
          <button
            onClick={() => {
              setIsSignUp(false)
              setIsMagicLink(false)
              setMessage('')
            }}
            className={`px-4 py-2 rounded-xl transition-colors ${
              !isSignUp ? 'bg-white text-[#2c2c2c]' : 'text-[#2c2c2c]/60 hover:text-[#2c2c2c]/80'
            }`}
          >
            sign in
          </button>
          <button
            onClick={() => {
              setIsSignUp(true)
              setIsMagicLink(false)
              setMessage('')
            }}
            className={`px-4 py-2 rounded-xl transition-colors ${
              isSignUp ? 'bg-white text-[#2c2c2c]' : 'text-[#2c2c2c]/60 hover:text-[#2c2c2c]/80'
            }`}
          >
            sign up
          </button>
        </div>

        <form onSubmit={isMagicLink ? handleMagicLink : handleEmailAuth} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required={!isMagicLink}
              className="soft-input text-xl"
            />
          </div>

          {!isMagicLink && (
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                className="soft-input text-xl"
              />
            </div>
          )}

          {message && (
            <div className="text-sm text-[#2c2c2c]/60 text-center">{message}</div>
          )}

          <div className="flex flex-col gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full soft-button"
            >
              {isLoading ? '...' : isMagicLink ? 'send magic link' : isSignUp ? 'sign up' : 'sign in'}
            </button>

            {!isMagicLink && (
              <button
                type="button"
                onClick={() => {
                  setIsMagicLink(true)
                  setMessage('')
                }}
                className="w-full subtle-button"
              >
                use magic link instead
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
