import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isProtected = url.pathname.startsWith('/admin') || 
                      url.pathname.startsWith('/principal') || 
                      url.pathname.startsWith('/hod') || 
                      url.pathname.startsWith('/club') || 
                      url.pathname.startsWith('/student')

  if (!user && isProtected) {
    url.pathname = '/login'
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  if (user && url.pathname === '/login') {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
    const roles = data?.role || ['STUDENT']
    
    if (roles.includes('ADMIN')) url.pathname = '/admin/dashboard'
    else if (roles.includes('PRINCIPAL')) url.pathname = '/principal/dashboard'
    else if (roles.includes('HOD')) url.pathname = '/hod/dashboard'
    else if (roles.includes('CLUB_HEAD')) url.pathname = '/club/dashboard'
    else if (roles.includes('FACULTY_ADVISOR')) url.pathname = '/faculty-advisor/dashboard'
    else url.pathname = '/student/dashboard'

    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  return supabaseResponse
}
