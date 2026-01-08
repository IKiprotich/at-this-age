'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    // Suppress storage access errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Access to storage is not allowed')) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Access to storage is not allowed')) {
        event.preventDefault()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
