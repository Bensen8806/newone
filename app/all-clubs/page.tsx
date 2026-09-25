import { createClient } from '@/lib/supabase/server'
import GradientWaves from '@/components/ui/GradientWaves'
import TextType from '@/components/ui/TextType'
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
    <div className="relative min-h-[calc(100vh-4rem)] text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full opacity-60">
        <GradientWaves horizonColor="#fbbf24" waveColor="#fcd34d" crestColor="#d97706" speed={0.4} amplitude={2.5} waveScale={0.6} waveRatio={0.9} swell={35} turbulence={20} tilt={1.11} zoom={1.0} height={5.5} fogDepth={15} detail="medium" brightness={1.0} opacity={1.0} mouseInteraction={true} parallaxStrength={0.5} grain={true} grainIntensity={0.05} />
      </div>

      <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <TextType as="h1" className="text-4xl font-extrabold tracking-tight" text="All Clubs Directory" typingSpeed={50} loop={false} />
          <p className="text-muted-foreground mt-2 text-lg">Explore all the clubs and organizations on campus and their events.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs && clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
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
