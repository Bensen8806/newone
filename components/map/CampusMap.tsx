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
    const constVenue = VENUES.find(v => v.svgId === svgId)
    if (!constVenue) return { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.1)', sw: 1 }

    const dbVenue = venues.find(v => v.svg_element_id === svgId)
    const status = hasChecked && dbVenue ? availability[dbVenue.id] : undefined

    switch (status) {
      case 'AVAILABLE': return { fill: 'rgba(22,163,74,0.05)', stroke: 'rgba(22,163,74,0.4)', sw: 1, dot: '#16a34a' }
      case 'PENDING': return { fill: 'rgba(217,119,6,0.05)', stroke: 'rgba(217,119,6,0.4)', sw: 1, dot: '#d97706' }
      case 'BOOKED': return { fill: 'rgba(220,38,38,0.05)', stroke: 'rgba(220,38,38,0.4)', sw: 1, dot: '#dc2626' }
      default: return { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.1)', sw: 1, dot: 'transparent' }
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
        className="fixed z-50 bg-[#111] text-white px-3 py-2 rounded-md text-xs shadow-2xl border border-white/10 animate-in fade-in-0 zoom-in-95 pointer-events-none max-w-[230px]"
        style={{ left: Math.min(tooltip.x, typeof window !== 'undefined' ? window.innerWidth - 240 : tooltip.x), top: tooltip.y }}
      >
        <div className="font-semibold mb-1">{dbVenue?.name || vConst?.name}</div>
        <div className="text-[10px] text-white/50 mb-1.5 uppercase tracking-wider">{dept?.name || vConst?.dept}</div>
        <div className="text-[10px] text-white/70">Capacity: {dbVenue?.capacity || vConst?.capacity}</div>
        <div className="text-[10px] mt-2 text-white/40 pt-2 border-t border-white/5">{st}</div>
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
          const deptConst = DEPARTMENTS.find(d => d.code === b.dept)
          return (
            <g key={b.dept}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <text x={b.lx} y={b.ly} textAnchor="middle" fontFamily="var(--font-inter)" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.2)" letterSpacing="1.5">
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
          const stroke = sel ? '#ffffff' : sty.stroke
          const sw = sel ? 1.5 : sty.sw
          const dotR = 3
          const dotX = l.x + l.w - dotR - 6
          const dotY = l.y + dotR + 6
          
          return (
            <g 
              key={svgId} 
              className="group cursor-pointer transition-all hover:brightness-125"
              onClick={() => onVenueClick(svgId)}
              onMouseEnter={(e) => handleMouseEnter(e, svgId)}
              onMouseLeave={handleMouseLeave}
            >
              <rect 
                x={l.x} y={l.y} width={l.w} height={l.h} rx="4" 
                fill={sty.fill} stroke={stroke} strokeWidth={sw} 
                className="transition-all duration-200"
              />
              <text 
                x={l.x + l.w / 2} y={l.y + l.h / 2 + 3} 
                textAnchor="middle" fontFamily="var(--font-inter)" fontWeight="500" fontSize={l.h < 45 ? 9 : l.w < 160 ? 10 : 11} 
                fill="#ececec" style={{ pointerEvents: 'none' }}
              >
                {dbVenue?.name || vConst.name}
              </text>
              {sty.dot !== 'transparent' && (
                <circle cx={dotX} cy={dotY} r={dotR} fill={sty.dot} style={{ pointerEvents: 'none' }}/>
              )}
            </g>
          )
        })}
        
        {/* Map Label */}
        <text x="500" y="680" textAnchor="middle" fontFamily="var(--font-inter)" fontSize="8" fill="rgba(255,255,255,0.2)" fontWeight="500" letterSpacing="2">NSS COLLEGE OF ENGINEERING, PALAKKAD</text>
      </svg>
    </div>
  )
}
