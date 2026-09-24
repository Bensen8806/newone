## AI CONTEXT UPDATE: Zero-Cost Certificate & Email Backup Architecture

> **AI DIRECTIVE:** This section details the newly implemented certificate, attendance, and backup workflows. You must strictly enforce these zero-cost constraints and architectural rules in all generated code. Do not suggest saving static PDFs to a database or storage bucket.

---

### 1. Zero-Cost, Just-In-Time (JIT) Certificates
* **The Constraint:** Certificates exist **only** as database records (`registration_id`, `type`, `verification_code`). No `.pdf` files are ever saved to Supabase Storage.
* **Client-Side Generation:** When a student views their profile, use `@react-pdf/renderer` with Next.js dynamic imports (`next/dynamic`) to render the PDF Blob entirely in the browser memory for immediate download. 
* **Font Loading:** Explicitly register local `.ttf` fonts (`Font.register()`) in the PDF component to prevent network timeouts during generation.

### 2. Attendance Gating & Competition Placements
* **Attendance Enforcement:** Certificates are strictly gated. The UI must require the Club Head to mark `attended = true` in the `registrations` table before a certificate row is generated.
* **Dynamic Placements:** 
  * The `certificates.type` enum now accepts: `'PARTICIPATION'`, `'COMPLETION'`, `'FIRST_PLACE'`, `'SECOND_PLACE'`, and `'THIRD_PLACE'`.
  * **AI UI Requirement:** When the Club Head marks attendance, provide a dropdown to select placement (defaulting to Participation).
  * **AI PDF Requirement:** The `@react-pdf/renderer` template must dynamically read this `type` to alter the certificate's border color (e.g., Gold for First Place) and body text.

### 3. Historical Signature Integrity
* **The Logic:** Club leadership changes, but past certificates must retain the signature of the person who actually ran the event.
* **Implementation:** The `events` table stores `club_head_id`. When querying data for the PDF template, strictly join `events.club_head_id` with `users.signature_url` (where the transparent PNG is stored), rather than querying the club's *current* head.

### 4. Automated Master Backup (Resend API)
* **The Workflow:** Club Heads require a permanent physical backup of all issued certificates, but we cannot hit Vercel's 15s serverless timeout or Gmail's 25 MB attachment limit.
* **Background Processing:** When a Club Head clicks "Publish Certificates", trigger a background job (using Inngest or QStash). **Do not run this synchronously in an API route.**
* **Pagination Chunking:** The background job must query all verified attendees, render the master PDFs in memory, and chunk them into **50-page batch files**.
* **Direct Email Delivery:** The job uses the Resend API to attach these batched PDF files to a summary email, sending it directly to the Club Head's college inbox for permanent archiving.

---

### 5. Required Schema Additions

```sql
-- 1. Support for dynamic signatures
ALTER TABLE users ADD COLUMN signature_url TEXT;

-- 2. Expand Certificate Types for Competitions
-- Ensure application logic and DB constraints allow the following types for certificates:
-- 'PARTICIPATION' | 'COMPLETION' | 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE'