import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { CheckoutClient } from './CheckoutClient'

export default async function CheckoutPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value ?? ''

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
          <span className="text-sm">Loading checkout…</span>
        </div>
      }
    >
      <CheckoutClient token={token} />
    </Suspense>
  )
}
