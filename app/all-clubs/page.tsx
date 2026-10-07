import { createClient } from '@/lib/supabase/server'
import ClubCard from '@/components/club/ClubCard'

export default async function AllClubsPage() {
  const supabase = createClient()
  
  const { data: clubs } = await supabase
    .from('clubs')
    .select(`
      *,
      department:departments!clubs_department_id_fkey(name),
      head_user:users!clubs_head_user_id_fkey(name, email),
      faculty_advisor:users!clubs_faculty_advisor_id_fkey(name),
      events(*)
    `)
    .order('name')

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Clubs Directory</h1>
            <p className="text-white/50">Explore student organizations and their events.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 w-fit">
            <span>{clubs?.length || 0} Organizations</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs && clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
          
          {(!clubs || clubs.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 border border-white/10 rounded-xl bg-[#0A0A0A]">
              <h3 className="text-sm font-medium text-white/80 mb-1">No clubs found</h3>
              <p className="text-xs text-white/40">There are currently no clubs registered.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
