import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PendingRequestsList from '@/components/PendingRequestsList'
import Galaxy from '@/components/ui/Galaxy'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

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

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-8"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-white p-8">
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-black">
        <Galaxy transparent={false} />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <TextType as="h1" className="text-4xl font-extrabold mb-8 tracking-tight" text="Pending Venue Requests" typingSpeed={50} loop={false} />
        <BorderGlow className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
          <PendingRequestsList 
            events={events as any} 
            role="HOD" 
            roleCode="HOD" 
          />
        </BorderGlow>
      </div>
    </div>
  )
}
