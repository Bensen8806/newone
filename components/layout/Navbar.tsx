import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

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

  let dashboardLink = '/student/dashboard'
  if (isAdmin) dashboardLink = '/admin/dashboard'
  else if (isPrincipal) dashboardLink = '/principal/dashboard'
  else if (isHod) dashboardLink = '/hod/dashboard'
  else if (isClubHead) dashboardLink = '/club/dashboard'

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.jpg" alt="NSSCE Logo" width={250} height={60} className="object-contain" priority />
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link href="/events" className={buttonVariants({ variant: "ghost" })}>
                Main Feed
              </Link>
              {(isAdmin || isPrincipal || isHod || isClubHead) && (
                <Link href="/map" className={buttonVariants({ variant: "ghost" })}>
                  Campus Map
                </Link>
              )}
              <Link href={dashboardLink}>
                <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.name ? profile.name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
          {!user && (
            <Link href="/login" className={buttonVariants({ variant: "default" })}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
