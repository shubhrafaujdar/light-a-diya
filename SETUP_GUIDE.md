# Required Accounts & Setup Instructions

Before you begin writing code for the `light-a-diya` project, you need to set up accounts for three essential services. This guide will walk you through creating and configuring each one.

**The three services and their roles are:**
1.  **GitHub:** To store your code (version control) and trigger automatic deployments.
2.  **Supabase:** To act as your backend (database, authentication, real-time features).
3.  **Vercel:** To host and deploy your frontend application.

---

## ⚙️ Step 1: GitHub Account & Repository Setup

**Purpose:** GitHub will be the central hub for your code. Vercel will monitor this repository and automatically deploy any changes you push.

1.  **Create a GitHub Account:**
    *   If you don't already have one, sign up for a free account at [github.com](https://github.com/).

2.  **Create a New Repository:**
    *   Once logged in, click the `+` icon in the top-right corner and select **"New repository"**.
    *   **Repository name:** `light-a-diya`
    *   **Description:** (Optional, but recommended) `A real-time, collaborative web app for friends and family to light virtual diyas together.`
    *   **Visibility:** Select **Public**. This is important if you want to use it as a portfolio project.
    *   **Initialize this repository with:** Check the box for **"Add a README file"**.
    *   Click **"Create repository"**.

3.  **Clone the Repository to Your Local Machine:**
    *   On your new repository's page, click the green **"<> Code"** button.
    *   Copy the HTTPS or SSH URL provided.
    *   Open a terminal or command prompt on your computer, navigate to where you want to store your project, and run the following command:
      ```bash
      git clone [paste-the-URL-you-copied]
      ```
    *   You now have a `light-a-diya` folder on your computer. This is where you will build your Next.js application.

---

## 💾 Step 2: Supabase Project Setup

**Purpose:** Supabase will provide your database, user authentication (Google Login), and the real-time functionality that makes the app collaborative.

1.  **Create a Supabase Account:**
    *   Go to [supabase.com](https://supabase.com/) and click **"Start your project"**.
    *   It's easiest to **"Continue with GitHub"** to link your accounts.

2.  **Create a New Project:**
    *   In your Supabase dashboard, click **"New project"**.
    *   **Name:** You can name it `light-a-diya`.
    *   **Database Password:** Generate a secure password and **save it somewhere safe** (like a password manager). You'll need this if you ever need to access the database directly.
    *   **Region:** Choose a region that is geographically closest to you or your target users for the best performance.
    *   Click **"Create new project"** and wait a few minutes for it to be set up.

3.  **Get Your API Keys:**
    *   Once your project is ready, navigate to the **"Project Settings"** (the gear icon in the left sidebar).
    *   Click on the **"API"** tab.
    *   You will need two pieces of information from this page:
        1.  **Project URL:** Under `Configuration -> URL`.
        2.  **Project API Keys -> `anon` `public` Key:** This is your anonymous, public-facing key. It's safe to use in a frontend application.
    *   **Keep this page open.** You will copy these two values into your Next.js project's environment variables (`.env.local` file) as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

    > **Important:** Never share or commit your `service_role` key to GitHub. You will only need the `anon` key for this project.

---

## 🚀 Step 3: Vercel Account & Project Setup

**Purpose:** Vercel will connect to your GitHub repository, build your Next.js application, and host it on a public URL for you to share.

1.  **Create a Vercel Account:**
    *   Go to [vercel.com](https://vercel.com/) and sign up.
    *   Again, it is highly recommended to **"Continue with GitHub"**. This will grant Vercel permission to see your repositories, which is necessary for deployment.

2.  **Import Your GitHub Project:**
    *   After signing up, you'll be taken to your Vercel dashboard. Click **"Add New... -> Project"**.
    *   Vercel will show a list of your GitHub repositories. Find `light-a-diya` and click the **"Import"** button next to it.

3.  **Configure and Deploy the Project:**
    *   Vercel will automatically detect that this is a Next.js project, so you usually don't need to change any build settings.
    *   The most important step is to add your Supabase keys. Expand the **"Environment Variables"** section.
    *   Add two variables:
        *   **Name:** `NEXT_PUBLIC_SUPABASE_URL`
        *   **Value:** Paste the **Project URL** you copied from your Supabase settings.
        *   **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   **Value:** Paste the **`anon` `public` Key** you copied from your Supabase settings.
    *   Click the **"Deploy"** button.

Vercel will now pull your code from GitHub, build it, and deploy it to a live URL. Congratulations, your infrastructure is now fully set up!
