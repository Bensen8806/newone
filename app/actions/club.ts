'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClubDetails(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const faculty_advisor_id = formData.get('faculty_advisor_id') as string
  const department_id = formData.get('department_id') as string
  const email = formData.get('email') as string

  // Update Users Table (email only)
  if (email) {
    const { error: userError } = await supabase
      .from('users')
      .update({ email })
      .eq('id', user.id)
    
    if (userError) throw userError
  }

  // Check if club exists
  const { data: club } = await supabase
    .from('clubs')
    .select('id')
    .eq('head_user_id', user.id)
    .single()

  const clubData = {
    name,
    type,
    faculty_advisor_id: faculty_advisor_id || null,
    department_id: department_id || null,
    head_user_id: user.id
  }

  if (club) {
    // Update existing
    const { error: clubError } = await supabase
      .from('clubs')
      .update(clubData)
      .eq('id', club.id)
    if (clubError) throw clubError
  } else {
    // Insert new
    const { error: clubError } = await supabase
      .from('clubs')
      .insert([clubData])
    if (clubError) throw clubError
  }

  revalidatePath('/club/dashboard')
  revalidatePath('/clubs')
}
