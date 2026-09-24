import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GradientWaves from '@/components/ui/GradientWaves'

export default async function MainFeed() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name), venues(name)')
    .eq('status', 'APPROVED')
    .order('start_time', { ascending: true })

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
      
      <div className="p-8 max-w-5xl mx-auto relative">
        <h1 className="text-3xl font-bold mb-8">Main Feed</h1>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-card/80 backdrop-blur p-6 rounded-lg shadow-sm border flex flex-col">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-muted/20 backdrop-blur rounded-lg border">
            <p className="text-muted-foreground">No approved events to display at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
