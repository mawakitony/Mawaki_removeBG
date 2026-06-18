"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark, LogoWordmark } from "@/components/LogoMark";
import { useLanguage } from "@/i18n/LanguageContext";

export function Header() {
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6"
    >
      <div className="flex items-center gap-4">
        <LogoMark size="sm" pulse />
        <div>
          <LogoWordmark />
          <p className="font-display text-[10px] tracking-[0.3em] text-cyan-400/50 uppercase">
            {t("header.neuralEngine")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-neon hidden items-center gap-2 rounded-full px-4 py-2 text-xs md:flex"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <Shield className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-display tracking-wider text-cyan-300/70 uppercase">
            {t("header.secure")}
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
}
