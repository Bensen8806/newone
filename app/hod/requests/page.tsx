import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PendingRequestsList from '@/components/PendingRequestsList'

export default async function HodRequests() {
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
    
  const deptId = profile?.department_id

  // Fetch pending events for clubs belonging to this HoD's department
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs!inner(name, department_id), venues(name)')
    .eq('status', 'PENDING_HOD')
    .eq('clubs.department_id', deptId)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pending Venue Requests</h1>
      <PendingRequestsList 
        events={events as any} 
        role="HOD" 
        roleCode="HOD" 
      />
    </div>
  )
}
