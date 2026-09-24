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
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="font-poppins text-xl">{venueName}</SheetTitle>
          </SheetHeader>

          {/* Content */}
          {venue && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status Chip */}
              <div className={cn(
                "px-4 py-3 rounded-lg border flex items-center gap-3 text-sm font-medium",
                !hasChecked ? "bg-muted text-muted-foreground border-border" :
                availability === 'AVAILABLE' ? "bg-green-500/10 text-green-600 border-green-500/20" :
                availability === 'PENDING' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-red-500/10 text-red-600 border-red-500/20"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  !hasChecked ? "bg-muted-foreground" :
                  availability === 'AVAILABLE' ? "bg-green-500" :
                  availability === 'PENDING' ? "bg-amber-500" : "bg-red-500"
                )} />
                {!hasChecked ? 'Select a time range first' :
                 availability === 'AVAILABLE' ? 'Available for selected time' :
                 availability === 'PENDING' ? 'Pending request in this slot' : 'Already booked in this slot'
                }
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Department</div>
                  <div className="font-medium text-sm">{deptName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Capacity</div>
                  <div className="font-medium text-sm">{capacity}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Managed By</div>
                  <div className="font-medium text-sm">{deptName} HOD</div>
                </div>
              </div>

              {/* Features */}
              {featureList.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Features</div>
                  <div className="flex flex-wrap gap-2">
                    {featureList.map(f => (
                      <div key={f} className="px-2.5 py-1 bg-muted text-xs font-medium rounded-md capitalize border">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-6 border-t bg-muted/10">
            <Button 
              className="w-full" 
              disabled={!hasChecked || availability === 'BOOKED'}
              onClick={() => setIsModalOpen(true)}
            >
              {availability === 'BOOKED' ? 'Venue Booked' : 'Request This Venue'}
            </Button>
            {!hasChecked && <p className="text-xs text-center text-muted-foreground mt-2">Check availability first to book</p>}
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
