'use client'
import { useEffect } from 'react'
export default function SignUpPage() {
  useEffect(() => {
    window.location.href = process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/gmail'
  }, [])
  return <div>Redirecting to Gmail...</div>
}
