'use client'

import { useState, useTransition } from 'react'
import { EventWithDetails } from '@/lib/types'
import { processEventAction } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
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
          <BorderGlow key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4" backgroundColor="transparent" glowColor="270 100 70">
            <div>
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm text-muted-foreground">Club: {event.clubs?.name}</p>
              <p className="text-sm">Venue: {event.venues?.name}</p>
              <p className="text-sm">Date: {new Date(event.start_time).toLocaleDateString('en-GB')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => openLetterView(event)}
              >
                More Details
              </Button>
              <Button 
                variant="destructive"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'REJECT')}
              >
                {isPending && processingId === event.id ? 'Processing...' : 'Reject'}
              </Button>
              <Button 
                variant="default"
                disabled={isPending && processingId === event.id}
                onClick={() => handleAction(event.id, 'APPROVE')}
              >
                {isPending && processingId === event.id ? 'Processing...' : 'Approve'}
              </Button>
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
