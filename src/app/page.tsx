import { Metadata } from "next";
import SpiritualLanding from "@/components/SpiritualLanding";
import AuthNotifications from "@/components/AuthNotifications";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Parambhakti.com - Your Gateway to Hindu Spirituality",
  description: "Connect with divine traditions through aartis, spiritual quizzes, and community diya lighting. Join Parambhakti.com to deepen your spiritual practice.",
};


export default function Home() {
  return (
    <main id="main-content">
      <Suspense fallback={null}>
        <AuthNotifications />
      </Suspense>
      <SpiritualLanding />
    </main>
  );
}
