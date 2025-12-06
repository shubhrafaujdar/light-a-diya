import SpiritualLanding from "@/components/SpiritualLanding";
import AuthNotifications from "@/components/AuthNotifications";
import { Suspense } from "react";

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
