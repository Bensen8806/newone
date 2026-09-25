import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import SpecularButton from '@/components/ui/SpecularButton'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, Users, Server, User, UserCheck, MapPin } from 'lucide-react'
import GradientWaves from '@/components/ui/GradientWaves'
import BorderGlow from '@/components/ui/BorderGlow'
import ScrollVideo from '@/components/ui/ScrollVideo'
import AccordionGallery from '@/components/ui/AccordionGallery'
import RegistrationModal from '@/components/RegistrationModal'
import EventMarquee from '@/components/ui/EventMarquee'

import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let roles: string[] = []
  
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    roles = data?.role || ['STUDENT']
  }

  const isAuthorizedForMap = roles.some(role => role !== 'STUDENT')

  // Query approved events from Supabase
  let { data: events, error } = await supabase
    .from('events')
    .select('*, venues(name), event_posts(poster_url, registration_url)')
    .eq('status', 'APPROVED')
    .order('start_time', { ascending: false })

  // If no approved events returned, query all events in the database to ensure database records display
  if (!events || events.length === 0) {
    const { data: allEvents, error: allErr } = await supabase
      .from('events')
      .select('*, venues(name), event_posts(poster_url, registration_url)')
      .order('created_at', { ascending: false })
    if (allEvents && allEvents.length > 0) {
      events = allEvents
    }
  }

  if (error) {
    console.log('Supabase events query error:', error)
  }

  let dashboardLink = '/login'
  if (user) {
    if (roles.includes('ADMIN')) dashboardLink = '/admin/dashboard'
    else if (roles.includes('PRINCIPAL')) dashboardLink = '/principal/dashboard'
    else if (roles.includes('HOD')) dashboardLink = '/hod/dashboard'
    else if (roles.includes('CLUB_HEAD')) dashboardLink = '/club/dashboard'
    else if (roles.includes('FACULTY_ADVISOR')) dashboardLink = '/faculty-advisor/dashboard'
    else dashboardLink = '/student/dashboard'
  }

  return (
    <div className="relative flex flex-col gap-16 pt-20 pb-20 min-h-screen">
      <ScrollVideo />
      
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10 h-full w-full opacity-50">
        <GradientWaves
          horizonColor="#ff5627"
          waveColor="#ff9fe6"
          crestColor="#b16262"
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
      {/* Hero Section */}
      <section className="container mx-auto px-4 flex flex-col items-center text-center z-10 relative">
        <div className="mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all duration-500">
          <Image src="/disha-transparent.png" alt="Disha Logo" width={380} height={150} quality={100} className="object-contain" priority />
        </div>
        <h1 className="font-poppins text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
          NSSCE Event & <span className="text-primary">Venue Booking</span> System
        </h1>
        <div className="mt-10 flex justify-center gap-6">
          <Link href={dashboardLink}>
            <SpecularButton 
              size="lg" 
              className="font-semibold"
              baseColor="#1f2937"
              lineColor="#d8b4fe"
            >
              {user ? 'View Dashboard' : 'Login to Dashboard'}
            </SpecularButton>
          </Link>
          {(!user || isAuthorizedForMap) && (
            <Link href="/map">
              <SpecularButton 
                size="lg" 
                className="font-semibold"
                baseColor="#111827"
                lineColor="#9ca3af"
              >
                <div className="flex items-center"><Map className="mr-2 h-4 w-4" /> View Campus Map</div>
              </SpecularButton>
            </Link>
          )}
        </div>
      </section>

      {/* Rolling News Bar */}
      <EventMarquee events={events} />

      {/* Event Feed Section */}
      <section className="container mx-auto px-4 max-w-5xl z-10 relative">
        <div className="mb-12 text-center">
          <h2 className="font-poppins text-4xl font-bold tracking-tight mb-4 drop-shadow-md">Latest Events</h2>
        </div>
        
        {events && events.length > 0 ? (
          <div className="w-full">
            <AccordionGallery 
              items={[...events]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 7)
                .map((event: any) => ({
                image: event.event_posts?.[0]?.poster_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
                label: event.title,
                subtitle: `${new Date(event.start_time).toLocaleDateString('en-GB')} • ${event.venues?.name || 'TBA'}`,
                link: event.event_posts?.[0]?.registration_url || '#'
              }))}
              defaultIndex={0}
              height={500}
              expandRatio={0.6}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No recent events to show.</p>
        )}
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 mb-3">Access Control</div>
          <h2 className="font-poppins text-3xl font-bold tracking-tight mb-4">Role-based access</h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xl">
            Each user has a defined role that determines what they can see and do. A user can hold multiple roles simultaneously.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-white/10">
                <Image src="/role-icon.jpg" width={40} height={40} alt="Admin Role" className="object-cover" />
              </div>
              <CardTitle className="text-base mb-2">Admin</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Manages users, roles, departments, and venue records across the entire system.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-white/10">
                <Image src="/role-icon.jpg" width={40} height={40} alt="Principal Role" className="object-cover" />
              </div>
              <CardTitle className="text-base mb-2">Principal</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Views all events. Provides final approval or rejection with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-white/10">
                <Image src="/role-icon.jpg" width={40} height={40} alt="HOD Role" className="object-cover" />
              </div>
              <CardTitle className="text-base mb-2">HOD</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Reviews venue requests for their department only. Approves or rejects with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-white/10">
                <Image src="/role-icon.jpg" width={40} height={40} alt="Club Head Role" className="object-cover" />
              </div>
              <CardTitle className="text-base mb-2">Club Head</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Creates events, selects venues on the map, tracks approval status, and marks attendance.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-10 w-10 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-white/10">
                <Image src="/role-icon.jpg" width={40} height={40} alt="Student Role" className="object-cover" />
              </div>
              <CardTitle className="text-base mb-2">Student</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Browses approved events, registers, and downloads participation certificates.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
        </div>
      </section>
    </div>
  )
}
