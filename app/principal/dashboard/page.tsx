import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import Galaxy from '@/components/ui/Galaxy'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'
import PrincipalActionButtons from '@/components/PrincipalActionButtons'

export default async function PrincipalDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5"

  // Fetch events waiting for Principal approval
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name), venues(name)')
    .eq('status', 'PENDING_PRINCIPAL')

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <Galaxy mouseRepulsion={true} mouseInteraction={true} density={0.15} glowIntensity={0.5} saturation={0.1} hueShift={240} />
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="Principal Dashboard" typingSpeed={50} loop={false} />
            <p className="text-muted-foreground mt-2 text-lg">Final approval and oversight of campus activities.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <form action={logout}>
              <Button type="submit" className="rounded-full px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform bg-foreground text-background hover:bg-foreground/80 dark:bg-foreground dark:text-background border border-foreground/10">Sign out</Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.name}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                    Principal
                  </span>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground"><span className="font-medium text-foreground">Email: {profile?.email}</span></div>
              </div>
            </BorderGlow>
          </div>

          <div className="mt-4">
            <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
              <h2 className="text-2xl font-bold mb-4">Final Approval Queue</h2>
              {events && events.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-sm text-muted-foreground">Club: {(event.clubs as { name: string })?.name}</p>
                        <p className="text-sm">Venue: {(event.venues as { name: string })?.name}</p>
                        <p className="text-sm">Date: {new Date(event.start_time).toLocaleDateString()}</p>
                      </div>
                      <PrincipalActionButtons event={event as any} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events awaiting final approval.</p>
              )}
            </BorderGlow>
          </div>
        </div>
      </div>
    </div>
  )
}
