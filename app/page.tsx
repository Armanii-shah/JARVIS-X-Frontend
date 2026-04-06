import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Mail,
  AlertTriangle,
  Zap,
  Lock,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'AI-Powered Detection',
    description: 'Advanced machine learning algorithms analyze every email for phishing attempts, malware, and suspicious content in real-time.',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Intelligence',
    description: 'Access to global threat databases and real-time updates on emerging phishing campaigns and attack vectors.',
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Get notified immediately via email, SMS, or push notifications when critical threats are detected.',
  },
  {
    icon: Lock,
    title: 'Zero Trust Security',
    description: 'Every email is treated as potentially malicious until verified safe, ensuring maximum protection.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Comprehensive dashboards and reports to track your security posture and identify trends.',
  },
  {
    icon: Mail,
    title: 'Email Protection',
    description: 'Seamless integration with Gmail, Outlook, and Yahoo for complete email security coverage.',
  },
]

const stats = [
  { value: '99.9%', label: 'Threat Detection Rate' },
  { value: '2.8M+', label: 'Emails Protected Daily' },
  { value: '<50ms', label: 'Average Scan Time' },
  { value: '15K+', label: 'Active Users' },
]

const testimonials = [
  {
    quote: "JARVIS-X has completely transformed our email security. We've blocked over 500 phishing attempts in just the first month.",
    author: 'Sarah Chen',
    role: 'CISO, TechCorp Inc.',
    rating: 5,
  },
  {
    quote: "The AI detection is incredibly accurate. False positives are rare, and the dashboard makes monitoring effortless.",
    author: 'Michael Torres',
    role: 'IT Director, GlobalBank',
    rating: 5,
  },
  {
    quote: "Finally, an email security solution that actually works. The real-time alerts have saved us multiple times.",
    author: 'Emily Watson',
    role: 'Security Lead, StartupXYZ',
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-cyan">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary">JARVIS</span>
                <span className="text-foreground">-X</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/gmail`}>Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
              <Zap className="w-3 h-3 mr-2 text-primary" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              AI-Powered Email Security for the{' '}
              <span className="text-primary">Modern Enterprise</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
              Protect your organization from phishing attacks, malware, and email-based threats with real-time AI detection and instant alerts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/gmail`}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link href="/dashboard">
                  View Demo Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              Enterprise-Grade Email Security
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive protection against all types of email-based threats with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-cyan transition-all">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-card/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              Trusted by Security Teams Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what security professionals are saying about JARVIS-X.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border/50 bg-background"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">{`"${testimonial.quote}"`}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-8 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
                Start Protecting Your Emails Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of organizations using JARVIS-X to defend against email-based threats. Get started with a free 14-day trial.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8" asChild>
                  <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/gmail`}>
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8" asChild>
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold">
                <span className="text-primary">JARVIS</span>
                <span className="text-foreground">-X</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 JARVIS-X. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
