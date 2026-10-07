import { createClient } from '@/lib/supabase/server'

export default async function ClubsPage() {
  const supabase = createClient()
  
  const { data: clubs } = await supabase
    .from('clubs')
    .select(`
      *,
      department:departments!clubs_department_id_fkey(name),
      head_user:users!clubs_head_user_id_fkey(name, email),
      faculty_advisor:users!clubs_faculty_advisor_id_fkey(name)
    `)
    .order('name')

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 pb-6 border-b border-white/10">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Clubs Directory</h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
            Explore all the clubs and organizations on campus.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs && clubs.map((club) => (
            <div key={club.id} className="border border-white/10 bg-[#0A0A0A] rounded-xl p-6 flex flex-col h-full group hover:border-white/20 transition-colors">
              <div className="flex-grow space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg font-medium text-white line-clamp-2 group-hover:text-white/90 transition-colors">{club.name || 'Unnamed Club'}</h2>
                  {club.type && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-white/70 whitespace-nowrap">
                      {club.type}
                    </span>
                  )}
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(club.department as any)?.name && (
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
                        Department
                      </div>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <div className="text-sm text-white/80">{(club.department as any).name}</div>
                    </div>
                  )}
                  
                  {club.head_user && (
                    <>
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
                          Club Head
                        </div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <div className="text-sm text-white/80">{(club.head_user as any).name || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
                          Contact
                        </div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <a href={`mailto:${(club.head_user as any).email}`} className="text-sm text-white/60 hover:text-white transition-colors">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(club.head_user as any).email}
                        </a>
                      </div>
                    </>
                  )}

                  {club.faculty_advisor && (
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
                        Faculty Advisor
                      </div>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <div className="text-sm text-white/80">{(club.faculty_advisor as any).name || 'Not specified'}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {(!clubs || clubs.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-white/5 rounded-xl bg-[#0A0A0A]">
              <h3 className="text-sm font-medium text-white mb-2">No clubs found</h3>
              <p className="text-xs text-white/50">There are currently no clubs registered in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
