'use client'

import { useState, useTransition } from 'react'
import { EventWithDetails } from '@/lib/types'
import { processEventAction } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import LetterFormatModal from './LetterFormatModal'

type EventType = EventWithDetails & { clubs?: { name: string } | null, venues?: { name: string } | null }

interface PendingRequestsListProps {
  events: EventType[]
  role: 'Faculty Advisor' | 'HOD' | 'Principal'
  roleCode: 'FACULTY_ADVISOR' | 'HOD' | 'PRINCIPAL'
}

export default function PendingRequestsList({ events, role, roleCode }: PendingRequestsListProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = (eventId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(eventId)
    startTransition(async () => {
      const remark = action === 'APPROVE' ? `Approved by ${role}` : `Rejected by ${role}`
      await processEventAction(eventId, action, roleCode, remark)
      setProcessingId(null)
    })
  }

  const openLetterView = (event: EventType) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-white/40">No pending requests for your approval at this time.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col divide-y divide-white/5">
        {events.map((event) => (
          <div key={event.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
            <div className="space-y-1">
              <h3 className="text-base font-medium text-white group-hover:text-white/90 transition-colors">{event.title}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                <span><span className="text-white/30">Club:</span> {event.clubs?.name}</span>
                <span><span className="text-white/30">Venue:</span> {event.venues?.name}</span>
                <span><span className="text-white/30">Date:</span> {new Date(event.start_time).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-3 text-xs font-medium border-white/10 bg-transparent text-white hover:bg-white/5 transition-colors flex-1 md:flex-none"
                onClick={() => openLetterView(event)}
              >
                More Details
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'REJECT')}
                className="h-8 px-3 text-xs font-medium border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors flex-1 md:flex-none disabled:opacity-50"
              >
                {isPending && processingId === event.id ? '...' : 'Reject'}
              </Button>
              <Button 
                size="sm"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'APPROVE')}
                className="h-8 px-3 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors flex-1 md:flex-none disabled:opacity-50"
              >
                {isPending && processingId === event.id ? 'Processing...' : 'Approve'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <LetterFormatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        role={role}
      />
    </>
  )
}
