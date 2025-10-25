import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
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
  openGraph: {
    title: "Dharma.com - Hindu Spiritual Platform",
    description: "Access Hindu prayers, aartis, and participate in collaborative diya lighting ceremonies.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
