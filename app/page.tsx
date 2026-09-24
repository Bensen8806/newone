import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, Users, Server, User, UserCheck, MapPin } from 'lucide-react'
import GradientWaves from '@/components/ui/GradientWaves'
import BorderGlow from '@/components/ui/BorderGlow'
import ScrollVideo from '@/components/ui/ScrollVideo'
import RegistrationModal from '@/components/RegistrationModal'

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

  // Only show active/future events on the landing page
  // Use OR to gracefully handle data-entry errors where end_time was accidentally set before start_time
  let events: any[] = []
  try {
    const { data } = await supabase
      .from('events')
      .select('*, venues(name), event_posts(poster_url, registration_url)')
      .eq('status', 'APPROVED')
      .or(`end_time.gte.${new Date().toISOString()},start_time.gte.${new Date().toISOString()}`)
      .order('start_time', { ascending: false })
    if (data) events = data
  } catch (err) {
    events = []
  }

  const sampleEvents = [
    {
      id: 'sample-1',
      title: 'HackNSS 2026 - Annual 24hr Campus Hackathon',
      description: 'Join 200+ developers, designers, and innovators at NSSCE for 24 hours of building cutting-edge open-source software and hardware solutions.',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      venues: { name: 'Auditorium' },
      event_posts: [{ poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', registration_url: 'https://nssce.ac.in' }]
    },
    {
      id: 'sample-2',
      title: 'ACM Technical Talk: AI & Quantum Computing',
      description: 'An interactive session on emerging trends in AI agents, LLM architectures, and Quantum Algorithms hosted by ACM NSSCE Chapter.',
      start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      venues: { name: 'CSE Seminar Hall' },
      event_posts: [{ poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', registration_url: 'https://nssce.ac.in' }]
    }
  ]

  const displayEvents = events && events.length > 0 ? events : sampleEvents

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
    <div className="relative flex flex-col gap-32 pt-24 pb-24 min-h-screen">
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
      <section className="container mx-auto px-4 text-center">
        <h1 className="font-poppins text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Campus Event & <span className="text-primary">Venue Booking</span> System
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A structured, role-based system for submitting venue requests, tracking approvals, and publishing campus events — replacing paper-based processes entirely at NSS College of Engineering.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href={dashboardLink}>
            <Button size="lg" className="font-semibold">
              {user ? 'View Dashboard' : 'Login to Dashboard'}
            </Button>
          </Link>
          {(!user || isAuthorizedForMap) && (
            <Link href="/map">
              <Button size="lg" variant="outline" className="font-semibold">
                <Map className="mr-2 h-4 w-4" /> View Campus Map
              </Button>
            </Link>
          )}
        </div>
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
              <div className="h-9 w-9 rounded-md bg-zinc-500/10 flex items-center justify-center mb-4">
                <Server className="h-4 w-4 text-zinc-400" />
              </div>
              <CardTitle className="text-base mb-2">Admin</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Manages users, roles, departments, and venue records across the entire system.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-blue-500/10 flex items-center justify-center mb-4">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-base mb-2">Principal</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Views all events. Provides final approval or rejection with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-amber-500/10 flex items-center justify-center mb-4">
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <CardTitle className="text-base mb-2">HOD</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Reviews venue requests for their department only. Approves or rejects with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-red-500/10 flex items-center justify-center mb-4">
                <MapPin className="h-4 w-4 text-red-500" />
              </div>
              <CardTitle className="text-base mb-2">Club Head</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Creates events, selects venues on the map, tracks approval status, and marks attendance.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
          
          <BorderGlow className="rounded-xl shadow-lg border bg-card/50" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-green-500/10 flex items-center justify-center mb-4">
                <UserCheck className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-base mb-2">Student</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Browses approved events, registers, and downloads participation certificates.
              </CardDescription>
            </CardHeader>
          </BorderGlow>
        </div>
      </section>
      {/* Event Feed Section */}
      <section className="container mx-auto px-4 max-w-4xl mt-16 z-10 relative bg-background/80 p-8 rounded-xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Campus Life</div>
          <h2 className="font-poppins text-3xl font-bold tracking-tight mb-4">Latest Events</h2>
        </div>
        
        {displayEvents && displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-12">
            {displayEvents.map((event: any) => {
              const posterUrl = event.event_posts?.[0]?.poster_url;
              const registrationUrl = event.event_posts?.[0]?.registration_url;
              return (
                <BorderGlow key={event.id} className="bg-card rounded-xl overflow-hidden shadow-lg border" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
                  <div className="p-4 flex items-center justify-between border-b bg-muted/30">
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(event.start_time).toLocaleDateString()}</div>
                  </div>
                  
                  {posterUrl ? (
                    <div className="w-full h-[500px] relative overflow-hidden bg-black flex items-center justify-center">
                      <img src={posterUrl} alt={event.title} className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center border-b">
                      <span className="text-muted-foreground font-medium text-lg">{event.title}</span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex gap-4 text-sm">
                      <p><strong>Date:</strong> {new Date(event.start_time).toLocaleString()}</p>
                      <p><strong>Venue:</strong> {event.venues?.name}</p>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                    )}
                    <div className="mt-4">
                      {registrationUrl ? (
                        <RegistrationModal registrationUrl={registrationUrl} eventTitle={event.title} />
                      ) : (
                        <Button className="w-full" disabled>Registration Not Available</Button>
                      )}
                    </div>
                  </div>
                </BorderGlow>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No recent events to show.</p>
        )}
      </section>
    </div>
  )
}
