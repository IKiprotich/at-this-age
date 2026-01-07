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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="text-3xl font-serif text-[#2c2c2c] mb-2">
            when i was {isSignUp ? 'starting' : 'returning'} years old, i thought…
          </p>
        </div>

        <div className="mb-6 flex gap-4 justify-center text-sm">
          <button
            onClick={() => {
              setIsSignUp(false)
              setIsMagicLink(false)
              setMessage('')
            }}
            className={`pb-2 border-b transition-colors ${
              !isSignUp ? 'border-[#2c2c2c]' : 'border-transparent text-[#2c2c2c]/60'
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
            className={`pb-2 border-b transition-colors ${
              isSignUp ? 'border-[#2c2c2c]' : 'border-transparent text-[#2c2c2c]/60'
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
              className="w-full px-4 py-3 text-lg font-serif bg-transparent border-b border-[#2c2c2c]/20 focus:outline-none focus:border-[#2c2c2c]/40 transition-colors"
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
                className="w-full px-4 py-3 text-lg font-serif bg-transparent border-b border-[#2c2c2c]/20 focus:outline-none focus:border-[#2c2c2c]/40 transition-colors"
              />
            </div>
          )}

          {message && (
            <div className="text-sm text-[#2c2c2c]/60 text-center">{message}</div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-sm bg-[#2c2c2c] text-white hover:bg-[#2c2c2c]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className="w-full px-6 py-3 text-sm text-[#2c2c2c]/60 hover:text-[#2c2c2c] transition-colors"
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
