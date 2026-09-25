'use client'

import { useState, useRef } from 'react'
import { LAYOUT, DC } from '@/lib/constants/map-layout'
import { Venue } from '@/lib/types'
import { AvailabilityState } from '@/app/map/page'
import { VENUES } from '@/lib/constants/venues'
import { DEPARTMENTS } from '@/lib/constants/departments'

interface CampusMapProps {
  venues: Venue[]
  availability: AvailabilityState
  selectedVenueId: string | null
  onVenueClick: (svgId: string) => void
  hasChecked: boolean
}

export default function CampusMap({
  venues,
  availability,
  selectedVenueId,
  onVenueClick,
  hasChecked
}: CampusMapProps) {
  const [tooltip, setTooltip] = useState<{
    show: boolean
    x: number
    y: number
    svgId: string | null
  }>({ show: false, x: 0, y: 0, svgId: null })
  
  const mapRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.show) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX + 14,
        y: e.clientY - 10
      }))
    }
  }

  const handleMouseEnter = (e: React.MouseEvent, svgId: string) => {
    setTooltip({
      show: true,
      x: e.clientX + 14,
      y: e.clientY - 10,
      svgId
    })
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }))
  }

  const getStyle = (svgId: string) => {
    // Find the db venue ID from our local constants since we need it to look up availability
    const constVenue = VENUES.find(v => v.svgId === svgId)
    if (!constVenue) return { fill: 'rgba(63,63,70,0.4)', stroke: '#3f3f46', sw: 1 }

    // Use DB venue id to check availability map. If venues haven't loaded yet, default to pending/avail?
    // We map svgId -> dbId using the venues prop.
    const dbVenue = venues.find(v => v.svg_element_id === svgId)
    const status = hasChecked && dbVenue ? availability[dbVenue.id] : undefined

    switch (status) {
      case 'AVAILABLE': return { fill: 'rgba(22,163,74,0.12)', stroke: '#16a34a', sw: 1.5, dot: '#16a34a' }
      case 'PENDING': return { fill: 'rgba(217,119,6,0.12)', stroke: '#d97706', sw: 1.5, dot: '#d97706' }
      case 'BOOKED': return { fill: 'rgba(220,38,38,0.12)', stroke: '#dc2626', sw: 1.5, dot: '#dc2626' }
      default: return { fill: 'rgba(63,63,70,0.4)', stroke: '#3f3f46', sw: 1, dot: '#52525b' }
    }
  }

  // Render tooltip content
  let tooltipContent = null
  if (tooltip.show && tooltip.svgId) {
    const vConst = VENUES.find(v => v.svgId === tooltip.svgId)
    const dbVenue = venues.find(v => v.svg_element_id === tooltip.svgId)
    const dept = DEPARTMENTS.find(d => d.code === vConst?.dept)
    
    let st = 'Select a time range to check'
    if (hasChecked && dbVenue) {
      const status = availability[dbVenue.id]
      st = status === 'AVAILABLE' ? 'Available' : status === 'PENDING' ? 'Pending Request' : 'Booked'
    }

    tooltipContent = (
      <div 
        className="fixed z-50 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-sm shadow-md border animate-in fade-in-0 zoom-in-95 pointer-events-none max-w-[230px]"
        style={{ left: Math.min(tooltip.x, typeof window !== 'undefined' ? window.innerWidth - 240 : tooltip.x), top: tooltip.y }}
      >
        <div className="font-bold text-[13px] mb-0.5">{dbVenue?.name || vConst?.name}</div>
        <div className="text-[11px] text-muted-foreground mb-1">{dept?.name || vConst?.dept}</div>
        <div className="text-xs text-accent">Capacity: {dbVenue?.capacity || vConst?.capacity}</div>
        <div className="text-[11px] mt-1 text-muted-foreground">{st}</div>
      </div>
    )
  }

  return (
    <div 
      className="w-full h-full max-w-6xl mx-auto flex items-center justify-center cursor-pointer"
      ref={mapRef}
      onMouseMove={handleMouseMove}
    >
      {tooltipContent}
      <svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="1000" height="700" fill="#000000" rx="0"/>
        {/* Departments */}
        {LAYOUT.depts.map(b => {
          const dc = DC[b.dept as keyof typeof DC]
          const deptConst = DEPARTMENTS.find(d => d.code === b.dept)
          return (
            <g key={b.dept}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill={dc.bg} stroke={dc.st} strokeWidth="1.5"/>
              <text x={b.lx} y={b.ly} textAnchor="middle" fontFamily="var(--font-poppins)" fontSize="10" fontWeight="700" fill="rgba(161,161,170,.5)" letterSpacing="1.5">
                {deptConst?.name.toUpperCase() || b.dept}
              </text>
            </g>
          )
        })}

        {/* Venues */}
        {Object.entries(LAYOUT.venues).map(([svgId, l]) => {
          const vConst = VENUES.find(v => v.svgId === svgId)
          if (!vConst) return null

          const dbVenue = venues.find(v => v.svg_element_id === svgId)
          const sel = dbVenue && dbVenue.id === selectedVenueId
          
          const sty = getStyle(svgId)
          const stroke = sel ? '#fafafa' : sty.stroke
          const sw = sel ? 2.5 : sty.sw
          const dotR = 4
          const dotX = l.x + l.w - dotR - 5
          const dotY = l.y + dotR + 5
          
          return (
            <g 
              key={svgId} 
              className="group cursor-pointer transition-all hover:brightness-125"
              onClick={() => onVenueClick(svgId)}
              onMouseEnter={(e) => handleMouseEnter(e, svgId)}
              onMouseLeave={handleMouseLeave}
            >
              <rect 
                x={l.x} y={l.y} width={l.w} height={l.h} rx="7" 
                fill={sty.fill} stroke={stroke} strokeWidth={sw} 
                className="transition-all duration-200"
              />
              <text 
                x={l.x + l.w / 2} y={l.y + l.h / 2 + 4} 
                textAnchor="middle" fontFamily="var(--font-inter)" fontWeight="600" fontSize={l.h < 45 ? 9 : l.w < 160 ? 10 : 11} 
                fill="#fafafa" style={{ pointerEvents: 'none' }}
              >
                {dbVenue?.name || vConst.name}
              </text>
              <circle cx={dotX} cy={dotY} r={dotR} fill={sty.dot} style={{ pointerEvents: 'none' }}/>
            </g>
          )
        })}
        
        {/* Map Label */}
        <text x="500" y="680" textAnchor="middle" fontFamily="var(--font-poppins)" fontSize="9" fill="rgba(63,63,70,0.5)" fontWeight="700" letterSpacing="3">NSS COLLEGE OF ENGINEERING, PALAKKAD</text>
      </svg>
    </div>
  )
}
