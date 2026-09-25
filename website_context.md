# NSSCE Event Management & Venue Booking System - Website Context

This document provides a comprehensive overview of the NSSCE Event Management and Venue Booking System. This context is optimized for generating presentation slides that cover the system's functionalities, architecture, and workflows.

## 1. Project Overview & Tech Stack
**Goal:** A transparent, role-based web application to digitize the complete lifecycle of an event at NSS College of Engineering (NSSCE) — from a club head's initial idea to a student's downloaded certificate. It eliminates paper trails, prevents venue scheduling conflicts, and tracks KTU Activity Points.

**Tech Stack:**
*   **Framework:** Next.js 14 (App Router)
*   **Database & Auth:** Supabase (PostgreSQL, Row Level Security)
*   **Styling:** Tailwind CSS + shadcn/ui
*   **PDF Generation:** `@react-pdf/renderer` (Client-side / Memory-only)
*   **Email & Background Jobs:** Resend API + Background queuing (e.g., Inngest/QStash)

## 2. Core Functionalities

### A. Role-Based Access Control (RBAC)
The application has distinct dashboards and routing logic based on user roles:
*   **Students:** Browse events, register, view their registered events, download certificates.
*   **Club Heads:** Create event proposals, manage venues, mark attendance, generate/publish certificates.
*   **Head of Departments (HODs):** Gatekeepers for department venues. Review event proposals to approve/reject them.
*   **Principal:** Final authority. Reviews HOD-approved events for final publishing.
*   **Admin:** System administration, managing venues, roles, and campus-wide assets.

### B. Interactive Venue Booking
*   **Visual Campus Map:** Interactive SVG map of the campus showing available venues.
*   **Real-time Availability:** Venues are color-coded (Green = Available, Yellow = Pending, Red = Booked).
*   **Conflict Prevention:** Database-level constraints ensure no double-booking for the same venue at the same time.

### C. The Multi-Tier Approval Workflow
1.  **Draft:** Club head creates the proposal.
2.  **Pending HOD Review:** Auto-routed to the respective HOD based on the selected venue. HOD must leave a mandatory remark (Approve/Reject).
3.  **Pending Principal Review:** If approved by HOD, goes to the Principal for final approval with a mandatory remark.
4.  **Published:** Available for student registration.
*   *Note: Rejected events can be edited and re-submitted while keeping the audit trail.*

### D. Zero-Cost, Just-In-Time (JIT) Certificate Engine
*   **Zero Storage Costs:** Certificates are **never** saved as static PDF files on the server or in storage buckets. They exist only as database records.
*   **Browser-Side Rendering:** When a student requests their certificate, the PDF Blob is generated entirely in the browser memory using `@react-pdf/renderer` and local `.ttf` fonts.
*   **Dynamic Placements:** The certificate template dynamically adjusts border colors and text based on the placement (Participation, Completion, 1st Place, 2nd Place, 3rd Place).
*   **Historical Signature Integrity:** The PDF uses the signature of the Club Head *at the time of the event*, ensuring historical accuracy even after club leadership changes.
*   **QR Verification:** Each certificate has a unique QR code for authenticity verification.

### E. Attendance Gating & KTU Points
*   **Strict Gating:** Club Heads must manually mark `attended = true` for students; otherwise, no certificate is issued.
*   **KTU Activity Points:** Every event is tagged with a KTU activity segment (e.g., Segment 2: Professional, Segment 6: Cultural). The system generates consolidated activity points reports for easy university submission.

### F. Automated Master Backups
*   **Background Chunking:** When a Club Head finalizes an event, a background job queries all verified attendees and renders master PDFs in memory, chunking them into 50-page batches to avoid timeouts/attachment limits.
*   **Direct Delivery:** These batches are attached to an email via the Resend API and sent directly to the Club Head's college inbox for physical archiving.

## 3. UI/UX Highlights
*   **Transparency Pipeline:** A public Kanban-style pipeline board showing all events and their current approval stage.
*   **Full Audit Trail:** All approval actions, timestamps, and remarks are visible to prevent communication gaps.
*   **Responsive & Accessible:** Fully mobile-responsive with a bottom navigation bar, WCAG 2.1 AA compliance, and branding aligned with NSSCE guidelines (maroon/dark red & gold).

## Suggested Slide Structure for AI Generation:
1.  **Title Slide:** NSSCE Event Management & Venue Booking System
2.  **The Problem:** Paper trails, venue conflicts, untracked KTU points.
3.  **The Solution:** A unified digital ecosystem.
4.  **Tech Stack & Architecture:** Next.js, Supabase, JIT PDF Engine.
5.  **User Roles & Dashboards:** Student, Club Head, HOD, Principal.
6.  **Key Feature 1: Interactive Venue Booking:** Visual map and conflict prevention.
7.  **Key Feature 2: Multi-Tier Approval Workflow:** Transparent pipeline and audit trails.
8.  **Key Feature 3: Smart Certificate Generation:** Zero-cost, client-side rendering with dynamic placements & historical signatures.
9.  **Key Feature 4: KTU Activity Points & Attendance:** Streamlined compliance for students.
10. **Key Feature 5: Automated Master Backups:** Resend API integration for physical archiving.
11. **Conclusion & Future Scope:** (e.g., hybrid event streaming, budget management).
