import { Database } from '@/lib/supabase/database.types'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type User = Tables<'users'>
export type Department = Tables<'departments'>
export type Club = Tables<'clubs'>
export type Venue = Tables<'venues'>
export type Event = Tables<'events'>
export type Approval = Tables<'approvals'>
export type Registration = Tables<'registrations'>
export type Certificate = Tables<'certificates'>
export type Notification = Tables<'notifications'>
export type EventPost = Tables<'event_posts'>

export type UserRole = 'ADMIN' | 'PRINCIPAL' | 'HOD' | 'FACULTY_ADVISOR' | 'CLUB_HEAD' | 'STUDENT'
export type EventStatus = 'DRAFT' | 'PENDING_FACULTY_REVIEW' | 'PENDING_HOD' | 'PENDING_PRINCIPAL' | 'PRINCIPAL_MEET_REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'ARCHIVED'
export type ApprovalAction = 'APPROVE' | 'REJECT'
export type RegistrationStatus = 'REGISTERED' | 'WAITLISTED' | 'CANCELLED'
export type CertificateType = 'PARTICIPATION' | 'COMPLETION'

export interface EventWithDetails extends Event {
  club?: Club
  venue?: Venue
  approvals?: Approval[]
}

export interface VenueWithDept extends Venue {
  departments?: Pick<Department, 'name' | 'hod_user_id'> | null
}
