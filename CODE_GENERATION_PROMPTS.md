# Code Generation Prompts for "light-a-diya"

This document contains a series of prompts to guide a code generation agent in building the "light-a-diya" application.

**Project Context:**
*   **Objective:** A real-time, collaborative web app for users to light virtual diyas together in a shared "Celebration" room.
*   **Tech Stack:** Next.js (App Router), Supabase (Auth, DB, Real-time), Tailwind CSS.
*   **Database Schema:**
    *   `celebrations` (id, name, host_user_id)
    *   `diyas` (id, celebration_id, diya_position, lit_by_user_id, lit_by_anonymous_name)

---

## Phase 1: Project Setup & Supabase Client

### Prompt 1.1: Initialize Next.js Project
"Generate the command to create a new Next.js 14+ project named 'light-a-diya' using the App Router, TypeScript, and Tailwind CSS."

### Prompt 1.2: Create Supabase Client
"Create the code for a Supabase client utility file located at `/src/lib/supabase.ts`. It should use environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to initialize the client for use in a Next.js application."

### Prompt 1.3: Setup Environment Variables
"Show me an example `.env.local` file for this project. It should include placeholders for the Supabase URL and Anon Key."

---

## Phase 2: Authentication & User Context

### Prompt 2.1: Create a User Context
"Generate the code for a React Context to manage the user's session from Supabase. The file should be at `/src/context/UserContext.tsx`. It needs to:
1.  Define a context that provides the user object and a loading state.
2.  Create a `UserProvider` component that:
    *   Fetches the current user session from Supabase on initial load.
    *   Uses `supabase.auth.onAuthStateChange` to listen for login/logout events and update the context value accordingly.
3.  Include a custom hook `useUser` for easy consumption of the context."

### Prompt 2.2: Create the Login/Logout Button
"Generate the code for a client component named `AuthButton.tsx` at `/src/components/AuthButton.tsx`.
*   It should use the `useUser` hook.
*   If the user is logged in, it should display their email and a 'Logout' button. The logout button should call `supabase.auth.signOut()`.
*   If the user is not logged in, it should display a 'Login with Google' button. This button should call `supabase.auth.signInWithOAuth({ provider: 'google' })`."

### Prompt 2.3: Integrate the User Provider
"Show me how to integrate the `UserProvider` into the root layout file at `/src/app/layout.tsx` so that the entire application has access to the user's session."

---

## Phase 3: Home Page & Celebration Creation

### Prompt 3.1: Create the Home Page
"Generate the code for the home page at `/src/app/page.tsx`.
*   It should be a server component.
*   It should include a welcoming title and a short description of the app.
*   It must render the `AuthButton` component.
*   It should also render a new client component, `CreateCelebrationButton.tsx`, which will handle the creation logic."

### Prompt 3.2: Create the 'Create Celebration' Button and Modal
"Generate the code for the `CreateCelebrationButton.tsx` client component.
*   It should use the `useUser` hook and only be visible if the user is logged in.
*   Clicking the button should open a modal.
*   The modal should contain a simple form with one text input for 'Celebration Name' and a 'Create' button.
*   On form submission, it should:
    1.  Call a function to insert a new row into the Supabase `celebrations` table with the name and the current user's ID as `host_user_id`.
    2.  Use the Next.js `useRouter` to navigate the user to the new celebration page, for example `/c/[new_celebration_id]`."

---

## Phase 4: The Celebration Page (Real-time Display)

### Prompt 4.1: Create the Dynamic Page Structure
"Generate the code for the dynamic celebration page at `/src/app/c/[celebrationId]/page.tsx`. This should be a server component. Its purpose is to fetch the initial data for the celebration. It should:
1.  Get the `celebrationId` from the page `params`.
2.  Fetch the celebration's name from the `celebrations` table.
3.  Fetch all the corresponding lit diyas from the `diyas` table for that `celebrationId`.
4.  Pass this initial data as props to a client component called `CelebrationClient.tsx`."

### Prompt 4.2: Create the Main Client Component
"Generate the code for `CelebrationClient.tsx`. This component is the core of the real-time experience. It should:
1.  Accept `initialCelebration` and `initialDiyas` as props.
2.  Use `useState` to store the list of lit diyas, initialized with `initialDiyas`.
3.  Use a `useEffect` hook to subscribe to inserts on the `diyas` table for the current `celebrationId` using `supabase.channel(...)`.
4.  When a new insert event is received from the subscription, it should update the local state by adding the new diya to the list.
5.  Render the celebration name and a `DiyaGrid.tsx` component, passing the lit diyas data to it."

### Prompt 4.3: Create the Diya Grid
"Generate the code for `DiyaGrid.tsx`.
*   It should define a total number of diyas (e.g., `const TOTAL_DIYAS = 10;`).
*   It should accept the list of `litDiyas` as a prop.
*   It should render a grid (using Tailwind CSS grid layout) of `TOTAL_DIYAS` `Diya.tsx` components.
*   It needs to map through the numbers 1 to 10. For each number, it should check if a corresponding diya exists in the `litDiyas` prop and pass the correct `isLit` and `litBy` props to the `Diya` component."

---

## Phase 5: Core Interaction (Lighting a Diya)

### Prompt 5.1: Create the Diya Component
"Generate the code for the `Diya.tsx` component. It should:
1.  Accept the following props: `position` (number), `isLit` (boolean), `litBy` (string), and `onLight` (a function to call when an unlit diya is clicked).
2.  Render a visually distinct state for a lit vs. unlit diya (e.g., different colors or an SVG icon).
3.  If `isLit` is true, it should display the `litBy` name below the diya.
4.  If `isLit` is false, the component should be clickable, and clicking it should call the `onLight(position)` function."

### Prompt 5.2: Implement the Lighting Logic
"Update the `CelebrationClient.tsx` component with a function called `handleLightDiya(position)`. This function will be passed down to the `DiyaGrid` and `Diya` components. The function should:
1.  Check if the user is logged in using the `useUser` hook.
2.  If logged in, call `supabase.from('diyas').insert(...)` with the `celebration_id`, `diya_position`, and the user's ID.
3.  If not logged in, it should open an 'Enter Your Name' modal (we'll call it `AnonymousNamePrompt.tsx`).
4.  After the anonymous user submits their name, it should perform the same Supabase insert, but using the `lit_by_anonymous_name` field instead."

### Prompt 5.3: Create the Anonymous Name Prompt Modal
"Generate the code for the `AnonymousNamePrompt.tsx` component. It should be a simple modal with a text input and a 'Light Diya' button. When the user submits their name, it should call a function passed in via props (e.g., `onSubmit(name)`)."
