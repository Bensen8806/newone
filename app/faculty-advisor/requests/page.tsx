import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PendingRequestsList from '@/components/PendingRequestsList'

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
      <PendingRequestsList 
        events={events as any} 
        role="Faculty Advisor" 
        roleCode="FACULTY_ADVISOR" 
      />
    </div>
  )
}
