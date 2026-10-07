import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { approveRoleRequest, rejectRoleRequest } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CreatePostButton from '@/components/CreatePostButton'

export default async function AdminDashboard() {
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

  const adminClient = createAdminClient()
  const { data: pendingRequests } = await adminClient
    .from('users')
    .select('id, name, email, requested_role')
    .not('requested_role', 'is', null)

  const { data: events } = await supabase
    .from('events')
    .select('*, venues(name)')
    .eq('club_head_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Admin Dashboard</h1>
            <p className="text-sm text-white/50">Manage platform users and role requests.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/map">
              <Button variant="outline" className="h-9 px-4 text-xs font-medium border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
                Book Venue
              </Button>
            </Link>
            <form action={logout}>
              <Button type="submit" variant="outline" className="h-9 px-4 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                Sign out
              </Button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl font-medium flex-shrink-0">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h2 className="text-base font-medium text-white">{profile?.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70 uppercase tracking-wider mt-1 inline-block">
                    Admin
                  </span>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Email</div>
                  <div className="text-sm text-white/90">{profile?.email}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Roles</div>
                  <div className="text-sm text-white/90">{profile?.role?.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Role Requests Section */}
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl flex flex-col h-full min-h-[400px]">
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
                <h2 className="text-sm font-medium text-white/90">Pending Role Requests</h2>
                {pendingRequests && pendingRequests.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
              
              <div className="flex-grow p-6">
                {pendingRequests && pendingRequests.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="bg-[#111] p-5 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium text-white">{req.name}</h3>
                          <p className="text-xs text-white/50">{req.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Requested Role:</span>
                            <span className="text-[10px] font-medium text-white px-2 py-0.5 bg-white/10 rounded-sm">{req.requested_role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <form action={rejectRoleRequest.bind(null, req.id)} className="flex-1 md:flex-none">
                            <Button 
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="w-full h-8 px-4 text-xs font-medium border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                            >
                              Reject
                            </Button>
                          </form>
                          <form action={approveRoleRequest.bind(null, req.id, req.requested_role)} className="flex-1 md:flex-none">
                            <Button 
                              type="submit"
                              size="sm"
                              className="w-full h-8 px-4 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
                            >
                              Approve
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <h3 className="text-sm font-medium text-white/90 mb-1">All caught up</h3>
                    <p className="text-xs text-white/50">No pending requests at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
              <h2 className="text-sm font-medium text-white/90">My Events</h2>
            </div>
            
            <div className="p-6">
              {events && events.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-[#111] p-5 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">{event.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                          <span><span className="text-white/30">Venue:</span> {(event.venues as { name: string })?.name}</span>
                          <span><span className="text-white/30">Date:</span> {new Date(event.start_time).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2">
                          <span className="text-[10px] text-white/40 uppercase tracking-wider">Status:</span>
                          <span className="px-2 py-0.5 rounded-sm bg-white/10 text-[10px] text-white/80 font-medium">
                            {event.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 md:mt-0 w-full md:w-auto flex justify-end">
                        {event.status === 'APPROVED' && (
                          <CreatePostButton eventId={event.id} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-white/50">No events found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
