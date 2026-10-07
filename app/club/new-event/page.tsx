import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewEvent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Create Post / Event</h1>
          <p className="text-sm text-white/50 leading-relaxed">
            If your event requires a venue, you must request it through the College Map. 
            Once approved, you can publish registration links here.
          </p>
        </header>
        
        <div className="space-y-6">
          {/* Venue Required Card */}
          <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              </div>
            <h2 className="text-lg font-medium text-white mb-3">Venue Required?</h2>
            <p className="text-sm text-white/50 mb-8 max-w-md">
              Please select your venue and date on the campus map to request approval from your HoD and the Principal.
            </p>
            <Link 
              href="/map" 
              className="h-10 px-6 inline-flex items-center justify-center text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md transition-colors"
            >
              Go to College Map
            </Link>
          </div>

          {/* Registration Link Card */}
          <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-8 flex flex-col items-center text-center opacity-70">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
              </div>
            <h2 className="text-lg font-medium text-white mb-3">Post Registration Link</h2>
            <p className="text-sm text-white/50 mb-8 max-w-md">
              For events that are already approved or don&apos;t require a venue.
            </p>
            <button 
              className="h-10 px-6 inline-flex items-center justify-center text-sm font-medium border border-white/10 bg-transparent text-white/50 rounded-md cursor-not-allowed" 
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
