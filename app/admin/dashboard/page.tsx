import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { approveRoleRequest, rejectRoleRequest } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CreatePostButton from '@/components/CreatePostButton'
import GradientWaves from '@/components/ui/GradientWaves'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

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

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <GradientWaves horizonColor="#fbbf24" waveColor="#fcd34d" crestColor="#d97706" speed={0.4} amplitude={2.5} waveScale={0.6} waveRatio={0.9} swell={35} turbulence={20} tilt={1.11} zoom={1.0} height={5.5} fogDepth={15} detail="medium" brightness={1.0} opacity={1.0} mouseInteraction={true} parallaxStrength={0.5} grain={true} grainIntensity={0.05} />
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="Admin Dashboard" typingSpeed={50} loop={false} />
            <p className="text-muted-foreground mt-2 text-lg">Manage platform users and role requests.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/map">
              <Button variant="outline" className="rounded-full px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform bg-background/50 backdrop-blur border-foreground/10">Book Venue</Button>
            </Link>
            <form action={logout}>
              <Button type="submit" className="rounded-full px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform bg-foreground text-background hover:bg-foreground/80 dark:bg-foreground dark:text-background border border-foreground/10">Sign out</Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.name}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30">
                    Admin
                  </span>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground"><span className="font-medium text-foreground">Email: {profile?.email}</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><span className="font-medium text-foreground">Roles: {profile?.role?.join(', ')}</span></div>
              </div>
            </BorderGlow>
          </div>

          <div className="lg:col-span-2">
            <BorderGlow className={`${glassCard} h-full min-h-[400px] flex flex-col`} backgroundColor="transparent" glowColor="40 100 70">
              <h2 className="text-2xl font-bold mb-6">Pending Role Requests</h2>
              {pendingRequests && pendingRequests.length > 0 ? (
                <div className="grid gap-4 flex-grow">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-white/5 dark:bg-black/10 p-6 rounded-xl border border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="font-semibold text-lg">{req.name}</p>
                        <p className="text-muted-foreground">{req.email}</p>
                        <p className="mt-2 text-sm">
                          Requested Role: <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded">{req.requested_role}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <form action={approveRoleRequest.bind(null, req.id, req.requested_role)}>
                          <Button type="submit" className="rounded-full">Approve</Button>
                        </form>
                        <form action={rejectRoleRequest.bind(null, req.id)}>
                          <Button type="submit" variant="outline" className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">Reject</Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 dark:border-white/5 rounded-xl bg-white/5 dark:bg-black/10">
                  <h3 className="text-lg font-semibold mb-2">All caught up</h3>
                  <p className="text-muted-foreground max-w-sm">No pending requests at the moment.</p>
                </div>
              )}
            </BorderGlow>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Events</h2>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">Venue: {(event.venues as { name: string })?.name}</p>
                  <p className="text-sm">Date: {new Date(event.start_time).toLocaleString()}</p>
                  <p className="text-sm font-medium mt-2">Status: <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">{event.status}</span></p>
                </div>
                
                <div className="mt-4 md:mt-0 flex gap-2">
                  {event.status === 'APPROVED' && (
                    <CreatePostButton eventId={event.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
