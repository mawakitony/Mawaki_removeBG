"use client";

import { LanguageProvider } from "@/i18n/LanguageContext";
import { SourceProtection } from "@/components/SourceProtection";
import { SplashGate } from "@/components/SplashScreen";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SourceProtection />
      <SplashGate>{children}</SplashGate>
    </LanguageProvider>
  );
}
