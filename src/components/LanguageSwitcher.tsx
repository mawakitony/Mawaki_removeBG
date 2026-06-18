"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/translations";

const OPTIONS: { id: Locale; label: string }[] = [
  { id: "fr", label: "FR" },
  { id: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="relative grid grid-cols-2 rounded-full border border-gray-200 bg-white p-1 shadow-sm"
      role="group"
      aria-label="Language"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[#2563eb]"
        style={{
          left: locale === "fr" ? "4px" : "calc(50% + 0px)",
        }}
      />
      {OPTIONS.map((option) => {
        const active = locale === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLocale(option.id)}
            className={`relative z-[1] min-w-[52px] rounded-full px-4 py-2 font-display text-sm font-bold tracking-wide transition-colors ${
              active ? "text-white" : "text-gray-500 hover:text-gray-700"
            }`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
