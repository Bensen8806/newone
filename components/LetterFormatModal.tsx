'use client'

import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EventWithDetails } from '@/lib/types'

interface LetterFormatModalProps {
  isOpen: boolean
  onClose: () => void
  event: (EventWithDetails & { clubs?: { name: string } | null, venues?: { name: string } | null }) | null
  role: 'Faculty Advisor' | 'HOD' | 'Principal'
}

export default function LetterFormatModal({ isOpen, onClose, event, role }: LetterFormatModalProps) {
  if (!event) return null

  const clubName = event.clubs?.name || 'Club Representative'
  const venueName = event.venues?.name || 'the requested venue'
  const startDate = new Date(event.start_time)
  const endDate = new Date(event.end_time)
  
  const formattedDate = startDate.getTime() === endDate.getTime() || startDate.toDateString() === endDate.toDateString()
    ? format(startDate, 'dd MMM yyyy') 
    : `${format(startDate, 'dd MMM yyyy')} to ${format(endDate, 'dd MMM yyyy')}`

  const startTime = format(startDate, 'hh:mm a')
  const endTime = format(endDate, 'hh:mm a')
  const requestedDate = format(new Date(event.created_at), 'dd MMM yyyy')

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Request Letter View</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-sm md:text-base">
          <div className="mb-8">
            <p className="font-bold">Date: {requestedDate}</p>
          </div>
          
          <div className="mb-6">
            <p>From,</p>
            <p className="font-semibold ml-4">{clubName}</p>
            <p className="ml-4">NSS College of Engineering</p>
          </div>

          <div className="mb-8">
            <p>To,</p>
            <p className="font-semibold ml-4">The {role}</p>
            <p className="ml-4">NSS College of Engineering</p>
          </div>

          <div className="mb-8 font-bold">
            <p>Subject: Request for permission to conduct "{event.title}"</p>
          </div>

          <div className="mb-6">
            <p>Respected Sir/Madam,</p>
          </div>

          <div className="space-y-4 text-justify">
            <p>
              We, {clubName}, are planning to organize an event titled <strong>"{event.title}"</strong> on {formattedDate} from {startTime} to {endTime}.
            </p>
            <p>
              {event.description}
            </p>
            <p>
              We are expecting an attendance of around {event.expected_attendance} people. The event is categorized as {event.category}{event.ktu_activity_points_category === 'YES' ? ' and is eligible for KTU Activity Points' : ''}.
            </p>
            {event.special_requirements && (
              <p>
                <strong>Special Requirements:</strong> {event.special_requirements}
              </p>
            )}
            <p>
              We kindly request you to grant us permission to use <strong>{venueName}</strong> for this purpose.
            </p>
          </div>

          <div className="mt-12">
            <p>Thanking you,</p>
            <p className="mt-4">Yours sincerely,</p>
            <p className="font-semibold mt-2">{clubName} Representative</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
