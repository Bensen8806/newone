// Removed unused imports
import { createClient } from '@/lib/supabase/server'
import NavbarJelly from './NavbarJelly'

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let roles: string[] = []
  let profile = null
  
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    profile = data
    roles = data?.role || ['STUDENT']
  }

  const isAdmin = roles.includes('ADMIN')
  const isPrincipal = roles.includes('PRINCIPAL')
  const isHod = roles.includes('HOD')
  const isClubHead = roles.includes('CLUB_HEAD')
  const isFacultyAdvisor = roles.includes('FACULTY_ADVISOR')

  let dashboardLink = '/student/dashboard'
  if (isAdmin) dashboardLink = '/admin/dashboard'
  else if (isPrincipal) dashboardLink = '/principal/dashboard'
  else if (isHod) dashboardLink = '/hod/dashboard'
  else if (isClubHead) dashboardLink = '/club/dashboard'
  else if (isFacultyAdvisor) dashboardLink = '/faculty-advisor/dashboard'

  const showMap = isAdmin || isPrincipal || isHod || isClubHead || isFacultyAdvisor

  return <NavbarJelly user={user} dashboardLink={dashboardLink} showMap={showMap} />
}
