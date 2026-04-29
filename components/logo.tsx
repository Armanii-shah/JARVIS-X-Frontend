import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  subtitle?: string
}

const sizes = {
  sm: { container: 'w-7 h-7', rounded: 'rounded-lg', title: 'text-[13px]', sub: 'text-[9px]' },
  md: { container: 'w-8 h-8', rounded: 'rounded-xl', title: 'text-[15px]', sub: 'text-[9px]' },
  lg: { container: 'w-9 h-9', rounded: 'rounded-2xl', title: 'text-[17px]', sub: 'text-[10px]' },
}

export function Logo({ href = '/', size = 'md', subtitle = 'Security' }: LogoProps) {
  const s = sizes[size]

  const inner = (
    <span className="flex items-center gap-2.5 group">
      <span className={`${s.container} ${s.rounded} overflow-hidden flex-shrink-0 ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all bg-[#0d1b2e] inline-flex`}>
        <Image
          src="/logo.png"
          alt="JARVIS-X"
          width={20}
          height={20}
          className="w-full h-full object-cover object-center scale-[2.2] -translate-y-[-4px]"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`${s.title} font-bold tracking-wide`}>
          <span className="text-primary">JARVIS</span>
          <span className="text-foreground">-X</span>
        </span>
        {subtitle && (
          <span className={`${s.sub} text-muted-foreground tracking-widest uppercase font-medium`}>
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )

  return <Link href={href}>{inner}</Link>
}
