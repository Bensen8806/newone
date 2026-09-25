import { createClient } from '@/lib/supabase/server'
import GradientWaves from '@/components/ui/GradientWaves'
import TextType from '@/components/ui/TextType'
import BorderGlow from '@/components/ui/BorderGlow'

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

  const glassCard = "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/20 dark:hover:bg-white/5 flex flex-col h-full"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <GradientWaves horizonColor="#fbbf24" waveColor="#fcd34d" crestColor="#d97706" speed={0.4} amplitude={2.5} waveScale={0.6} waveRatio={0.9} swell={35} turbulence={20} tilt={1.11} zoom={1.0} height={5.5} fogDepth={15} detail="medium" brightness={1.0} opacity={1.0} mouseInteraction={true} parallaxStrength={0.5} grain={true} grainIntensity={0.05} />
      </div>

      <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="Clubs Directory" typingSpeed={50} loop={false} />
          <p className="text-muted-foreground mt-2 text-lg">Explore all the clubs and organizations on campus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs && clubs.map((club) => (
            <BorderGlow key={club.id} className={glassCard} backgroundColor="transparent" glowColor="40 100 70">
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold line-clamp-2">{club.name || 'Unnamed Club'}</h2>
                  {club.type && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 whitespace-nowrap ml-2">
                      {club.type}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 text-sm pt-4 border-t border-white/10 dark:border-white/5">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(club.department as any)?.name && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-28">Department:</span>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="font-medium">{(club.department as any).name}</span>
                    </div>
                  )}
                  
                  {club.head_user && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-28">Club Head:</span>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <span className="font-medium">{(club.head_user as any).name || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-28">Contact:</span>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <a href={`mailto:${(club.head_user as any).email}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(club.head_user as any).email}
                        </a>
                      </div>
                    </>
                  )}

                  {club.faculty_advisor && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-28">Faculty Advisor:</span>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="font-medium">{(club.faculty_advisor as any).name || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </div>
            </BorderGlow>
          ))}
          
          {(!clubs || clubs.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 dark:border-white/5 rounded-2xl bg-white/5 dark:bg-black/10">
              <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
              <p className="text-muted-foreground">There are currently no clubs registered in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
