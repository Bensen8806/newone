import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import PendingRequestsList from '@/components/PendingRequestsList'

export default async function HodDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  let department = null
  if (profile?.department_id) {
    const { data } = await supabase.from('departments').select('name').eq('id', profile.department_id).single()
    department = data
  }

  // Fetch pending events for clubs belonging to this HoD's department
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs!inner(name, department_id), venues(name)')
    .eq('status', 'PENDING_HOD')
    .eq('clubs.department_id', profile?.department_id || '')

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">HoD Dashboard</h1>
            <p className="text-sm text-white/50">Manage department and review event requests.</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" className="h-9 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              Sign out
            </Button>
          </form>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Card */}
          <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-2xl font-medium flex-shrink-0">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'H'}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium text-white">{profile?.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70 uppercase tracking-wider">
                  Head of Department
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                <div className="text-white/50"><span className="text-white/30 mr-1">Email:</span> {profile?.email}</div>
                <div className="text-white/50"><span className="text-white/30 mr-1">Department:</span> {department?.name || 'Not assigned'}</div>
              </div>
            </div>
          </div>
          
          {/* Requests Section */}
          <div className="border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2 bg-white/[0.02]">
              <h2 className="text-sm font-medium text-white/90">Pending Venue Requests</h2>
              {events && events.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white">
                  {events.length}
                </span>
              )}
            </div>
            <div className="p-6">
              <PendingRequestsList 
                events={events as any} 
                role="HOD" 
                roleCode="HOD" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
