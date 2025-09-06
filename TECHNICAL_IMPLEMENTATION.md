# Technical Implementation Plan: Light a Diya

This document outlines the technical architecture and development plan for the `light-a-diya` project.

---

## 1. Technology Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
*   **Backend:** [Supabase](https://supabase.io/) (Database, Auth, and Real-time)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment:** [Vercel](https://vercel.com/)

## 2. Supabase Backend Setup

### A. Database Schema

Two primary tables will be created in the Supabase Postgres database.

1.  **`celebrations` Table:** Stores information about each shared room.
    *   `id` (uuid, Primary Key, default: `uuid_generate_v4()`)
    *   `created_at` (timestamp with time zone, default: `now()`)
    *   `name` (text, user-provided name like "Sharma Family Diwali")
    *   `host_user_id` (uuid, Foreign Key to `auth.users.id`)

2.  **`diyas` Table:** Stores the state of each lit diya.
    *   `id` (bigint, Primary Key, identity)
    *   `created_at` (timestamp with time zone, default: `now()`)
    *   `celebration_id` (uuid, Foreign Key to `celebrations.id`)
    *   `diya_position` (smallint, represents which diya in the layout was lit, e.g., 1-10)
    *   `lit_by_user_id` (uuid, nullable, Foreign Key to `auth.users.id`)
    *   `lit_by_anonymous_name` (text, nullable)
    *   **Constraint:** A `UNIQUE` constraint on `(celebration_id, diya_position)` to prevent the same diya from being lit twice.

### B. Authentication

*   The **Google** provider will be enabled in the Supabase Dashboard.
*   Vercel deployment URLs (including preview URLs) will be added to the list of allowed callback URLs.

### C. Row Level Security (RLS)

RLS will be enabled on both tables to ensure data security.

*   **`celebrations` Table Policies:**
    *   **READ:** Allow public read access for everyone (`SELECT` for `anon` and `authenticated` roles).
    *   **CREATE:** Allow only authenticated users to create new celebrations (`INSERT` for `authenticated` role).
*   **`diyas` Table Policies:**
    *   **READ:** Allow public read access for everyone (`SELECT` for `anon` and `authenticated` roles).
    *   **CREATE:** Allow any user (`anon` or `authenticated`) to insert a new row (`INSERT`). The unique constraint handles the game logic.

## 3. Frontend Architecture (Next.js)

### A. Project Structure
