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
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-[#0A0A0A] border-white/10">
        
        {/* Header */}
        <div className={`p-5 pb-6 border-b border-white/10 relative ${isAdmin ? 'bg-amber-500/10' : 'bg-white/[0.02]'}`}>
          <DialogTitle className="text-lg font-semibold mb-1 flex items-center gap-2 text-white">
            {isAdmin ? (
              <>Instant Book Venue</>
            ) : (
              "New Venue Request"
            )}
          </DialogTitle>
          <div className="text-xs text-white/50 flex items-center gap-1.5 mt-2">
            {isAdmin ? `Admin Booking: ${venue.name}` : `Requesting: ${venue.name}`}
          </div>
        </div>
        
        {/* Form Body */}
        <div className="p-6 space-y-6 h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* Readonly Info Box */}
          <div className="flex bg-[#111] border border-white/5 rounded-lg p-4 gap-6">
            <div className="flex-1">
              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1">Venue</div>
              <div className="text-sm font-medium text-white/90">{venue.name}</div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1">Date</div>
              <div className="text-sm font-medium text-white/90">{formattedDate}</div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1">Time</div>
              <div className="text-sm font-medium text-white/90">{timeRange}</div>
            </div>
          </div>

          {/* Event Title */}
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Event Title *</Label>
            <Input 
              placeholder="e.g., IEEE Workshop on ML" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Description *</Label>
            <Textarea 
              placeholder="Objectives, expected outcomes..." 
              className="min-h-[100px] resize-none bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2 flex flex-col justify-center">
              <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Organizing Club *</Label>
              <div className="text-sm px-3 py-2.5 border border-white/5 rounded-md bg-[#111] text-white/50">
                Assigned based on login
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as string)}>
                <SelectTrigger className="bg-[#111] border-white/10 text-white focus:ring-1 focus:ring-white/30">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                  <SelectItem value="TECHNICAL" className="focus:bg-white/10 focus:text-white">Technical</SelectItem>
                  <SelectItem value="CULTURAL" className="focus:bg-white/10 focus:text-white">Cultural</SelectItem>
                  <SelectItem value="SPORTS" className="focus:bg-white/10 focus:text-white">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Expected Attendance *</Label>
              <Input 
                type="number" 
                placeholder="No. of attendees" 
                value={expectedAttendance}
                onChange={(e) => setExpectedAttendance(e.target.value)}
                className="bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">KTU Activity Points?</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={() => setKtuPoints(true)}
                  variant={ktuPoints ? "default" : "outline"}
                  className={`flex-1 h-10 text-xs transition-colors ${ktuPoints ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  Yes
                </Button>
                <Button 
                  type="button"
                  onClick={() => setKtuPoints(false)}
                  variant={!ktuPoints ? "default" : "outline"}
                  className={`flex-1 h-10 text-xs transition-colors ${!ktuPoints ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  No
                </Button>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Special Requirements</Label>
            <Textarea 
              placeholder="Equipment, setup, external speakers..." 
              className="min-h-[80px] resize-none bg-[#111] border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/30" 
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#0A0A0A] border-t border-white/10 flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending}
            className={`h-9 px-4 text-xs font-medium transition-colors ${isAdmin ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : 'bg-white hover:bg-white/90 text-black'}`}
          >
            {isPending ? 'Submitting...' : isAdmin ? 'Instant Book' : 'Submit for Approval'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
