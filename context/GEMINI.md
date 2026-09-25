# NSSCE Palakkad — Event Management & Venue Booking System
## AI Context File (GEMINI.md)

> This file provides full project context for the AI coding assistant.
> Keep this file updated as the project evolves.
> Last Updated: 2026-09-07 | Version: 1.0

---

## Project Identity

| Field | Value |
|---|---|
| **Project Name** | NSSCE Event Management & Venue Booking System |
| **Institution** | NSS College of Engineering (NSSCE), Akathethara, Palakkad, Kerala |
| **Affiliation** | APJ Abdul Kalam Technological University (KTU) |
| **Type** | Standalone Web Application |
| **Purpose** | Role-based event calendar, venue booking, multi-level approval, student registration, certificate generation |
| **Goal** | Eliminate paper-based event management; ensure full transparency across roles |

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Full-stack; use Server Components by default |
| **Database** | PostgreSQL via Supabase | Use Supabase client; enable RLS on all tables |
| **Auth** | Supabase Auth | Email-based; restrict to @nssce.ac.in domains |
| **Styling** | Tailwind CSS + shadcn/ui | Use shadcn components; custom theme in tailwind.config |
| **Campus Map** | Custom SVG (interactive) | Inline SVG; venue elements have IDs matching venues.svg_element_id |
| **PDF Certs** | @react-pdf/renderer | Server-side generation preferred |
| **Notifications** | Supabase Realtime + Resend (email) | In-app via Realtime channels; email via Resend API |
| **Hosting** | Vercel | Use Edge Runtime where possible |
| **Language** | TypeScript (strict mode) | All files .tsx / .ts; no any types |

---

## Branding & Design Tokens

```
Primary Color   : Deep Maroon  → #7B1C1C (NSS brand color)
Accent Color    : Gold         → #C9A84C
Background      : Off-white    → #FAF8F5
Text            : Dark gray    → #1A1A1A
Success         : Green        → #16A34A
Warning         : Amber        → #D97706
Error           : Red          → #DC2626
Font            : Inter (primary), Poppins (headings)
Logo            : NSSCE logo + KTU logo in header
Motto           : "Uddhared atmanAtmanam"
```

---

## User Roles (RBAC)

```
ADMIN        → Full system access. Manage users, roles, venues, departments.
PRINCIPAL    → View all events. Final approval/rejection with remark.
HOD          → Review venue requests for their department. Approve/reject with remark.
CLUB_HEAD    → Create events. Select venues. Track approval status. Mark attendance.
STUDENT      → Browse approved events. Register. Download certificates.
```

> A user can hold multiple roles (e.g., a Club Head is also a Student).
> The `role` field is an array/enum. Route protection is middleware-based.

---

## Project File Structure

```
/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/               # Login page (unified, role-detected)
│   ├── (dashboard)/
│   │   ├── club/                # Club Head area
│   │   │   ├── events/          # My events + statuses
│   │   │   ├── new-event/       # Create event + venue map picker
│   │   │   └── event/[id]/      # Event detail + approval trail
│   │   ├── hod/                 # HOD area
│   │   │   ├── requests/        # Pending venue requests
│   │   │   └── request/[id]/    # Review + approve/reject
│   │   ├── principal/           # Principal area
│   │   │   ├── requests/        # HOD-approved events awaiting final approval
│   │   │   └── request/[id]/    # Review + approve/reject
│   │   └── student/             # Student area
│   │       ├── profile/         # Registered events
│   │       └── certificates/    # Download certificates
│   ├── events/                  # Public event calendar (all approved)
│   │   └── [id]/                # Event detail + student registration
│   ├── map/                     # Interactive campus map
│   ├── pipeline/                # Transparency board (all roles)
│   ├── admin/                   # Admin panel
│   ├── api/                     # API routes
│   │   ├── events/
│   │   ├── venues/
│   │   ├── approvals/
│   │   ├── registrations/
│   │   ├── certificates/
│   │   └── notifications/
│   ├── layout.tsx               # Root layout with NSSCE branding
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── map/                     # Campus SVG map components
│   │   ├── CampusMap.tsx        # Main interactive SVG map
│   │   ├── VenueMarker.tsx      # Individual venue overlay
│   │   └── VenuePanel.tsx       # Slide-out venue detail panel
│   ├── events/                  # Event-related components
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── ApprovalTrail.tsx    # Audit trail display
│   │   └── StatusBadge.tsx      # Event status pill
│   ├── certificates/
│   │   └── CertificateTemplate.tsx  # @react-pdf/renderer template
│   ├── pipeline/
│   │   └── PipelineBoard.tsx    # Kanban/timeline transparency view
│   └── notifications/
│       └── NotificationBell.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   ├── server.ts            # Server Supabase client (SSR)
│   │   └── middleware.ts        # Auth middleware
│   ├── types/
│   │   └── index.ts             # All TypeScript types/interfaces
│   ├── utils/
│   │   ├── venue-conflicts.ts   # Conflict detection logic
│   │   ├── approval-router.ts   # Routes approvals to correct HOD
│   │   └── certificate-gen.ts   # PDF certificate generation
│   └── constants/
│       ├── venues.ts            # Venue data with SVG IDs
│       ├── departments.ts       # Department data
│       └── clubs.ts             # Club data
├── public/
│   ├── campus-map.svg           # NSSCE campus blueprint SVG
│   ├── nssce-logo.png
│   └── ktu-logo.png
├── supabase/
│   ├── migrations/              # SQL migrations
│   └── seed.sql                 # Seed data (depts, venues, clubs)
├── middleware.ts                 # Next.js middleware (auth + RBAC)
├── GEMINI.md                    # This file
└── NSSCE_EventSystem_Workflow_Requirements.txt  # Full requirements reference
```

---

## Database Schema

### Tables

```sql
-- Users
users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,          -- must be @nssce.ac.in or @student.nssce.ac.in
  role TEXT[],                -- array: ['STUDENT', 'CLUB_HEAD']
  department_id UUID REFS departments,
  roll_number TEXT,           -- students only
  created_at TIMESTAMPTZ
)

-- Departments
departments (
  id UUID PRIMARY KEY,
  name TEXT,                  -- e.g., "Computer Science & Engineering"
  code TEXT,                  -- e.g., "CS"
  hod_user_id UUID REFS users
)

-- Clubs
clubs (
  id UUID PRIMARY KEY,
  name TEXT,                  -- e.g., "IEEE Student Chapter"
  type TEXT,                  -- PROFESSIONAL | INNOVATION | SOCIAL | CULTURAL | SPORTS
  head_user_id UUID REFS users
)

-- Venues
venues (
  id UUID PRIMARY KEY,
  name TEXT,
  department_id UUID REFS departments,  -- determines which HOD approves
  capacity INT,
  features JSONB,             -- {ac: bool, projector: bool, smartboard: bool, pa_system: bool}
  svg_element_id TEXT         -- matches SVG element ID in campus-map.svg
)

-- Events
events (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  club_id UUID REFS clubs,
  club_head_id UUID REFS users,
  venue_id UUID REFS venues,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  expected_attendance INT,
  category TEXT,              -- TECHNICAL | CULTURAL | SPORTS | SOCIAL | WORKSHOP
  ktu_activity_points_category TEXT,   -- nullable
  status TEXT,                -- DRAFT | PENDING_HOD | PENDING_PRINCIPAL | APPROVED | REJECTED | COMPLETED | ARCHIVED
  special_requirements TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Approvals (audit trail)
approvals (
  id UUID PRIMARY KEY,
  event_id UUID REFS events,
  approver_id UUID REFS users,
  approver_role TEXT,         -- HOD | PRINCIPAL
  action TEXT,                -- APPROVE | REJECT
  remark TEXT NOT NULL,       -- ALWAYS required
  actioned_at TIMESTAMPTZ
)

-- Registrations
registrations (
  id UUID PRIMARY KEY,
  event_id UUID REFS events,
  student_id UUID REFS users,
  registered_at TIMESTAMPTZ,
  status TEXT,                -- REGISTERED | WAITLISTED | CANCELLED
  attended BOOLEAN DEFAULT false
)

-- Certificates
certificates (
  id UUID PRIMARY KEY,
  registration_id UUID REFS registrations,
  type TEXT,                  -- PARTICIPATION | COMPLETION
  verification_code TEXT UNIQUE,  -- used in QR code
  issued_at TIMESTAMPTZ
)

-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFS users,
  type TEXT,                  -- SUBMISSION | APPROVAL | REJECTION | REMINDER | REGISTRATION
  message TEXT,
  event_id UUID REFS events,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
)
```

---

## Event Status Flow

```
DRAFT
  └─► PENDING_HOD         (on Club Head submit)
        ├─► REJECTED       (on HOD reject → notifies Club Head with remark)
        └─► PENDING_PRINCIPAL  (on HOD approve)
              ├─► REJECTED  (on Principal reject → notifies Club Head with both remarks)
              └─► APPROVED  (on Principal approve → event published)
                    └─► COMPLETED  (on Club Head mark complete)
                          └─► ARCHIVED  (after grace period)
```

> Club Head can edit and re-submit from any REJECTED state.

---

## Venue Data (Static Constants)

```typescript
// lib/constants/venues.ts
export const VENUES = [
  { id: 'V01', name: 'Main Auditorium',       dept: 'ADM', capacity: 800,      svgId: 'venue-auditorium'  },
  { id: 'V02', name: 'Main Seminar Hall',      dept: 'ADM', capacity: 100,      svgId: 'venue-main-seminar'},
  { id: 'V03', name: 'CS Seminar Hall',        dept: 'CS',  capacity: 100,      svgId: 'venue-cs'         },
  { id: 'V04', name: 'ECE Seminar Hall',       dept: 'EC',  capacity: 100,      svgId: 'venue-ece'        },
  { id: 'V05', name: 'EEE Seminar Hall',       dept: 'EE',  capacity: 60,       svgId: 'venue-eee'        },
  { id: 'V06', name: 'ME Seminar Hall',        dept: 'ME',  capacity: 60,       svgId: 'venue-me'         },
  { id: 'V07', name: 'CE Seminar Hall',        dept: 'CE',  capacity: 100,      svgId: 'venue-ce'         },
  { id: 'V08', name: 'IC Seminar Hall',        dept: 'IC',  capacity: 60,       svgId: 'venue-ic'         },
  { id: 'V09', name: 'Outdoor Stadium',        dept: 'ADM', capacity: 2000,     svgId: 'venue-outdoor'    },
  { id: 'V10', name: 'Indoor Stadium',         dept: 'ADM', capacity: 200,      svgId: 'venue-indoor'     },
  { id: 'V11', name: 'Open Ground/Courtyard',  dept: 'ADM', capacity: 9999,     svgId: 'venue-ground'     },
]
```

---

## Department Data (Static Constants)

```typescript
// lib/constants/departments.ts
export const DEPARTMENTS = [
  { code: 'CE',  name: 'Civil Engineering'                       },
  { code: 'CS',  name: 'Computer Science & Engineering'          },
  { code: 'EC',  name: 'Electronics & Communication Engineering' },
  { code: 'EE',  name: 'Electrical & Electronics Engineering'    },
  { code: 'IC',  name: 'Instrumentation & Control Engineering'   },
  { code: 'ME',  name: 'Mechanical Engineering'                  },
  { code: 'BS',  name: 'Basic Sciences & Humanities'             },
  { code: 'ADM', name: 'Administration'                          },
]
```

---

## Club Data (Static Constants)

```typescript
// lib/constants/clubs.ts
export const CLUBS = [
  { name: 'IEEE Student Chapter',       type: 'PROFESSIONAL' },
  { name: "IE(I) Students Chapter",     type: 'PROFESSIONAL' },
  { name: 'SAEINDIA',                   type: 'PROFESSIONAL' },
  { name: 'ISTE',                       type: 'PROFESSIONAL' },
  { name: 'IIC',                        type: 'PROFESSIONAL' },
  { name: 'iEDC',                       type: 'INNOVATION'   },
  { name: 'TinkerHub',                  type: 'INNOVATION'   },
  { name: 'NSS',                        type: 'SOCIAL'       },
  { name: 'Women Development Cell',     type: 'SOCIAL'       },
  { name: 'Music Club',                 type: 'CULTURAL'     },
  { name: 'Dance Club',                 type: 'CULTURAL'     },
  { name: 'Literature Club',            type: 'CULTURAL'     },
  { name: 'Sports Club',                type: 'SPORTS'       },
]
```

---

## Key Business Rules (Enforce These Always)

1. **Venue conflicts**: An approved event blocks a venue. Check `events` table for overlapping `(venue_id, start_time, end_time)` with status `APPROVED`.
2. **Remark is MANDATORY**: Both HOD and Principal must provide a remark — enforce at DB level (NOT NULL) and UI level.
3. **HOD routing**: When an event is submitted, look up `venues.department_id → departments.hod_user_id` to find which HOD to notify.
4. **HOD sees only their dept venues**: Filter HOD's request list by `venues.department_id = HOD's department_id`.
5. **Principal sees only HOD-approved**: Filter Principal's list to `events.status = 'PENDING_PRINCIPAL'`.
6. **Certificate QR**: Each certificate has a `verification_code` (UUID). A public `/verify/[code]` route returns certificate authenticity.
7. **Re-submission**: Editing and resubmitting a rejected event creates a fresh approval cycle. Old approvals are preserved with their `event_id`.
8. **Capacity enforcement**: `registrations count WHERE event_id = X AND status = 'REGISTERED' < venues.capacity` — enforce before creating registration.
9. **Waitlist**: When capacity is full, create registration with `status = 'WAITLISTED'`. On cancellation, promote first waitlisted.
10. **KTU Activity Points**: Every event must have `ktu_activity_points_category` — nullable if not applicable, but UI should prompt.

---

## Coding Conventions

- **TypeScript**: Strict mode. No `any`. Define all types in `lib/types/index.ts`.
- **Server vs Client**: Default to Server Components. Use `'use client'` only when needed (interactivity, hooks).
- **Data fetching**: Use Supabase server client in Server Components. Use React Query / SWR on client for real-time.
- **Error handling**: Always handle Supabase errors. Return typed `{ data, error }` from server actions.
- **Server Actions**: Use Next.js Server Actions for mutations (form submissions, approvals, registrations).
- **Environment variables**: All Supabase keys in `.env.local`. Never expose service role key to client.
- **Naming**: camelCase for variables/functions, PascalCase for components/types, SCREAMING_SNAKE for constants/enums.
- **Comments**: Comment business logic and non-obvious decisions. Keep comments updated.
- **Accessibility**: All interactive elements must have `aria-label`. Use semantic HTML.

---

## Environment Variables Required

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server only — never expose to client
RESEND_API_KEY=                  # Email notifications
NEXT_PUBLIC_APP_URL=             # e.g., https://nssce-events.vercel.app
```

---

## Pages & Routes Reference

```
/                          Landing page
/login                     Unified login
/events                    Public event calendar (approved events)
/events/[id]               Event detail + student registration
/map                       Interactive campus map (venue availability)
/pipeline                  Transparency board (all event statuses)
/verify/[code]             Certificate verification (public)

/club/events               Club Head: my events
/club/new-event            Club Head: create event
/club/event/[id]           Club Head: event detail + trail

/hod/requests              HOD: pending venue requests
/hod/request/[id]          HOD: review and decide

/principal/requests        Principal: HOD-approved awaiting final decision
/principal/request/[id]    Principal: review and decide

/student/profile           Student: registered events
/student/certificates      Student: download certificates

/admin                     Admin panel: users, roles, venues, departments

/api/events/...            REST API (if needed alongside server actions)
/api/certificates/[code]   Certificate PDF download
/api/notifications/...     Notification endpoints
```

---

## Important Reference Files

- Full requirements: `NSSCE_EventSystem_Workflow_Requirements.txt`
- This context file: `GEMINI.md`

---

## Out of Scope (v1.0)

- KTU e-Governance portal API integration (no public API exists)
- Real-time video/hybrid event streaming
- Budget/finance management
- External (non-NSSCE) event submissions
- Native mobile app (iOS/Android)

---

## Change Log

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-09-07 | Initial context file created |
| | | _[add future updates here]_ |
