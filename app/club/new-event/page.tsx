import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BorderGlow from '@/components/ui/BorderGlow'

export default async function NewEvent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Post / Event</h1>
      <p className="text-muted-foreground mb-8">
        If your event requires a venue, you must request it through the College Map. 
        Once approved, you can publish registration links here.
      </p>
      
      <BorderGlow className="bg-card p-6 rounded-lg shadow-sm border text-center" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
        <h2 className="text-xl font-semibold mb-4">Venue Required?</h2>
        <p className="mb-6">Please select your venue and date on the campus map to request approval from your HoD and the Principal.</p>
        <Link href="/map" className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md">
          Go to College Map
        </Link>
      </BorderGlow>

      <BorderGlow className="mt-8 bg-card p-6 rounded-lg shadow-sm border text-center" backgroundColor="hsl(var(--card))" glowColor="270 100 70">
        <h2 className="text-xl font-semibold mb-4">Post Registration Link</h2>
        <p className="mb-6">For events that are already approved or don&apos;t require a venue.</p>
        <button className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-md" disabled>
          Coming Soon
        </button>
      </BorderGlow>
    </div>
  )
}
