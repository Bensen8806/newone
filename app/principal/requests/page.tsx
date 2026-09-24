import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PrincipalActionButtons from '@/components/PrincipalActionButtons'

export default async function PrincipalRequests() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch events waiting for Principal approval
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name), venues(name)')
    .eq('status', 'PENDING_PRINCIPAL')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Final Approval Queue</h1>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex justify-between items-center">
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
    </div>
  )
}
