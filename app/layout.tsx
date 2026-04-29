import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'JARVIS-X | AI-Powered Email Security',
  description: 'Advanced AI-powered email security platform. Detect phishing threats, monitor suspicious emails, and protect your organization with real-time threat intelligence.',
  generator: 'v0.app',
  keywords: ['email security', 'phishing detection', 'AI security', 'threat monitoring', 'cybersecurity'],
  authors: [{ name: 'JARVIS-X Security' }],
  icons: {
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="jarvis-theme">
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
