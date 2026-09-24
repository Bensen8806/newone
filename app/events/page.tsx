import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GradientWaves from '@/components/ui/GradientWaves'
import BorderGlow from '@/components/ui/BorderGlow'

export default async function MainFeed() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: allEvents } = await supabase
    .from('events')
    .select('*, clubs(name), venues(name)')
    .eq('status', 'APPROVED')
    .order('start_time', { ascending: false })

  const now = new Date()
  
  // Use the maximum of start_time and end_time to determine if an event is in the past
  // This mitigates data entry errors where end_time might accidentally be set before start_time
  const getEventExpiry = (event: any) => 
    new Date(Math.max(new Date(event.end_time).getTime(), new Date(event.start_time).getTime()))

  const futureEvents = allEvents?.filter(event => getEventExpiry(event) >= now) || []
  const pastEvents = allEvents?.filter(event => getEventExpiry(event) < now) || []

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
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
      
      <div className="p-8 max-w-5xl mx-auto relative space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
          {futureEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureEvents.map((event) => (
                <BorderGlow key={event.id} className="bg-card/90 backdrop-blur p-6 rounded-lg shadow-sm border flex flex-col" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{(event.clubs as { name: string })?.name}</p>
                  <div className="text-sm space-y-1 mb-4 flex-grow">
                    <p><strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
                    <p><strong>Venue:</strong> {(event.venues as { name: string })?.name}</p>
                    <p className="line-clamp-3 mt-2">{event.description}</p>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
                    View & Register
                  </button>
                </BorderGlow>
              ))}
            </div>
          ) : (
            <BorderGlow className="text-center p-12 bg-muted/20 backdrop-blur rounded-lg border w-full" backgroundColor="hsl(var(--muted))" glowColor="270 100 70">
              <p className="text-muted-foreground">No upcoming events at the moment.</p>
            </BorderGlow>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-8">Past Events</h1>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <BorderGlow key={event.id} className="bg-card/50 backdrop-blur p-6 rounded-lg shadow-sm border flex flex-col opacity-75 grayscale-[0.2]" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{(event.clubs as { name: string })?.name}</p>
                  <div className="text-sm space-y-1 mb-4 flex-grow">
                    <p><strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()}</p>
                    <p><strong>Venue:</strong> {(event.venues as { name: string })?.name}</p>
                    <p className="line-clamp-3 mt-2">{event.description}</p>
                  </div>
                  <button className="w-full bg-secondary text-secondary-foreground py-2 rounded-md font-medium" disabled>
                    Event Ended
                  </button>
                </BorderGlow>
              ))}
            </div>
          ) : (
            <BorderGlow className="text-center p-12 bg-muted/20 backdrop-blur rounded-lg border w-full" backgroundColor="hsl(var(--muted))" glowColor="270 100 70">
              <p className="text-muted-foreground">No past events to display.</p>
            </BorderGlow>
          )}
        </div>
      </div>
    </div>
  )
}
