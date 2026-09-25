'use server'

import { createClient } from '@/lib/supabase/server'

export async function checkVenueAvailability(startTime: string, endTime: string) {
  const supabase = createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('venue_id, status')
    .lt('start_time', endTime)
    .gt('end_time', startTime)
    .in('status', ['APPROVED', 'PENDING_HOD', 'PENDING_PRINCIPAL'])

  if (error) {
    console.error('Error fetching availability:', error)
    return { error: error.message, availability: null }
  }

  const availability: Record<string, 'AVAILABLE' | 'PENDING' | 'BOOKED'> = {}
  
  // Default all to available initially
  const { data: venues } = await supabase.from('venues').select('id')
  venues?.forEach(v => {
    availability[v.id] = 'AVAILABLE'
  })

  // Mark pending or booked
  events?.forEach(event => {
    if (event.status === 'APPROVED') {
      availability[event.venue_id!] = 'BOOKED'
    } else if (availability[event.venue_id!] !== 'BOOKED') {
      // Only set to pending if not already booked (booked takes precedence)
      availability[event.venue_id!] = 'PENDING'
    }
  })

  return { availability, error: null }
}
