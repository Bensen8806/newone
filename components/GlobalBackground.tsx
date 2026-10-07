'use client'

import { usePathname } from 'next/navigation'
import DotField from './DotField'

export default function GlobalBackground() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(255, 120, 80, 0.45)" // Brand colors: Lighter Orange/Red
        gradientTo="rgba(255, 255, 255, 0.25)" // White
        glowColor="rgba(255, 100, 50, 0.6)" // Lighter orange glow
      />
    </div>
  )
}
