import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import HeroGlobe from '@/components/HeroGlobe'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let roles: string[] = []
  
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    roles = data?.role || ['STUDENT']
  }

  const isAuthorizedForMap = roles.some(role => role !== 'STUDENT')

  let { data: events, error } = await supabase
    .from('events')
    .select('*, venues(name), event_posts(poster_url, registration_url)')
    .eq('status', 'APPROVED')
    .order('start_time', { ascending: false })
    .limit(6)

  if (!events || events.length === 0) {
    const { data: allEvents } = await supabase
      .from('events')
      .select('*, venues(name), event_posts(poster_url, registration_url)')
      .order('created_at', { ascending: false })
      .limit(6)
    if (allEvents && allEvents.length > 0) {
      events = allEvents
    }
  }

  let dashboardLink = '/login'
  if (user) {
    if (roles.includes('ADMIN')) dashboardLink = '/admin/dashboard'
    else if (roles.includes('PRINCIPAL')) dashboardLink = '/principal/dashboard'
    else if (roles.includes('HOD')) dashboardLink = '/hod/dashboard'
    else if (roles.includes('CLUB_HEAD')) dashboardLink = '/club/dashboard'
    else if (roles.includes('FACULTY_ADVISOR')) dashboardLink = '/faculty-advisor/dashboard'
    else dashboardLink = '/student/dashboard'
  }

  return (
    <div className="relative flex flex-col pb-24 bg-transparent overflow-x-hidden">
      {/* Global Transparent Mask spanning the whole page. No backdrop-blur because it causes lag over SVGs */}
      <div className="fixed inset-0 bg-black/70 pointer-events-none z-0" />

      {/* Hero Section (Includes the Fixed Background Animation) */}
      <HeroGlobe />

      {/* 
        The background animation lasts for the whole scroll height of the document.
        We space out the content so it overlays the mechanical drawing at different points.
      */}

      {/* Action Buttons */}
      <div style={{ height: '30vh' }} />
      <section className="w-full z-10 relative pb-10 flex flex-col items-center justify-center gap-10 px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
            <span className="text-white">NSSCE</span>{' '}
            <span className="text-[#ff2a00]">EVENTS</span><br className="hidden md:block"/>
            <span className="text-white"> MANAGEMENT</span>{' '}
            <span className="text-[#ff2a00]">PORTAL</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={dashboardLink}>
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Go to Dashboard
            </button>
          </a>
          {roles.includes('CLUB_HEAD') && (
            <a href="/map">
              <button className="px-8 py-4 bg-transparent/40 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition backdrop-blur-md hover:scale-105 duration-300">
                Campus Map
              </button>
            </a>
          )}
        </div>
      </section>

      {/* Events Marquee Section */}
      <div style={{ height: '20vh' }} />
      <section className="w-full z-10 overflow-hidden relative pb-10">
        <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-white tracking-tight drop-shadow-md">Latest Events</h2>
          <a href="/events" className="text-sm text-white/70 hover:text-white transition-colors">
            View all events
          </a>
        </div>
        
        {events && events.length > 0 ? (
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap gap-6 pl-6">
              {[...events, ...events].map((event: any, index: number) => (
                <div key={`${event.id}-${index}`} className="flex-none w-80 h-[320px] flex flex-col border border-white/10 bg-[#0A0A0A] rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 shadow-xl">
                  <div className="h-48 w-full relative overflow-hidden bg-white/5">
                    {event.event_posts?.[0]?.poster_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={event.event_posts[0].poster_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-semibold uppercase tracking-widest">
                        No Poster
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 whitespace-normal">
                    <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2">
                      {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2 leading-tight line-clamp-1">{event.title}</h3>
                    <div className="text-sm text-white/50 mt-auto truncate">
                      {event.venues?.name || 'Venue TBA'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="border border-white/10 bg-white/5 rounded-2xl p-12 text-center">
              <p className="text-white/50">No events found.</p>
            </div>
          </div>
        )}
      </section>

      {/* Biggie Event Section */}
      <div style={{ height: '30vh' }} />
      <section className="container mx-auto px-6 max-w-6xl z-10 relative pb-10">
        <h2 className="text-4xl font-black italic text-white tracking-tighter mb-8 text-[#ff2a00] drop-shadow-[0_0_15px_rgba(255,42,0,0.5)] uppercase">
          Biggie Event!
        </h2>
        {events && events.length > 0 ? (
          <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-[#ff2a00]/50 transition-colors duration-500 shadow-2xl relative group">
            {/* Spotlight gradient effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,42,0,0.15)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden bg-transparent/50">
              {events[0].event_posts?.[0]?.poster_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={events[0].event_posts[0].poster_url} 
                  alt={events[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">
                  No Poster Available
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="text-xs font-bold text-[#ff2a00] uppercase tracking-widest mb-4 border border-[#ff2a00]/30 inline-block px-3 py-1 rounded-full self-start">
                Most Participants Past Week
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{events[0].title}</h3>
              <div className="text-white/60 mb-8 max-w-md line-clamp-3">
                {events[0].description || "Join hundreds of students in this week's most anticipated event. Don't miss out on the biggest gathering on campus!"}
              </div>
              <div className="flex gap-6 items-center mt-auto">
                <div className="text-white/40 text-sm flex flex-col">
                  <span className="font-bold text-white/80">Date</span>
                  {new Date(events[0].start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="text-white/40 text-sm flex flex-col">
                  <span className="font-bold text-white/80">Venue</span>
                  {events[0].venues?.name || 'TBA'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-white/10 bg-white/5 rounded-2xl p-12 text-center text-white/50">
            No events found.
          </div>
        )}
      </section>

      {/* Roles Section */}
      <div style={{ height: '30vh' }} />
      <section className="w-full z-10 relative pb-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-3 drop-shadow-md">Role-based Access</h2>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed drop-shadow-sm">
              A comprehensive permission system tailored for every user type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Admin', desc: 'Manage users, roles, departments, and venue records system-wide.' },
              { title: 'Principal', desc: 'Final approval for events across the campus.' },
              { title: 'HOD', desc: 'Department-level venue management and approvals.' },
              { title: 'Staff Coordinator', desc: 'Initial approval for events and venues before forwarding to HOD.' },
              { title: 'Club Head', desc: 'Create events, book venues, and track approvals.' },
              { title: 'Student', desc: 'Browse, register, and attend events.' },
            ].map((role) => (
              <div key={role.title} className="p-6 border border-white/10 bg-[#0A0A0A] rounded-2xl hover:bg-white/5 transition-colors">
                <h3 className="text-base font-medium text-white mb-2">{role.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* NSSCE Secrets Section */}
      <div style={{ height: '30vh' }} />
      <section className="w-full z-10 relative pb-10">
        <div className="container mx-auto px-8 max-w-2xl text-center">
          <a href="/confessions">
            <div className="p-10 md:p-14 border border-white/10 bg-[#0A0A0A] rounded-[2rem] hover:border-white/30 transition-all duration-500 shadow-2xl relative group cursor-pointer overflow-hidden z-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,0,0.1)_0%,transparent_60%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 group-hover:scale-105 transition-all duration-500">
                <span className="text-yellow-400">NSSCE</span> <span className="text-white">SECRETS</span>
              </h2>
              <p className="text-white/50 text-sm tracking-widest uppercase">
                Share your secrets.
              </p>
            </div>
          </a>
          
          {/* Blurred Masked Secrets */}
          <div className="mt-8 space-y-4 relative z-10 -translate-y-8 pt-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030406]/40 to-[#030406]/90 z-10 pointer-events-none" />
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[1px] opacity-80">
              "Someone please tell the guy in mechanical engineering to stop revving his bike during lab..."
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[1.5px] opacity-70">
              "I accidentally took someone's lab coat from the chemistry lab and I'm too scared to return it."
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[2px] opacity-60">
              "I have a massive crush on the girl who always sits in the front row of CS201."
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[2.5px] opacity-50">
              "To the person who returned my lost flash drive to the office... you literally saved my semester."
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[3px] opacity-40">
              "I pretend I'm reading a PDF on my phone but I'm actually just playing Subway Surfers in the back row."
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-left blur-[3.5px] opacity-30">
              "I think the college cats are secretly running the administration."
            </div>
          </div>
        </div>
      </section>
      
      {/* Final spacer to allow animation to complete its final zoom exactly when the user reaches the absolute bottom */}
      <div style={{ height: '50vh' }} />
      
      {/* Add Marquee CSS inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  )
}

