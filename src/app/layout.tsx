import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { LanguageProvider } from "@/context/LanguageContext";
import { Providers } from "@/components/providers";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import AuthCallbackHandler from "@/components/AuthCallbackHandler";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "Parambhakti.com - Hindu Spiritual Platform",
  description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies. Connect with your spiritual practice through traditional content and modern digital experiences.",
  keywords: ["Hindu", "prayers", "aarti", "spiritual", "diya", "celebration", "parambhakti"],
  authors: [{ name: "Parambhakti.com Team" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
  },
  openGraph: {
    title: "Parambhakti.com - Hindu Spiritual Platform",
    description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies. Connect with your spiritual practice through traditional content and modern digital experiences.",
    url: "https://parambhakti.com",
    siteName: "Parambhakti.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Parambhakti.com - Hindu Spiritual Platform",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parambhakti.com - Hindu Spiritual Platform",
    description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies.",
    images: ["/images/og-image.png"],
    creator: "@parambhakti",
  },
  alternates: {
    canonical: "https://parambhakti.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  // Get authentic user server-side
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
      </head>
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-spiritual-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <Providers>
          <LanguageProvider>
            <AuthProvider initialUser={user}>
              <Navigation />
              <div className="pb-16 md:pb-0">
                {children}
              </div>
              <MobileBottomNav />
              <Suspense fallback={null}>
                <AuthCallbackHandler />
              </Suspense>
            </AuthProvider>
          </LanguageProvider>
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
