# Supabase Setup Guide

Since you are new to Supabase, this guide will walk you through setting up a new project from scratch. Supabase is an open-source Firebase alternative that provides a Postgres database, authentication, instant APIs, and real-time subscriptions.

## 1. Create a Supabase Account
1. Go to [Supabase](https://supabase.com/) and click **Start your project**.
2. Sign in with GitHub or your preferred method.

## 2. Create a New Project
1. Once logged in, you will be taken to the dashboard. Click **New Project**.
2. Select your organization (or create a new one).
3. **Name your project**: `nssce-event-calendar` (or similar).
4. **Database Password**: Generate a secure password and save it somewhere safe. You will need it if you ever connect directly to the database via tools like pgAdmin or DBeaver.
5. **Region**: Choose a region closest to your users (e.g., Mumbai for India).
6. Click **Create new project**. It will take a few minutes to provision the database.

## 3. Get Your API Credentials
Once your project is ready, you need to grab the connection keys to link our Next.js app to Supabase.
1. In the Supabase dashboard, click the **Settings** (gear) icon in the bottom left sidebar.
2. Click on **API** under the Project Settings menu.
3. Under the **Project URL** section, copy the URL. This will be your `NEXT_PUBLIC_SUPABASE_URL`.
4. Under the **Project API keys** section, copy two keys:
   - **anon** `public`: This will be your `NEXT_PUBLIC_SUPABASE_ANON_KEY`. It is safe to expose in the browser.
   - **service_role** `secret`: This will be your `SUPABASE_SERVICE_ROLE_KEY`. **Never expose this to the browser/client-side.** It bypasses Row Level Security (RLS).

## 4. Set Up Local Environment Variables
Once we initialize the Next.js project, you will create a file named `.env.local` in the root of the project (`/home/katen/gits/event_calendar/.env.local`) and add the keys like this:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 5. Enable Email Authentication
1. Go to the **Authentication** section in the left sidebar of the Supabase dashboard.
2. Under **Providers**, ensure **Email** is enabled (it usually is by default).

## 6. What's Next?
You don't need to manually create tables in the Supabase dashboard right now. As part of our implementation, I will generate SQL migration files. We will apply these files via the Supabase CLI (or you can paste them into the SQL Editor in the Supabase Dashboard) to automatically create all the required tables and insert initial dummy data.
