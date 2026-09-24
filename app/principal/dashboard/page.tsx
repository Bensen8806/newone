import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import GradientWaves from '@/components/ui/GradientWaves'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

export default async function PrincipalDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <GradientWaves horizonColor="#fbbf24" waveColor="#fcd34d" crestColor="#d97706" speed={0.4} amplitude={2.5} waveScale={0.6} waveRatio={0.9} swell={35} turbulence={20} tilt={1.11} zoom={1.0} height={5.5} fogDepth={15} detail="medium" brightness={1.0} opacity={1.0} mouseInteraction={true} parallaxStrength={0.5} grain={true} grainIntensity={0.05} />
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="Principal Dashboard" typingSpeed={50} loop={false} />
            <p className="text-muted-foreground mt-2 text-lg">Final approval and oversight of campus activities.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/principal/requests">
              <Button className="rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">View Pending Requests</Button>
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
        </div>
      </div>
    </div>
  )
}
