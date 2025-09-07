// src/app/page.tsx

import Image from "next/image";

const GoogleIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
    <path d="M1 1h22v22H1z" fill="none"></path>
  </svg>
);

export default function HomePage() {
  return (
    <main className="relative flex size-full min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center gap-6">

        {/* Use the font-serif class we defined in @theme */}
        <h1 className="font-serif text-4xl font-bold text-off-white-text">
          light-a-diya
        </h1>

        <div className="w-full max-w-md">
          <Image
            alt="A beautifully lit diya, symbolizing hope and connection."
            className="h-auto w-full rounded-2xl object-cover shadow-2xl shadow-yellow-500/10"
            src="/diya-hero.png" 
            width={500}
            height={500}
            priority
          />
        </div>

        <p className="max-w-md text-lg text-off-white-text opacity-90">
          Celebrate together, no matter the distance.
        </p>

        {/* Use the bg-gold-accent class */}
        <button 
          className="flex items-center gap-2 rounded-full bg-gold-accent px-8 py-3 text-lg font-bold text-gray-900 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30"
        >
          <GoogleIcon />
          <span>Login with Google to Begin</span>
        </button>
        
      </div>
    </main>
  );
}
