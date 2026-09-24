'use client'

import { useState } from 'react'
import { createEventPost } from '@/app/actions/events'

export default function CreatePostButton({ eventId }: { eventId: string }) {
  const [showModal, setShowModal] = useState(false)
  const [posterUrl, setPosterUrl] = useState('')
  const [registrationUrl, setRegistrationUrl] = useState('')

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!posterUrl) return
    await createEventPost(eventId, posterUrl, registrationUrl)
    setShowModal(false)
    alert("Post created successfully!")
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
        Create Social Post
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create Event Post</h3>
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Poster Image URL</label>
                <input 
                  type="url" 
                  value={posterUrl} 
                  onChange={e => setPosterUrl(e.target.value)} 
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/poster.jpg"
                  required 
                />
                <p className="text-xs text-muted-foreground mt-1">For now, enter a direct URL to an image.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration URL (Optional)</label>
                <input 
                  type="url" 
                  value={registrationUrl} 
                  onChange={e => setRegistrationUrl(e.target.value)} 
                  className="w-full p-2 border rounded"
                  placeholder="https://forms.gle/..."
                />
                <p className="text-xs text-muted-foreground mt-1">Link for students to register.</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">Post to Feed</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
