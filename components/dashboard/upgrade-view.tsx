'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Check,
  X,
  ArrowLeft,
  Zap,
  Shield,
  Building2,
  Sparkles,
} from 'lucide-react'

interface UpgradeViewProps {
  currentPlan: string
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: Shield,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'For individuals getting started with email security',
    features: [
      '100 emails/day monitoring',
      'Basic AI threat detection',
      'WhatsApp alerts',
      'Dashboard notifications',
      'Gmail spam filter',
      'Email blocking + rescue',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'For professionals who need complete protection',
    popular: true,
    features: [
      'Unlimited email monitoring',
      'Advanced AI detection',
      'WhatsApp + Voice alerts',
      'Priority support',
      'API access',
      'Spam folder monitoring',
      'Email blocking + rescue',
      'Threat analytics',
      'Scan history',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    monthlyPrice: null,
    annualPrice: null,
    description: 'For teams and organizations at scale',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Multi-account support',
      'On-premise option',
      'Custom AI models',
      'Audit logs',
      'SSO / SAML',
    ],
  },
]

const COMPARISON_FEATURES = [
  { label: 'Email monitoring', free: '100/day', pro: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'AI threat detection', free: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
  { label: 'WhatsApp alerts', free: true, pro: true, enterprise: true },
  { label: 'Voice call alerts', free: false, pro: true, enterprise: true },
  { label: 'Spam folder monitoring', free: true, pro: true, enterprise: true },
  { label: 'Email blocking + rescue', free: true, pro: true, enterprise: true },
  { label: 'API access', free: false, pro: true, enterprise: true },
  { label: 'Priority support', free: false, pro: true, enterprise: true },
  { label: 'Dedicated support', free: false, pro: false, enterprise: true },
  { label: 'Custom integrations', free: false, pro: false, enterprise: true },
  { label: 'SLA guarantee', free: false, pro: false, enterprise: true },
  { label: 'On-premise option', free: false, pro: false, enterprise: true },
  { label: 'Multi-account support', free: false, pro: false, enterprise: true },
]

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <Check className="w-4 h-4 text-green-500 mx-auto" />
      : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
  }
  return <span className="text-sm text-foreground">{value}</span>
}

export function UpgradeView({ currentPlan }: UpgradeViewProps) {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  function handleProUpgrade() {
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? 'price_pro_monthly'
    const annualPriceId  = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID  ?? 'price_pro_annual'
    const priceId = billing === 'annual' ? annualPriceId : monthlyPriceId
    const price = billing === 'annual' ? 23 : 29
    router.push(`/dashboard/checkout?plan=${priceId}&name=Pro&price=${price}&billing=${billing}`)
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Button>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Pricing
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">Simple, transparent pricing. No hidden fees.</p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 mt-4 p-1 rounded-lg border border-border/50 bg-muted/30">
          <button
            onClick={() => setBilling('monthly')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              billing === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2',
              billing === 'annual'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Annual
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-500 font-semibold">
              −20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const PlanIcon = plan.icon
          const isCurrent = currentPlan === plan.id
          const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border p-6 transition-all',
                plan.popular
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border/50 bg-card/50',
                isCurrent && !plan.popular && 'border-green-500/40 bg-green-500/5'
              )}
            >
              {/* Badges */}
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </Badge>
              )}
              {isCurrent && (
                <Badge className="absolute -top-3 right-4 bg-green-600 text-white">
                  Current Plan
                </Badge>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                  plan.popular ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <PlanIcon className={cn('w-5 h-5', plan.popular ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-4">
                  {price === null ? (
                    <span className="text-3xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                      {billing === 'annual' && price > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Billed ${price * 12}/year
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn(
                      'w-4 h-4 mt-0.5 shrink-0',
                      plan.popular ? 'text-primary' : 'text-green-500'
                    )} />
                    <span className={feature === 'Everything in Pro' ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <Button disabled variant="outline" className="w-full opacity-60">
                  Current Plan
                </Button>
              ) : plan.id === 'pro' ? (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={handleProUpgrade}
                >
                  Upgrade to Pro
                </Button>
              ) : plan.id === 'enterprise' ? (
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <a href="mailto:shahsawar.codes@gmail.com?subject=JARVIS-X%20Enterprise%20Inquiry">
                    Contact Sales
                  </a>
                </Button>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border border-border/50 overflow-x-auto">
        <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
          <h2 className="font-semibold text-lg">Full Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground w-1/2">Feature</th>
                {PLANS.map(p => (
                  <th key={p.id} className={cn(
                    'px-4 py-3 text-sm font-semibold text-center w-1/6',
                    p.popular && 'text-primary'
                  )}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-border/30 last:border-0',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                  )}
                >
                  <td className="px-6 py-3 text-sm text-muted-foreground">{row.label}</td>
                  <td className="px-4 py-3 text-center"><FeatureCell value={row.free} /></td>
                  <td className="px-4 py-3 text-center"><FeatureCell value={row.pro} /></td>
                  <td className="px-4 py-3 text-center"><FeatureCell value={row.enterprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-muted-foreground">
        All plans include a 14-day free trial. No credit card required for Free plan.
      </p>
    </div>
  )
}
