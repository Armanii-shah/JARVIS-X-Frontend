'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'contact@jarvisxsecurity.com',
    detail: 'We reply within 24 hours',
    href: 'mailto:contact@jarvisxsecurity.com',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp Support',
    value: '+92 326 552 1790',
    detail: 'Available Mon–Fri, 9am–6pm PKT',
    href: 'https://wa.me/923265521790',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Under 24 hours',
    detail: 'Typically much faster',
    href: null,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
]

const topics = [
  'General Inquiry',
  'Technical Support',
  'Billing & Subscriptions',
  'Bug Report',
  'Feature Request',
  'Enterprise Sales',
  'Privacy & Data',
  'Other',
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setFormState('loading')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send')
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo href="/" size="md" />
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Page heading */}
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a question, found a bug, or want to discuss enterprise plans? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left: contact info + FAQ ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact cards */}
            {contactInfo.map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{c.label}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{c.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{c.detail}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick links */}
            <div className="p-5 rounded-xl border border-border/50 bg-card">
              <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Documentation', href: '#' },
                  { label: 'Report a Bug', href: 'mailto:contact@jarvisxsecurity.com?subject=Bug Report' },
                  { label: 'Feature Request', href: 'mailto:contact@jarvisxsecurity.com?subject=Feature Request' },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Note */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 text-sm text-amber-700 dark:text-amber-400">
              <p className="font-semibold mb-1">Security Issue?</p>
              <p className="leading-relaxed">
                If you&apos;ve found a security vulnerability, please email us directly at{' '}
                <a
                  href="mailto:contact@jarvisxsecurity.com?subject=Security Vulnerability"
                  className="underline"
                >
                  contact@jarvisxsecurity.com
                </a>{' '}
                with the subject line &quot;Security Vulnerability&quot;. Do not post it publicly.
              </p>
            </div>
          </div>

          {/* ── Right: contact form ───────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/60 bg-card p-8">

              {formState === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Message Sent!</h2>
                  <p className="text-muted-foreground max-w-sm">
                    Thanks for reaching out. We&apos;ll get back to you at{' '}
                    <strong className="text-foreground">{form.email}</strong> within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setFormState('idle')
                      setForm({ name: '', email: '', topic: '', message: '' })
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Ahmad Raza"
                          value={form.name}
                          onChange={handleChange}
                          required
                          disabled={formState === 'loading'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={formState === 'loading'}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <select
                        id="topic"
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                        disabled={formState === 'loading'}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring text-foreground disabled:opacity-50"
                      >
                        <option value="">Select a topic...</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        value={form.message}
                        onChange={handleChange}
                        required
                        disabled={formState === 'loading'}
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {form.message.length} / 1000 characters
                      </p>
                    </div>

                    {formState === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        Something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                      disabled={formState === 'loading' || !form.name || !form.email || !form.message}
                    >
                      {formState === 'loading' ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting this form you agree to our{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" subtitle="" />
            <span>© 2026 JARVIS-X Security</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
