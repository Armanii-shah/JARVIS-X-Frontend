import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-xl bg-green-500/10 flex items-center justify-center glow-green">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Account Created!
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Your JARVIS-X security account is ready
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Check your email
              </p>
              <p className="text-sm text-muted-foreground">
                {"We've sent you a confirmation link. Please verify your email address to access all features."}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/auth/login">
                <Shield className="w-4 h-4 mr-2" />
                Go to Login
              </Link>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              {"Didn't receive the email?"}{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
