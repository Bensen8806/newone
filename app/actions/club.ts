'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateClubDetails(formData: FormData) {
  // Use anon client just to verify the user is logged in
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Extract raw form data exactly as submitted
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const faculty_advisor_id = formData.get('faculty_advisor_id') as string
  const department_id = formData.get('department_id') as string
  const email = formData.get('email') as string
  const logo_url = formData.get('logo_url') as string

  // We use the adminClient to guarantee writes to the database bypass any RLS or
  // anon-role schema cache issues that may be silently dropping the logo_url column.
  const adminClient = createAdminClient()

  // Update Users Table (email) and ensure they have CLUB_HEAD role
  if (email) {
    const { data: userData, error: fetchError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (fetchError) throw fetchError

    const currentRoles = userData?.role || []
    const updatedRoles = currentRoles.includes('CLUB_HEAD') 
      ? currentRoles 
      : [...currentRoles, 'CLUB_HEAD']

    const { error: userError } = await adminClient
      .from('users')
      .update({ email, role: updatedRoles })
      .eq('id', user.id)
    
    if (userError) throw userError
  }

  // Check if club exists
  const { data: club } = await adminClient
    .from('clubs')
    .select('id')
    .eq('head_user_id', user.id)
    .maybeSingle()

  // Simple, direct mapping of form data to database columns
  const clubData = {
    name: name,
    type: type,
    logo_url: logo_url || null,
    faculty_advisor_id: faculty_advisor_id || null,
    department_id: department_id || null,
    head_user_id: user.id
  }

  if (club) {
    // Update existing
    const { error: clubError } = await adminClient
      .from('clubs')
      .update(clubData)
      .eq('id', club.id)
    if (clubError) throw clubError
  } else {
    // Insert new
    const { error: clubError } = await adminClient
      .from('clubs')
      .insert([clubData])
    if (clubError) throw clubError
  }

  revalidatePath('/club/dashboard')
  revalidatePath('/clubs')
}
