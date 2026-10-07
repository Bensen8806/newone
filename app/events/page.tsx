import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
  
  const getEventExpiry = (event: any) => 
    new Date(Math.max(new Date(event.end_time).getTime(), new Date(event.start_time).getTime()))

  const futureEvents = allEvents?.filter(event => getEventExpiry(event) >= now) || []
  const pastEvents = allEvents?.filter(event => getEventExpiry(event) < now) || []

  const EventCard = ({ event, isPast }: { event: any, isPast?: boolean }) => (
    <div className={`group relative flex flex-col border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 ${isPast ? 'opacity-60' : ''}`}>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
            {(event.clubs as { name: string })?.name || 'College Event'}
          </span>
          {!isPast && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] text-white/70">
              Upcoming
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2 leading-snug group-hover:text-white/90 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-white/50 line-clamp-2 mb-6 flex-1">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 text-xs text-white/50 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <span>{new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{(event.venues as { name: string })?.name || 'TBA'}</span>
          </div>
        </div>
      </div>
      
      {!isPast && (
        <Link href={`/events/${event.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View Event</span>
        </Link>
      )}
      {!isPast && (
        <div className="absolute top-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Event Feed</h1>
          <p className="text-white/50">Discover and register for upcoming events.</p>
        </header>

        <div className="space-y-16">
          {/* Upcoming Events */}
          <section>
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Upcoming</h2>
            {futureEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {futureEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-12 text-center">
                <p className="text-sm text-white/50">No upcoming events scheduled at the moment.</p>
              </div>
            )}
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Past Events</h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast={true} />
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-[#0A0A0A] rounded-xl p-12 text-center">
                <p className="text-sm text-white/50">No past events to display.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
