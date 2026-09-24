import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { processEventAction } from '@/app/actions/events'

export default async function FacultyAdvisorRequests() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch pending events for clubs where this user is the faculty advisor
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs!inner(name, faculty_advisor_id), venues(name)')
    .eq('status', 'PENDING_FACULTY_REVIEW')
    .eq('clubs.faculty_advisor_id', user.id)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pending Club Requests</h1>
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
              <div className="flex gap-2">
                <form action={async () => {
                  'use server'
                  await processEventAction(event.id, 'REJECT', 'FACULTY_ADVISOR', 'Rejected by Faculty Advisor')
                }}>
                  <button type="submit" className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">Reject</button>
                </form>
                <form action={async () => {
                  'use server'
                  await processEventAction(event.id, 'APPROVE', 'FACULTY_ADVISOR', 'Approved by Faculty Advisor')
                }}>
                  <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Approve</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No pending requests for your clubs.</p>
      )}
    </div>
  )
}
