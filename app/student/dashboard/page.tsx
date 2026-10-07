import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StudentDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Student Dashboard</h1>
            <p className="text-sm text-white/50">Manage your profile and track your campus events.</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" className="h-9 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              Sign out
            </Button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl font-medium flex-shrink-0">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">{profile?.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70 uppercase tracking-wider mt-1 inline-block">
                    Student
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Name</div>
                  <div className="text-sm text-white/90">{profile?.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Email</div>
                  <div className="text-sm text-white/90">{profile?.email}</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-semibold text-white">0</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Events</div>
              </div>
              <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-5 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-semibold text-white">0</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Certificates</div>
              </div>
            </div>
          </div>

          {/* Right Column: Events */}
          <div className="lg:col-span-2">
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl flex flex-col h-full min-h-[400px]">
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <h2 className="text-sm font-medium text-white/90">Participated Events</h2>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-sm font-medium text-white/90 mb-2">No events yet</h3>
                <p className="text-xs text-white/50 max-w-sm">
                  You haven't participated in any events. Check out the main feed to discover upcoming campus activities.
                </p>
                <Link href="/events" className="mt-6">
                  <Button 
                    className="h-9 px-4 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
                  >
                    Browse Events
                    </Button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
