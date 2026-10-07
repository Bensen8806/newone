"use client"

import dynamic from 'next/dynamic'

const InteractiveGlobeReact = dynamic(() => import('@/components/ui/interactive-globe-react'), { ssr: false })

export default function GlobeDemo() {
  return (
    <div className="w-full min-h-screen bg-transparent flex items-center justify-center">
      <InteractiveGlobeReact className="w-full max-w-4xl" />
    </div>
  )
}
