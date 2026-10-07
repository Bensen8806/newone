'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { VenueWithDept } from '@/lib/types'
import { useState } from 'react'
import RequestModal from './RequestModal'
import { cn } from '@/lib/utils'

interface VenuePanelProps {
  venue: VenueWithDept | null
  onClose: () => void
  availability?: 'AVAILABLE' | 'PENDING' | 'BOOKED'
  hasChecked: boolean
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  onBookingSuccess?: () => void
  isAdmin?: boolean
}

export default function VenuePanel({ venue, onClose, availability, hasChecked, startDate, endDate, startTime, endTime, onBookingSuccess, isAdmin }: VenuePanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use a generic placeholder until venue is fully loaded
  const venueName = venue?.name || 'Loading...'
  const deptName = venue?.departments?.name || 'Department'
  const capacity = venue?.capacity || 0
  const features = venue?.features as Record<string, boolean> || {}
  
  // Format features
  const featureList = Object.entries(features)
    .filter(([, v]) => v)
    .map(([k]) => k.replace('_', ' '))

  return (
    <>
      <Sheet open={!!venue} onOpenChange={(open) => { if (!open) onClose() }}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0 border-l border-white/10 bg-[#0A0A0A] text-white">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-white/10">
            <SheetTitle className="text-xl font-semibold tracking-tight text-white">{venueName}</SheetTitle>
          </SheetHeader>

          {/* Content */}
          {venue && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Chip */}
              <div className={cn(
                "px-4 py-3 rounded-md border flex items-center gap-3 text-sm font-medium",
                !hasChecked ? "bg-white/5 text-white/50 border-white/5" :
                availability === 'AVAILABLE' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                availability === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-red-500/10 text-red-500 border-red-500/20"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-sm",
                  !hasChecked ? "bg-white/20 border border-white/10" :
                  availability === 'AVAILABLE' ? "bg-green-500 border border-green-500/50" :
                  availability === 'PENDING' ? "bg-amber-500 border border-amber-500/50" : "bg-red-500 border border-red-500/50"
                )} />
                {!hasChecked ? 'Select a time range first' :
                 availability === 'AVAILABLE' ? 'Available for selected time' :
                 availability === 'PENDING' ? 'Pending request in this slot' : 'Already booked in this slot'
                }
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Department</div>
                  <div className="font-medium text-sm text-white/90">{deptName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Capacity</div>
                  <div className="font-medium text-sm text-white/90">{capacity}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Managed By</div>
                  <div className="font-medium text-sm text-white/90">{deptName} HOD</div>
                </div>
              </div>

              {/* Features */}
              {featureList.length > 0 && (
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-3">Features</div>
                  <div className="flex flex-wrap gap-2">
                    {featureList.map(f => (
                      <div key={f} className="px-2.5 py-1 bg-white/5 text-xs font-medium rounded-md capitalize border border-white/5 text-white/80">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-[#050505] flex flex-col justify-center gap-2">
            <Button 
              className="w-full h-11 text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors" 
              disabled={!hasChecked || availability === 'BOOKED'}
              onClick={() => setIsModalOpen(true)}
            >
              {availability === 'BOOKED' ? 'Venue Booked' : 'Request This Venue'}
            </Button>
            {!hasChecked && <p className="text-xs text-center text-white/40 mt-1">Check availability first to book</p>}
          </div>
        </SheetContent>
      </Sheet>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venue={venue}
        availability={availability}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        onBookingSuccess={onBookingSuccess}
        isAdmin={isAdmin}
      />
    </>
  )
}
