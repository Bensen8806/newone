'use client'

import { useState, useTransition } from 'react'
import { processEventAction } from '@/app/actions/events'
import LetterFormatModal from './LetterFormatModal'
import { EventWithDetails } from '@/lib/types'
import { Button } from '@/components/ui/button'

type EventType = EventWithDetails & { clubs?: { name: string } | null, venues?: { name: string } | null }

export default function PrincipalActionButtons({ event }: { event: EventType }) {
  const [showMeetModal, setShowMeetModal] = useState(false)
  const [showLetterModal, setShowLetterModal] = useState(false)
  const [meetingTime, setMeetingTime] = useState('')
  const [meetingReason, setMeetingReason] = useState('')
  
  const [isPending, startTransition] = useTransition()
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const handleAction = (action: 'APPROVE' | 'REJECT', remark: string) => {
    setProcessingAction(action)
    startTransition(async () => {
      await processEventAction(event.id, action, 'PRINCIPAL', remark)
      setProcessingAction(null)
    })
  }

  const handleMeet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingTime || !meetingReason) return
    
    setProcessingAction('MEET')
    startTransition(async () => {
      await processEventAction(event.id, 'MEET', 'PRINCIPAL', 'Requested a meeting', {
        time: new Date(meetingTime).toISOString(),
        reason: meetingReason
      })
      setShowMeetModal(false)
      setProcessingAction(null)
    })
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-xs font-medium border-white/10 bg-transparent text-white hover:bg-white/5 transition-colors flex-1 md:flex-none"
          onClick={() => setShowLetterModal(true)}
        >
          More Details
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isPending}
          onClick={() => handleAction('REJECT', 'Rejected by Principal')}
          className="h-8 px-3 text-xs font-medium border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors flex-1 md:flex-none disabled:opacity-50"
        >
          {isPending && processingAction === 'REJECT' ? '...' : 'Reject'}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isPending}
          onClick={() => setShowMeetModal(true)}
          className="h-8 px-3 text-xs font-medium border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-colors flex-1 md:flex-none disabled:opacity-50"
        >
          Meet Me
        </Button>
        <Button 
          size="sm"
          disabled={isPending}
          onClick={() => handleAction('APPROVE', 'Approved by Principal')}
          className="h-8 px-3 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors flex-1 md:flex-none disabled:opacity-50"
        >
          {isPending && processingAction === 'APPROVE' ? 'Processing...' : 'Approve'}
        </Button>
      </div>

      {showMeetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95">
            <h3 className="text-lg font-semibold mb-1 text-white">Schedule Meeting</h3>
            <p className="text-xs text-white/50 mb-6">Request a meeting with the club head to discuss this event.</p>
            
            <form onSubmit={handleMeet} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">Meeting Time</label>
                <input 
                  type="datetime-local" 
                  value={meetingTime} 
                  onChange={e => setMeetingTime(e.target.value)} 
                  className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">Reason / Notes</label>
                <textarea 
                  value={meetingReason} 
                  onChange={e => setMeetingReason(e.target.value)} 
                  className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md text-sm text-white h-24 resize-none focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                  placeholder="Please discuss the budget details..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowMeetModal(false)} 
                  className="h-9 px-4 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-9 px-4 text-xs font-medium bg-white text-black hover:bg-white/90"
                  disabled={isPending}
                >
                  {isPending && processingAction === 'MEET' ? 'Sending...' : 'Send Request'}
                </Button>
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

