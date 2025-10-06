# Project Overview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It uses [Supabase](https://supabase.io/) for the backend and [Tailwind CSS](https://tailwindcss.com/) for styling. The project is set up with TypeScript and uses ESLint for linting.

The application appears to be a web application that requires user authentication, as indicated by the presence of a `UserContext` and a `AuthButton` component.

## Building and Running

To get the development environment running, you will need to have Node.js and npm (or yarn/pnpm/bun) installed.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Other Commands

*   **Build for production:**

    ```bash
    npm run build
    ```

*   **Start the production server:**

    ```bash
    npm run start
    ```

*   **Lint the code:**

    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes should be used whenever possible.
*   **Components:** Reusable components should be placed in the `src/components` directory.
*   **Linting:** The project uses ESLint to enforce code quality. Please run `npm run lint` before committing any changes.
*   **Type Safety:** The project is written in TypeScript. Please ensure that all new code is properly typed.
