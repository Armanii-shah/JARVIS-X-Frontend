'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '@/components/CheckoutForm'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Zap,
  Check,
  Loader2,
  AlertCircle,
  Shield,
  RefreshCw,
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PRO_FEATURES = [
  'Unlimited email monitoring',
  'Advanced AI threat detection',
  'WhatsApp + Voice call alerts',
  'Priority support',
  'API access',
  'Spam folder monitoring',
  'Email blocking & rescue',
  'Threat analytics & scan history',
]

export function CheckoutClient({ token }: { token: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const planId = searchParams.get('plan')
  const planName = searchParams.get('name') ?? 'Pro'
  const planPrice = Number(searchParams.get('price') ?? 29)
  const billing = searchParams.get('billing') ?? 'monthly'

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!planId) {
      router.replace('/dashboard/upgrade')
      return
    }
    createSubscription()
  }, [planId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function createSubscription() {
    setIsCreating(true)
    setError(null)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
      const res = await fetch(`${backendUrl}/api/payment/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? `Request failed (${res.status})`)
      }

      const data = await res.json()
      if (!data.clientSecret) throw new Error('No client secret returned from server.')
      setClientSecret(data.clientSecret)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout.')
    } finally {
      setIsCreating(false)
    }
  }

  const elementsOptions = {
    clientSecret: clientSecret ?? undefined,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#14b8a6',
        colorBackground: '#ffffff',
        borderRadius: '8px',
        fontFamily: 'inherit',
      },
    },
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => router.push('/dashboard/upgrade')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Complete Your Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          You&apos;re one step away from upgrading to {planName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

        {/* LEFT — Order Summary */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="font-semibold text-base">{planName} Plan</p>
                <p className="text-xs text-muted-foreground capitalize">{billing} billing</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-teal-500" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/40" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{planName} ({billing})</span>
                <span>${planPrice}/mo</span>
              </div>
              {billing === 'annual' && (
                <div className="flex justify-between text-green-500 text-xs">
                  <span>Annual discount (−20%)</span>
                  <span>−${Math.round(planPrice * 0.25)}/mo</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-border/40">
                <span>Total</span>
                <span>
                  ${billing === 'annual' ? planPrice * 12 : planPrice}
                  {billing === 'annual' ? '/yr' : '/mo'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-teal-500 shrink-0" />
            Cancel anytime. No hidden fees. Refund within 7 days if unsatisfied.
          </div>
        </div>

        {/* RIGHT — Payment Form */}
        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6">
          <h2 className="font-semibold mb-6">Payment Details</h2>

          {isCreating && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <p className="text-sm">Preparing checkout…</p>
            </div>
          )}

          {error && !isCreating && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={createSubscription}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {!isCreating && !error && clientSecret && (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm planName={planName} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
