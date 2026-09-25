'use client'

import { useState, useTransition } from 'react'
import { EventWithDetails } from '@/lib/types'
import { processEventAction } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import SpecularButton from '@/components/ui/SpecularButton'
import LetterFormatModal from './LetterFormatModal'
import BorderGlow from '@/components/ui/BorderGlow'

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
    return <p className="text-muted-foreground">No pending requests for your approval.</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {events.map((event) => (
          <BorderGlow key={event.id} className="bg-transparent hover:bg-white/5 backdrop-blur-sm transition-colors p-6 rounded-lg shadow-sm border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" backgroundColor="transparent" glowColor="270 100 70">
            <div>
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm text-muted-foreground">Club: {event.clubs?.name}</p>
              <p className="text-sm">Venue: {event.venues?.name}</p>
              <p className="text-sm">Date: {new Date(event.start_time).toLocaleDateString('en-GB')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SpecularButton 
                size="sm"
                onClick={() => openLetterView(event)}
                baseColor="#1f2937"
                lineColor="#9ca3af"
              >
                More Details
              </SpecularButton>
              <SpecularButton 
                size="sm"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'REJECT')}
                baseColor="#7f1d1d"
                lineColor="#ef4444"
                textColor="#fecaca"
              >
                {isPending && processingId === event.id ? 'Processing...' : 'Reject'}
              </SpecularButton>
              <SpecularButton 
                size="sm"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'APPROVE')}
                baseColor="#065f46"
                lineColor="#10b981"
                textColor="#d1fae5"
              >
                {isPending && processingId === event.id ? 'Processing...' : 'Approve'}
              </SpecularButton>
            </div>
          </BorderGlow>
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
