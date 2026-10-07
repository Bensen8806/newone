'use client'

import { useState, useTransition } from 'react'
import { createEventPost } from '@/app/actions/events'
import { Button } from '@/components/ui/button'

export default function CreatePostButton({ eventId }: { eventId: string }) {
  const [showModal, setShowModal] = useState(false)
  const [posterUrl, setPosterUrl] = useState('')
  const [registrationUrl, setRegistrationUrl] = useState('')
  const [isPending, startTransition] = useTransition()

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!posterUrl) return
    
    startTransition(async () => {
      await createEventPost(eventId, posterUrl, registrationUrl)
      setShowModal(false)
      alert("Post created successfully!")
    })
  }

  return (
    <>
      <Button 
        size="sm"
        onClick={() => setShowModal(true)} 
        className="h-8 px-3 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
      >
        Create Social Post
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95">
            <h3 className="text-lg font-semibold mb-1 text-white">Create Event Post</h3>
            <p className="text-xs text-white/50 mb-6">Publish your approved event to the public feed.</p>
            
            <form onSubmit={handlePost} className="flex flex-col gap-5">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
                  Poster Image URL
                </label>
                <input 
                  type="url" 
                  value={posterUrl} 
                  onChange={e => setPosterUrl(e.target.value)} 
                  className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                  placeholder="https://example.com/poster.jpg"
                  required 
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1.5">
                  Registration URL <span className="lowercase normal-case font-normal">(Optional)</span>
                </label>
                <input 
                  type="url" 
                  value={registrationUrl} 
                  onChange={e => setRegistrationUrl(e.target.value)} 
                  className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                  placeholder="https://forms.gle/..."
                />
                <p className="text-[10px] text-white/30 mt-1">Link for students to register.</p>
              </div>
              
              <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-white/5">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowModal(false)} 
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
                  {isPending ? 'Posting...' : 'Post to Feed'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
