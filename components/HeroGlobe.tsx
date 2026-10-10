"use client"
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SystemArchitecture from './SystemArchitecture'

// Use motion() wrapper for SVG filter element
const MotionFeDisplacementMap = motion('feDisplacementMap')

export default function HeroGlobe() {
  const { scrollY } = useScroll()
  
  // Fade out logo within the first 400px of scrolling
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 1.2])
  
  // Drives the physical shattering of the logo pixels
  const scatterAmount = useTransform(scrollY, [0, 400], [0, 150])
  
  // Turn off display completely when faded out to save massive CPU/GPU
  const display = useTransform(scrollY, [0, 400, 401], ['flex', 'flex', 'none'])

  return (
    <div className="relative w-full bg-transparent text-white overflow-x-hidden h-screen flex flex-col items-center justify-center">
      
      {/* 1200vh Background Animation Component */}
      <SystemArchitecture />

      {/* SVG Shatter/Scatter Filter */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="scatter-filter">
          {/* Base frequency controls the size of the scattered pieces */}
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" in="noise" result="sharpNoise" />
          <MotionFeDisplacementMap 
            in="SourceGraphic" 
            in2="sharpNoise" 
            scale={scatterAmount} 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>

      {/* Hero Content Overlay that fades on scroll */}
      <motion.div 
        style={{ display }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Radial gradient mask to hide gears directly behind the logo */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,4,6,1)_10%,transparent_40%)] pointer-events-none -z-10" 
        />

        <motion.img 
          src="/disha-transparent.png" 
          alt="Disha Logo" 
          style={{ 
            opacity: opacity,
            scale: scale,
            filter: 'url(#scatter-filter)'
          }}
          className="w-64 md:w-96 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-16 relative z-10"
        />

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-slate-300 drop-shadow-md">
            Scroll Down
          </span>
          <div className="w-[1px] h-10 bg-[#ff2a00]/30 relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-[#ff2a00]"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}




