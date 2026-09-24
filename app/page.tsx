import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Map, Users, Server, User, UserCheck, MapPin } from 'lucide-react'
import GradientWaves from '@/components/ui/GradientWaves'
import ScrollVideo from '@/components/ui/ScrollVideo'

import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let roles: string[] = []
  
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    roles = data?.role || ['STUDENT']
  }

  const isAuthorizedForMap = roles.includes('CLUB_HEAD') || roles.includes('HOD') || roles.includes('PRINCIPAL') || roles.includes('ADMIN')

  let dashboardLink = '/login'
  if (user) {
    if (roles.includes('ADMIN')) dashboardLink = '/admin/dashboard'
    else if (roles.includes('PRINCIPAL')) dashboardLink = '/principal/dashboard'
    else if (roles.includes('HOD')) dashboardLink = '/hod/dashboard'
    else if (roles.includes('CLUB_HEAD')) dashboardLink = '/club/dashboard'
    else dashboardLink = '/student/dashboard'
  }

  return (
    <div className="relative flex flex-col gap-32 pt-24 pb-[150vh] min-h-[300vh]">
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
          <Card className="bg-card/50">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-zinc-500/10 flex items-center justify-center mb-4">
                <Server className="h-4 w-4 text-zinc-400" />
              </div>
              <CardTitle className="text-base mb-2">Admin</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Manages users, roles, departments, and venue records across the entire system.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-blue-500/10 flex items-center justify-center mb-4">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-base mb-2">Principal</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Views all events. Provides final approval or rejection with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-amber-500/10 flex items-center justify-center mb-4">
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <CardTitle className="text-base mb-2">HOD</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Reviews venue requests for their department only. Approves or rejects with a mandatory remark.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-red-500/10 flex items-center justify-center mb-4">
                <MapPin className="h-4 w-4 text-red-500" />
              </div>
              <CardTitle className="text-base mb-2">Club Head</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Creates events, selects venues on the map, tracks approval status, and marks attendance.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card/50">
            <CardHeader className="p-5">
              <div className="h-9 w-9 rounded-md bg-green-500/10 flex items-center justify-center mb-4">
                <UserCheck className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-base mb-2">Student</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Browses approved events, registers, and downloads participation certificates.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
