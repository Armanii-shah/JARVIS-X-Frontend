'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, CreditCard, Check, Loader2, CheckCircle } from 'lucide-react'

interface SettingsViewProps {
  email: string
  phone: string | null
  plan: string
  token: string
  backendUrl: string
}

export function SettingsView({ email, phone, plan, token, backendUrl }: SettingsViewProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [phoneValue, setPhoneValue] = useState(phone ?? '')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const res = await fetch(`${backendUrl}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneValue }),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setSaveError(err.message ?? 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['10 emails/day', 'Basic threat detection', 'Dashboard alerts', 'Email support'],
      current: !plan || plan === 'free',
    },
    {
      name: 'Pro',
      price: '$20',
      features: ['100 emails/day', 'Advanced AI detection', 'SMS & Push alerts', 'Priority support', 'API access'],
      current: plan === 'pro',
      popular: true,
      
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited emails','Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
      current: plan === 'enterprise',
    },
  ]

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile" className="gap-2">
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="billing" className="gap-2">
          <CreditCard className="w-4 h-4" />
          Billing
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="bg-input/50"
                  disabled
                  readOnly
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneValue}
                  onChange={e => {
                    setPhoneValue(e.target.value.replace(/\D/g, ''))
                    setSaveError(null)
                    setSaveSuccess(false)
                  }}
                  placeholder="923001234567"
                  maxLength={15}
                  className="bg-input/50"
                />
                <p className="text-xs text-muted-foreground">
                  Used for WhatsApp security alerts — format: country code + number (e.g. 923001234567)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              {saveError && (
                <p className="text-sm text-destructive">{saveError}</p>
              )}
              {saveSuccess && (
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully
                </p>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing Tab */}
      <TabsContent value="billing">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the <span className="capitalize font-medium text-foreground">{plan || 'Free'}</span> plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`relative p-6 rounded-lg border ${
                    p.current
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 opacity-60'
                  } transition-colors`}
                >
                  {p.popular && (
                    <Badge className="absolute -top-2 right-4 bg-primary">Popular</Badge>
                  )}
                  {p.current && (
                    <Badge className="absolute -top-2 left-4 bg-green-600">Current</Badge>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-2xl font-bold mt-1">
                      {p.price}
                      {p.price !== 'Custom' && (
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      )}
                    </p>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {p.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {p.name === 'Pro' && !p.current && (
                    <Button className="w-full" onClick={() => router.push('/dashboard/upgrade')}>
                      Upgrade to Pro
                    </Button>
                  )}
                  {p.name === 'Enterprise' && !p.current && (
                    <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/upgrade')}>
                      Contact Sales
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              To upgrade your plan, contact support.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
