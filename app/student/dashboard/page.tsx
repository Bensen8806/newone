import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import GradientWaves from '@/components/ui/GradientWaves'
import Link from 'next/link'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

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

  // For a premium look, define a reusable glass card class
  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <GradientWaves
          horizonColor="#fbbf24"
          waveColor="#fcd34d"
          crestColor="#d97706"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="Student Dashboard" typingSpeed={50} loop={false} />
            <p className="text-muted-foreground mt-2 text-lg">Manage your profile and track your campus events.</p>
          </div>
          <form action={logout}>
            <Button type="submit" className="rounded-full px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform bg-foreground text-background hover:bg-foreground/80 dark:bg-foreground dark:text-background border border-foreground/10">
              Sign out
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.name}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    Student
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="font-medium text-foreground">Name: {profile?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="font-medium text-foreground">Email: {profile?.email}</span>
                </div>
              </div>
            </BorderGlow>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <BorderGlow className={`${glassCard} !p-4 flex flex-col items-center justify-center text-center group`} backgroundColor="transparent" glowColor="40 100 70">
                <div className="text-4xl font-extrabold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500">0</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Events</div>
              </BorderGlow>
              <BorderGlow className={`${glassCard} !p-4 flex flex-col items-center justify-center text-center group`} backgroundColor="transparent" glowColor="40 100 70">
                <div className="text-4xl font-extrabold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500">0</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Certificates</div>
              </BorderGlow>
            </div>
          </div>

          {/* Right Column: Events */}
          <div className="lg:col-span-2">
            <BorderGlow className={`${glassCard} h-full min-h-[400px] flex flex-col`} backgroundColor="transparent" glowColor="40 100 70">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold">Participated Events</h2>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 dark:border-white/5 rounded-xl bg-white/5 dark:bg-black/10">
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  You haven't participated in any events. Check out the main feed to discover upcoming campus activities.
                </p>
                <Link href="/events" className="mt-6">
                  <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </BorderGlow>
          </div>
          
        </div>
      </div>
    </div>
  )
}
