import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      // Note: We need to use a server-side client for this
      // For now, redirect to home page which will handle auth client-side
      // The code in the URL will be picked up by the client's detectSessionInUrl option
      return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }
  }

  return NextResponse.redirect(new URL('/?error=no_code', request.url))
}
