'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function approveRoleRequest(userId: string, requestedRole: string) {
  const adminClient = createAdminClient()
  
  // First, fetch the current roles
  const { data: user, error: fetchError } = await adminClient
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()
    
  if (fetchError) {
    console.error('Failed to fetch user roles:', fetchError)
    return
  }
  
  const currentRoles = user.role || []
  const newRoles = Array.from(new Set([...currentRoles, requestedRole]))
  
  // Update the user's role and clear requested_role
  const { error: updateError } = await adminClient
    .from('users')
    .update({ 
      role: newRoles,
      requested_role: null
    })
    .eq('id', userId)
    
  if (updateError) {
    console.error('Failed to approve role request:', updateError)
    return
  }
  
  revalidatePath('/admin/dashboard')
}

export async function rejectRoleRequest(userId: string) {
  const adminClient = createAdminClient()
  
  // Just clear the requested_role
  const { error: updateError } = await adminClient
    .from('users')
    .update({ 
      requested_role: null
    })
    .eq('id', userId)
    
  if (updateError) {
    console.error('Failed to reject role request:', updateError)
    return
  }
  
  revalidatePath('/admin/dashboard')
}
