import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PrincipalActionButtons from '@/components/PrincipalActionButtons'
import Galaxy from '@/components/ui/Galaxy'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

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

  const glassCard = "bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-6"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-white p-8">
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-black">
        <Galaxy transparent={false} />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <TextType as="h1" className="text-4xl font-extrabold mb-8 tracking-tight" text="Final Approval Queue" typingSpeed={50} loop={false} />
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <div key={event.id} className={`${glassCard} flex flex-col md:flex-row justify-between items-start md:items-center`}>
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-sm text-gray-300">Club: {(event.clubs as { name: string })?.name}</p>
                  <p className="text-sm text-gray-300">Venue: {(event.venues as { name: string })?.name}</p>
                  <p className="text-sm text-gray-300">Date: {new Date(event.start_time).toLocaleDateString()}</p>
                </div>
                <PrincipalActionButtons event={event as any} />
              </div>
            ))}
          </div>
        ) : (
          <BorderGlow className={`${glassCard} flex items-center justify-center min-h-[200px]`} backgroundColor="transparent" glowColor="40 100 70">
            <p className="text-gray-300 text-lg">No events awaiting final approval.</p>
          </BorderGlow>
        )}
      </div>
    </div>
  )
}
