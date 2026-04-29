import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 96,
          background: 'linear-gradient(145deg, #0ea5e9, #0369a1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Shield */}
        <svg width="380" height="400" viewBox="0 0 512 512" fill="none">
          <path
            d="M256 20L56 110V290C56 400 144 490 256 510C368 490 456 400 456 290V110L256 20Z"
            fill="rgba(255,255,255,0.25)"
          />
          <path
            d="M256 60L96 140V290C96 384 166 462 256 480C346 462 416 384 416 290V140L256 60Z"
            fill="white"
            opacity="0.95"
          />
          {/* Eye white */}
          <ellipse cx="256" cy="294" rx="100" ry="68" fill="#0369a1" />
          {/* Eye iris */}
          <circle cx="256" cy="294" r="48" fill="white" />
          {/* Pupil */}
          <circle cx="256" cy="294" r="26" fill="#0369a1" />
          {/* Shine */}
          <circle cx="274" cy="278" r="12" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
