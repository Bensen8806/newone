'use client'

import { useState, useTransition } from 'react'
import { submitEventRequest } from '@/app/actions/events'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SpecularButton from "@/components/ui/SpecularButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VenueWithDept } from "@/lib/types"

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  venue: VenueWithDept | null
  availability?: 'AVAILABLE' | 'PENDING' | 'BOOKED'
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  onBookingSuccess?: () => void
  isAdmin?: boolean
}

export default function RequestModal({ isOpen, onClose, venue, startDate, endDate, startTime, endTime, onBookingSuccess, isAdmin }: RequestModalProps) {
  const [ktuPoints, setKtuPoints] = useState<boolean>(false)

  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [expectedAttendance, setExpectedAttendance] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')

  if (!venue) return null

  // A helper function to get department colors. Using primary for now.
  const deptColor = "bg-primary"
  
  const formattedDate = startDate && endDate 
    ? (startDate.getTime() === endDate.getTime() 
        ? format(startDate, 'dd MMM yyyy') 
        : `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM yyyy')}`)
    : 'Unknown'
  const timeRange = `${startTime} – ${endTime}`

  const handleSubmit = () => {
    if (!startDate || !endDate || !startTime || !endTime) return

    const startStr = format(startDate, 'yyyy-MM-dd')
    const endStr = format(endDate, 'yyyy-MM-dd')
    const startIso = new Date(`${startStr}T${startTime}:00`).toISOString()
    const endIso = new Date(`${endStr}T${endTime}:00`).toISOString()

    startTransition(async () => {
      const result = await submitEventRequest({
        title,
        description,
        venueId: venue.id,
        startIso,
        endIso,
        expectedAttendance: parseInt(expectedAttendance) || 0,
        category,
        ktuPoints,
        specialRequirements
      })

      if (result.error) {
        alert(result.error)
      } else {
        if (onBookingSuccess) onBookingSuccess()
        onClose()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        
        {/* Header */}
        <div className={`${deptColor} p-5 pb-6 text-primary-foreground relative`}>
          <DialogTitle className="text-xl font-bold mb-1">
            {isAdmin ? "Instant Book Venue ⚡" : "New Venue Request"}
          </DialogTitle>
          <div className="text-sm opacity-90">
            {isAdmin ? `Admin Booking: ${venue.name}` : `Requesting: ${venue.name}`}
          </div>
        </div>
        
        {/* Form Body */}
        <div className="p-6 space-y-5 h-[65vh] overflow-y-auto">
          
          {/* Readonly Info Box */}
          <div className="flex bg-muted/50 border rounded-md p-4 gap-6">
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Venue</div>
              <div className="text-sm font-semibold">{venue.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Date</div>
              <div className="text-sm font-semibold">{formattedDate}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Time</div>
              <div className="text-sm font-semibold">{timeRange}</div>
            </div>
          </div>

          {/* Event Title */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Event Title *</Label>
            <Input 
              placeholder="e.g., IEEE Workshop on ML" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Description *</Label>
            <Textarea 
              placeholder="Objectives, expected outcomes..." 
              className="min-h-[100px] resize-none" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col justify-center">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Organizing Club *</Label>
              <div className="text-sm px-3 py-2 border rounded-md bg-muted/50 text-muted-foreground">
                Assigned based on login
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="CULTURAL">Cultural</SelectItem>
                  <SelectItem value="SPORTS">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Expected Attendance *</Label>
              <Input 
                type="number" 
                placeholder="No. of attendees" 
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">KTU Activity Points?</Label>
              <div className="flex gap-2">
                <SpecularButton 
                  onClick={() => setKtuPoints(true)}
                  className="flex-1"
                  baseColor={ktuPoints ? "#047857" : "#374151"}
                  lineColor={ktuPoints ? "#10b981" : "#9ca3af"}
                >
                  Yes
                </SpecularButton>
                <SpecularButton 
                  onClick={() => setKtuPoints(false)}
                  className="flex-1"
                  baseColor={!ktuPoints ? "#047857" : "#374151"}
                  lineColor={!ktuPoints ? "#10b981" : "#9ca3af"}
                >
                  No
                </SpecularButton>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Special Requirements</Label>
            <Textarea 
              placeholder="Equipment, setup, external speakers..." 
              className="min-h-[80px] resize-none" 
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t flex justify-end gap-3">
          <SpecularButton 
            onClick={onClose}
            baseColor="#374151"
            lineColor="#9ca3af"
          >
            Cancel
          </SpecularButton>
          <SpecularButton 
            onClick={handleSubmit} 
            disabled={isPending}
            baseColor={isAdmin ? "#b45309" : "#065f46"}
            lineColor={isAdmin ? "#fbbf24" : "#10b981"}
          >
            {isPending ? 'Submitting...' : isAdmin ? 'Instant Book ⚡' : 'Submit for Approval →'}
          </SpecularButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
