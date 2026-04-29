'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Shield,
  Mail,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Brain,
  Phone,
  Bell,
  Ban,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Users,
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#testimonials' },
]

const features = [
  {
    icon: Brain,
    title: 'AI Risk Scoring',
    description: 'Every email is assigned a 0–100 risk score by our ML model, detecting phishing patterns humans miss.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Phone,
    title: 'WhatsApp Alerts',
    description: 'Instant WhatsApp messages the moment a high-risk email lands in your inbox — no app needed.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Bell,
    title: 'Voice Call Alerts',
    description: 'For critical threats, JARVIS-X calls your phone with an automated voice alert so you never miss it.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Mail,
    title: 'Gmail Integration',
    description: 'Connect your Gmail in seconds via secure OAuth. No password needed, revoke access anytime.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Spam Monitoring',
    description: 'Continuous 30-second polling catches threats the moment they arrive, even in spam folders.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Ban,
    title: 'Email Blocking',
    description: 'Block specific senders permanently. Blocked emails are auto-scored 100 and trigger instant alerts.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
]

const steps = [
  {
    number: '01',
    icon: Mail,
    title: 'Connect Your Gmail',
    description: 'Click "Connect Gmail" and authorize JARVIS-X via Google OAuth. Takes less than 30 seconds. We never store your password.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Scans Every Email',
    description: 'Our AI engine analyzes subject lines, sender reputation, link patterns, and body content every 30 seconds automatically.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Get Instant Alerts',
    description: 'When a threat is detected, you receive a WhatsApp message and/or voice call within seconds — before you even open the email.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for personal use and trying out JARVIS-X.',
    features: [
      '100 emails scanned/day',
      'Basic AI risk scoring',
      'WhatsApp alerts',
      'Email dashboard',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/auth/login',
    featured: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Full protection for power users and professionals.',
    features: [
      'Unlimited email scanning',
      'Advanced AI + threat intelligence',
      'WhatsApp + Voice call alerts',
      'Sender blocking',
      'Detailed threat analytics',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    href: '/dashboard/upgrade',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored for teams and organizations at scale.',
    features: [
      'Multi-account management',
      'Custom AI model tuning',
      'SLA guarantee (99.9% uptime)',
      'Dedicated account manager',
      'Custom integrations & API',
      'Compliance reporting',
    ],
    cta: 'Contact Sales',
    href: 'mailto:contact@jarvisxsecurity.com',
    featured: false,
    badge: null,
  },
]

const testimonials = [
  {
    quote: 'JARVIS-X ne meri company ka ek phishing attack pakra jo bilkul real laga. WhatsApp pe alert aya aur hum ne immediately action liya. Bahut kamal ka tool hai.',
    author: 'Ahmed Raza',
    role: 'IT Manager, Karachi',
    rating: 5,
    avatar: 'AR',
  },
  {
    quote: 'Pehle roz 2-3 phishing emails miss ho jati thin. Ab JARVIS-X ka AI sab kuch pakad leta hai aur WhatsApp pe turant bata deta hai. Mera inbox finally secure feel hota hai.',
    author: 'Sara Malik',
    role: 'Freelance Developer, Lahore',
    rating: 5,
    avatar: 'SM',
  },
  {
    quote: 'Voice call feature ne mujhe ek baar chhuti ke dauran bachaya. Email check nahi kar raha tha lekin JARVIS-X ne call kiya aur maine turant react kiya. Absolutely brilliant.',
    author: 'Usman Tariq',
    role: 'Entrepreneur, Islamabad',
    rating: 5,
    avatar: 'UT',
  },
]

const stats = [
  { value: '500+', label: 'Emails Scanned', icon: Mail },
  { value: '47', label: 'Threats Blocked', icon: Shield },
  { value: '4', label: 'Users Protected', icon: Users },
  { value: '30s', label: 'Scan Interval', icon: Zap },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo href="/" size="lg" />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0" asChild>
                <Link href="/auth/login">
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 bg-background px-4 py-4 space-y-3">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-border/50">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0" asChild>
                <Link href="/auth/login">Get Started Free</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">

            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5 inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-Powered • Real-Time • Free to Start
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              AI-Powered Email Security
              <br />
              <span className="text-primary">That Protects You in Real Time</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              JARVIS-X scans your Gmail with advanced AI, detects phishing threats instantly,
              and alerts you via <strong className="text-foreground">WhatsApp</strong> and{' '}
              <strong className="text-foreground">voice calls</strong> — before you open the email.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="text-base px-8 bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-12"
                asChild
              >
                <Link href="/auth/login">
                  Connect Gmail Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <a href="#how-it-works">
                  See How It Works
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground mb-16">
              {[
                'No credit card required',
                'Setup in under 60 seconds',
                'Cancel anytime',
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>

            {/* Dashboard mockup */}
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden">
              {/* Mockup titlebar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground">JARVIS-X Dashboard</span>
              </div>
              {/* Mockup body */}
              <div className="p-6 grid grid-cols-3 gap-4 bg-card/80">
                {[
                  { label: 'Emails Scanned', value: '128', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Threats Detected', value: '7', color: 'text-red-500', bg: 'bg-red-500/10' },
                  { label: 'Safe Emails', value: '121', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-4 ${s.bg} border border-border/40`}>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
                {/* Fake email rows */}
                <div className="col-span-3 space-y-2 mt-2">
                  {[
                    { subject: 'URGENT: Your account has been suspended', score: 94, level: 'HIGH', color: 'bg-red-500' },
                    { subject: 'Your PayPal payment failed - verify now', score: 87, level: 'HIGH', color: 'bg-red-500' },
                    { subject: 'Invoice #4821 from Design Studio', score: 12, level: 'SAFE', color: 'bg-emerald-500' },
                  ].map((row) => (
                    <div
                      key={row.subject}
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.color}`} />
                        <span className="text-sm truncate text-foreground/80">{row.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-xs font-mono text-muted-foreground">{row.score}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          row.level === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {row.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Stay Protected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete email security stack — AI detection, instant multi-channel alerts, and full inbox control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get Protected in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              No complex setup. No IT knowledge required. Start protecting your inbox in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-14 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-border/0 via-border to-border/0" />

            {steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className={`relative w-16 h-16 rounded-2xl ${step.bg} border-2 ${step.border} flex items-center justify-center mb-6 z-10`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-200 ${
                  plan.featured
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]'
                    : 'border-border/60 bg-card hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.featured
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : ''
                  }`}
                  variant={plan.featured ? 'default' : 'outline'}
                  asChild
                >
                  {plan.href.startsWith('mailto:') ? (
                    <a href={plan.href}>{plan.cta}</a>
                  ) : (
                    <Link href={plan.href}>{plan.cta}</Link>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20 lg:py-28 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Security-Conscious Users
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Real users, real protection, real peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border/50 bg-card flex flex-col gap-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-10 lg:p-16 overflow-hidden text-center">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Start Protecting Your Inbox Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who trust JARVIS-X to guard their Gmail against phishing,
                scams, and cyber threats — completely free to start.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  asChild
                >
                  <Link href="/auth/login">
                    Connect Gmail for Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                No credit card • No password stored • Revoke access anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-12 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo href="/" size="lg" />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                AI-powered email security that protects you in real time. Detect threats before you open them.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {[
                  { icon: Mail, label: 'Email' },
                  { icon: Shield, label: 'Security' },
                  { icon: Phone, label: 'WhatsApp' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Dashboard', href: '/auth/login' },
                  { label: 'How It Works', href: '#how-it-works' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-foreground transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal & Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Support', href: '/contact' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-foreground transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© 2026 JARVIS-X Security. All rights reserved.</p>

            <p>
              Built with{' '}
              <span className="text-primary">♥</span>{' '}
              to stop phishing attacks
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
