import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import CreatePostButton from '@/components/CreatePostButton'

export default async function ClubDashboard() {
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

  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('head_user_id', user.id)
    .single()

  const { data: events } = await supabase
    .from('events')
    .select('*, venues(name)')
    .eq('club_head_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/club/new-event">
            <Button>Request Venue</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline">View College Map</Button>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="destructive">Log out</Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Club Details</h2>
          {club ? (
            <>
              <p><strong>Club Name:</strong> {club.name}</p>
              <p><strong>Type:</strong> {club.type}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No club assigned yet.</p>
          )}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">Venue: {(event.venues as { name: string })?.name}</p>
                <p className="text-sm">Date: {new Date(event.start_time).toLocaleString()}</p>
                <p className="text-sm font-medium mt-2">Status: <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">{event.status}</span></p>
                
                {event.status === 'PRINCIPAL_MEET_REQUESTED' && (
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md">
                    <p className="font-bold text-yellow-800 dark:text-yellow-200">The Principal has requested a meeting</p>
                    <p className="text-sm mt-1"><strong>Time:</strong> {new Date(event.principal_meeting_time!).toLocaleString()}</p>
                    <p className="text-sm mt-1"><strong>Reason:</strong> {event.principal_meeting_reason}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-2">
                {event.status === 'APPROVED' && (
                  <CreatePostButton eventId={event.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <p className="text-muted-foreground">No events found.</p>
        </div>
      )}
    </div>
  )
}
