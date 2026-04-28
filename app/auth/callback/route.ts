import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', request.url))
  }

  // Exchange the one-time code for the JWT server-side.
  // The code is opaque (a UUID), so nothing sensitive is in the URL.
  let token: string
  let email: string
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (!res.ok) throw new Error('exchange failed')
    const data = await res.json()
    token = data.token
    email = data.email
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=authentication_failed', request.url))
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url))

  response.cookies.set('jarvis_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  response.cookies.set('jarvis_user', email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
