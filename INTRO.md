# 🔥 light-a-diya

A real-time, collaborative web application that allows friends and family to light virtual diyas together in a shared space. This project is designed to connect loved ones during festive seasons like Diwali, allowing them to create and share a beautiful, collective experience no matter the distance.

**[Live Demo](https://your-project-url.vercel.app)** <!-- Replace with your actual deployed URL -->

---

## The Concept

In many cultures, lighting a lamp or diya is a symbol of hope, positivity, and togetherness. This app brings that tradition to the digital world. A user can create a unique "Celebration" page and share a link with their friends and family. Everyone who visits the link can light a diya, and the display updates instantly for all participants, showing who lit each light.

## Key Features

*   **Real-time Collaboration:** Diyas light up instantly for all users on the page without needing a refresh, powered by Supabase Realtime Subscriptions.
*   **Shareable Celebration Links:** Generate a unique link for your private group to share with anyone.
*   **Flexible Participation:** Users can join with their Google account to display their name, or participate instantly as an anonymous guest with a custom display name.
*   **Modern & Responsive UI:** A beautiful, mobile-first design built with Tailwind CSS that provides a seamless experience on any device.

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
*   **Backend & Database:** [Supabase](https://supabase.io/)
    *   **PostgreSQL Database:** For storing celebrations and diya states.
    *   **Supabase Auth:** For secure Google OAuth login.
    *   **Realtime Subscriptions:** For instant broadcasting of database changes to the client.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment:** [Vercel](https://vercel.com/)```
