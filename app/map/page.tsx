'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import CampusMap from '@/components/map/CampusMap'
import MapSidebar from '@/components/map/MapSidebar'
import VenuePanel from '@/components/map/VenuePanel'
import { VenueWithDept } from '@/lib/types'

export type AvailabilityState = Record<string, 'AVAILABLE' | 'PENDING' | 'BOOKED'>

export default function MapPage() {
  const [venues, setVenues] = useState<VenueWithDept[]>([])
  const [availability, setAvailability] = useState<AvailabilityState>({})
  const [selectedVenue, setSelectedVenue] = useState<VenueWithDept | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  
  // Sidebar state
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    async function loadVenues() {
      const supabase = createClient()
      const { data } = await supabase.from('venues').select('*, departments(name, hod_user_id)')
      if (data) setVenues(data as VenueWithDept[])
    }
    loadVenues()
  }, [])

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate || !startTime || !endTime) return
    setIsChecking(true)
    
    // Create ISO strings
    const startStr = startDate.toISOString().split('T')[0]
    const endStr = endDate.toISOString().split('T')[0]
    const startIso = new Date(`${startStr}T${startTime}:00`).toISOString()
    const endIso = new Date(`${endStr}T${endTime}:00`).toISOString()

    const supabase = createClient()
    const { data: overlappingEvents } = await supabase
      .from('events')
      .select('venue_id, status')
      .lt('start_time', endIso)
      .gt('end_time', startIso)

    // Check overlaps
    const newAvail: AvailabilityState = {}
    
    // Initialize all to AVAILABLE
    venues.forEach(v => {
      newAvail[v.id] = 'AVAILABLE'
    })

    if (overlappingEvents) {
      overlappingEvents.forEach((event: { venue_id: string | null; status: string | null }) => {
        if (!event.venue_id) return
        
        const pendingStatuses = ['PENDING_FACULTY_REVIEW', 'PENDING_HOD', 'PENDING_PRINCIPAL', 'PRINCIPAL_MEET_REQUESTED']
        
        if (event.status && pendingStatuses.includes(event.status)) {
          // If already booked, don't overwrite with pending (booked takes precedence for overlapping events if multiple exist)
          if (newAvail[event.venue_id] !== 'BOOKED') {
            newAvail[event.venue_id] = 'PENDING'
          }
        } else if (event.status === 'APPROVED') {
          newAvail[event.venue_id] = 'BOOKED'
        }
      })
    }

    setAvailability(newAvail)
    setIsChecked(true)
    setIsChecking(false)
  }

  const handleVenueClick = (svgId: string) => {
    const venue = venues.find(v => v.svg_element_id === svgId)
    if (venue) setSelectedVenue(venue)
  }

  const handleClosePanel = () => setSelectedVenue(null)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <MapSidebar 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        onCheck={handleCheckAvailability}
        isChecking={isChecking}
        hasChecked={isChecked}
      />

      {/* Main Map Area */}
      <main className="flex-1 relative bg-black overflow-auto scrollbar-hide">
        <div className="min-h-full min-w-full flex items-center justify-center p-6">
          <CampusMap 
            venues={venues} 
            availability={availability} 
            selectedVenueId={selectedVenue?.id || null}
            onVenueClick={handleVenueClick}
            hasChecked={isChecked}
          />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-zinc-400 px-4 py-2 rounded-md text-sm backdrop-blur-md border border-zinc-800">
          {isChecked ? 'Click any venue to see details and request a booking' : 'Select a date/time range, then click Check Availability'}
        </div>
      </main>

      {/* Slide-out Panel */}
      <VenuePanel 
        venue={selectedVenue} 
        onClose={handleClosePanel} 
        availability={selectedVenue ? availability[selectedVenue.id] : undefined}
        hasChecked={isChecked}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        onBookingSuccess={handleCheckAvailability}
      />
    </div>
  )
}
