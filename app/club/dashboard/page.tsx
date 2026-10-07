import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import CreatePostButton from '@/components/CreatePostButton'
import ClubEditForm from '@/components/ClubEditForm'

export default async function ClubDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: club } = await supabase.from('clubs').select('*').eq('head_user_id', user.id).single()
  const { data: events } = await supabase.from('events').select('*, venues(name)').eq('club_head_id', user.id).order('created_at', { ascending: false })
  
  // Use admin client to bypass RLS for users table
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminClient = createAdminClient()
  const { data: facultyAdvisors } = await adminClient.from('users').select('*').contains('role', ['FACULTY_ADVISOR'])
  const { data: departments } = await supabase.from('departments').select('*')

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Club Dashboard</h1>
            <p className="text-sm text-white/50">Manage your club events and details.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/club/new-event">
              <Button variant="outline" className="h-9 px-4 text-xs font-medium border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
                Request Venue
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="h-9 px-4 text-xs font-medium border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                View Map
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
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                {club?.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={club.logo_url} alt="Club Logo" className="w-14 h-14 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xl font-medium flex-shrink-0">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-medium text-white">{profile?.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70 uppercase tracking-wider mt-1 inline-block">
                    Club Head
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Email</div>
                  <div className="text-sm text-white/90">{profile?.email}</div>
                </div>
                {club ? (
                  <>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Club</div>
                      <div className="text-sm text-white/90 flex items-center">{club.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Type</div>
                      <div className="text-sm text-white/90">{club.type}</div>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-white/30 italic">No club assigned yet.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5">
                <ClubEditForm 
                  club={club} 
                  profile={profile} 
                  facultyAdvisors={facultyAdvisors || []} 
                  departments={departments || []} 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-white/10 bg-[#0A0A0A] rounded-xl flex flex-col h-full min-h-[400px]">
              <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
                <h2 className="text-sm font-medium text-white/90">My Events</h2>
                {events && events.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white">
                    {events.length}
                  </span>
                )}
              </div>
              
              <div className="flex-grow p-6">
                {events && events.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {events.map(event => (
                      <div key={event.id} className="bg-[#111] p-5 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-white/10 transition-colors">
                        <div className="space-y-1 flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">{event.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                            <span><span className="text-white/30">Venue:</span> {(event.venues as { name: string })?.name}</span>
                            <span><span className="text-white/30">Date:</span> {new Date(event.start_time).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2 pt-2">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">Status:</span>
                            <span className="px-2 py-0.5 rounded-sm bg-white/10 border border-white/5 text-[10px] text-white/80 font-medium">
                              {event.status}
                            </span>
                          </div>
                          
                          {event.status === 'PRINCIPAL_MEET_REQUESTED' && (
                            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-semibold text-amber-500">Principal requested a meeting</p>
                              </div>
                              <p className="text-[10px] text-amber-500/70 mt-1.5"><span className="uppercase tracking-wider font-semibold opacity-60">Time:</span> {new Date(event.principal_meeting_time!).toLocaleString()}</p>
                              <p className="text-[10px] text-amber-500/70 mt-0.5"><span className="uppercase tracking-wider font-semibold opacity-60">Reason:</span> {event.principal_meeting_reason}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 md:mt-0 flex justify-end">
                          {event.status === 'APPROVED' && <CreatePostButton eventId={event.id} />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <h3 className="text-sm font-medium text-white/90 mb-1">No events found</h3>
                    <p className="text-xs text-white/50 max-w-sm">You haven&apos;t requested any events yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
