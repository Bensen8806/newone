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

  // Authorize all users except those whose only role is STUDENT
  const isAuthorized = roles.some(role => role !== 'STUDENT')

  if (!isAuthorized) {
    redirect('/student/dashboard')
  }

  return <>{children}</>
}
