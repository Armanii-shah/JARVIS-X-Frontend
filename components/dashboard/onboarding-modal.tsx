'use client'

import { useState } from 'react'
import { Shield, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OnboardingModalProps {
  token: string
  backendUrl: string
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function OnboardingModal({ token, backendUrl }: OnboardingModalProps) {
  const [visible, setVisible] = useState(true)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!visible) return null

  const dismiss = () => {
    setCookie('jarvis_onboarded', 'true', 60 * 60 * 24 * 365)
    setVisible(false)
  }

  const validate = (value: string) => {
    if (!value.startsWith('92')) return 'Number must start with 92'
    if (value.length !== 12) return 'Number must be exactly 12 digits'
    if (!/^\d+$/.test(value)) return 'Numbers only'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate(phone)
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? 'Failed to save. Try again.')
        return
      }
      dismiss()
    } catch {
      setError('Network error. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">One Last Step!</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Add your WhatsApp number to receive real-time security alerts when threats are detected.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              WhatsApp Number
            </label>
            <Input
              type="tel"
              placeholder="923XXXXXXXXXX"
              value={phone}
              onChange={e => {
                setPhone(e.target.value.replace(/\D/g, ''))
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              maxLength={12}
              className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={loading}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: 92 followed by 10 digits &mdash; e.g.&nbsp;923001234567
            </p>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>

        </div>
      </div>
    </div>
  )
}
