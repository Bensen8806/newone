'use client'

import { useState } from 'react'
import { processEventAction } from '@/app/actions/events'
import LetterFormatModal from './LetterFormatModal'
import { EventWithDetails } from '@/lib/types'

type EventType = EventWithDetails & { clubs?: { name: string } | null, venues?: { name: string } | null }

export default function PrincipalActionButtons({ event }: { event: EventType }) {
  const [showMeetModal, setShowMeetModal] = useState(false)
  const [showLetterModal, setShowLetterModal] = useState(false)
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingReason, setMeetingReason] = useState('')

  const handleAction = async (action: 'APPROVE' | 'REJECT', remark: string) => {
    await processEventAction(event.id, action, 'PRINCIPAL', remark)
  }

  const handleMeet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingTime || !meetingReason) return
    await processEventAction(event.id, 'MEET', 'PRINCIPAL', 'Requested a meeting', {
      time: new Date(meetingTime).toISOString(),
      reason: meetingReason
    })
    setShowMeetModal(false)
  }

  return (
    <>
      <div className="flex gap-2">
        <button onClick={() => setShowLetterModal(true)} className="px-4 py-2 border rounded-md hover:bg-muted">More Details</button>
        <button onClick={() => handleAction('REJECT', 'Rejected by Principal')} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">Reject</button>
        <button onClick={() => setShowMeetModal(true)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md border border-gray-300">Meet Me</button>
        <button onClick={() => handleAction('APPROVE', 'Approved by Principal')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Approve</button>
      </div>

      {showMeetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Schedule Meeting with Club Head</h3>
            <form onSubmit={handleMeet} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Time</label>
                <input 
                  type="datetime-local" 
                  value={meetingTime} 
                  onChange={e => setMeetingTime(e.target.value)} 
                  className="w-full p-2 border rounded"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason / Notes</label>
                <textarea 
                  value={meetingReason} 
                  onChange={e => setMeetingReason(e.target.value)} 
                  className="w-full p-2 border rounded h-24"
                  placeholder="Please discuss the budget details..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowMeetModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LetterFormatModal
        isOpen={showLetterModal}
        onClose={() => setShowLetterModal(false)}
        event={event}
        role="Principal"
      />
    </>
  )
}

