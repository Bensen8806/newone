import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'

export default async function FacultyAdvisorDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Faculty Advisor Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/faculty-advisor/requests">
            <Button>View Pending Approvals</Button>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="destructive">Log out</Button>
          </form>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
      </div>
    </div>
  )
}
