'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function submitEventRequest(data: {
  title: string
  description: string
  venueId: string
  startIso: string
  endIso: string
  expectedAttendance: number
  category: string
  ktuPoints: boolean
  specialRequirements: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const adminClient = createAdminClient()

  const { data: club } = await adminClient
    .from('clubs')
    .select('id')
    .eq('head_user_id', user.id)
    .single()

  const { error } = await adminClient.from('events').insert({
    title: data.title,
    description: data.description,
    club_id: club?.id || null,
    club_head_id: user.id,
    venue_id: data.venueId,
    start_time: data.startIso,
    end_time: data.endIso,
    expected_attendance: data.expectedAttendance || 0,
    category: data.category || 'TECHNICAL',
    ktu_activity_points_category: data.ktuPoints ? 'YES' : null,
    status: 'PENDING_FACULTY_REVIEW',
    special_requirements: data.specialRequirements || ''
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/map')
  revalidatePath('/hod/requests')
  return { success: true }
}

export async function processEventAction(
  eventId: string,
  action: 'APPROVE' | 'REJECT' | 'MEET',
  role: 'FACULTY_ADVISOR' | 'HOD' | 'PRINCIPAL',
  remark: string,
  meetingDetails?: { time: string; reason: string }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  let newStatus = ''
  
  if (action === 'REJECT') {
    newStatus = 'REJECTED'
  } else if (action === 'MEET' && role === 'PRINCIPAL') {
    newStatus = 'PRINCIPAL_MEET_REQUESTED'
  } else if (action === 'APPROVE') {
    if (role === 'FACULTY_ADVISOR') newStatus = 'PENDING_HOD'
    else if (role === 'HOD') newStatus = 'PENDING_PRINCIPAL'
    else if (role === 'PRINCIPAL') newStatus = 'APPROVED'
  }

  if (!newStatus) return { error: 'Invalid action/role combination' }

  const updates: any = { status: newStatus }
  if (action === 'MEET' && meetingDetails) {
    updates.principal_meeting_time = meetingDetails.time
    updates.principal_meeting_reason = meetingDetails.reason
  }

  const adminClient = createAdminClient()

  // Update event
  const { error: eventError } = await adminClient
    .from('events')
    .update(updates)
    .eq('id', eventId)

  if (eventError) return { error: eventError.message }

  // Log approval
  const { error: approvalError } = await adminClient
    .from('approvals')
    .insert({
      event_id: eventId,
      approver_id: user.id,
      approver_role: role,
      action: action,
      remark: remark
    })

  if (approvalError) return { error: approvalError.message }

  revalidatePath('/map')
  revalidatePath(`/${role.toLowerCase()}/requests`)
  return { success: true }
}

export async function createEventPost(eventId: string, posterUrl: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('event_posts').insert({
    event_id: eventId,
    poster_url: posterUrl
  })

  if (error) return { error: error.message }
  
  revalidatePath('/') // Revalidate main feed
  return { success: true }
}
