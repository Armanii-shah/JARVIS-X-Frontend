import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Fix: Next.js was incorrectly picking /Users/apple/package-lock.json as the
    // workspace root, which caused NEXT_PUBLIC_* env vars to resolve as empty strings.
    // Pinning the root to this directory ensures env files are read from the right place.
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
