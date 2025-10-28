import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { Providers } from "@/components/providers";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { createServerSupabaseClient } from "@/lib/supabase-server";
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
  title: "Dharma.com - Hindu Spiritual Platform",
  description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies. Connect with your spiritual practice through traditional content and modern digital experiences.",
  keywords: ["Hindu", "prayers", "aarti", "spiritual", "diya", "celebration", "dharma"],
  authors: [{ name: "Dharma.com Team" }],
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
    title: "Dharma.com - Hindu Spiritual Platform",
    description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies.",
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get initial session server-side
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
      </head>
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        <Providers>
          <LanguageProvider>
            <AuthProvider initialSession={session}>
              <Navigation />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
