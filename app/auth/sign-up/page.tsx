'use client'
import { useEffect } from 'react'
export default function SignUpPage() {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) {
      console.error('[Auth] NEXT_PUBLIC_BACKEND_URL is not set — cannot redirect to Gmail OAuth')
      return
    }
    window.location.href = backendUrl + '/auth/gmail'
  }, [])
  return <div>Redirecting to Gmail...</div>
}
