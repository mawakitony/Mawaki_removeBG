"use client";

import { LanguageProvider } from "@/i18n/LanguageContext";
import { SplashGate } from "@/components/SplashScreen";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SplashGate>{children}</SplashGate>
    </LanguageProvider>
  );
}
