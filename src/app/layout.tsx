// src/app/layout.tsx

import type { Metadata } from "next";
// Import the font utilities from next/font
import { Inter, Lora } from "next/font/google";
import "./globals.css";

// Configure the fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "light-a-diya",
  description: "Celebrate together, no matter the distance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body */}
      <body className={`${inter.variable} ${lora.variable} font-sans`}>{children}</body>
    </html>
  );
}
