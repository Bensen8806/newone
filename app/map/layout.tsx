import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
  const roles: string[] = data?.role || ['STUDENT']

  // If the user is ONLY a STUDENT (i.e. does not have any of the required roles), redirect them.
  const isAuthorized = roles.includes('CLUB_HEAD') || roles.includes('HOD') || roles.includes('PRINCIPAL') || roles.includes('ADMIN')

  if (!isAuthorized) {
    redirect('/student/dashboard')
  }

  return <>{children}</>
}
