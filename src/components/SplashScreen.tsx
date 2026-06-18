"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { LogoMark, LogoWordmark } from "@/components/LogoMark";
import { useLanguage } from "@/i18n/LanguageContext";

const SPLASH_MIN_MS = 2400;
const SPLASH_MIN_REDUCED_MS = 500;

function SplashOverlay() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030308]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <motion.div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          animate={reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "48px 48px"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      <motion.div
        className="absolute h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        }}
        animate={reduceMotion ? undefined : { scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-[1] flex flex-col items-center gap-8 px-6">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.05 }}
        >
          <LogoMark size="xl" showRings pulse />
        </motion.div>

        <LogoWordmark large />

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="font-display text-[10px] tracking-[0.4em] text-cyan-400/60 uppercase"
        >
          {t("splash.neuralEngine")}
        </motion.p>

        <div className="w-48 sm:w-56">
          <div className="relative h-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #00f0ff, #ff2d95, #8b5cf6)",
                boxShadow: "0 0 12px rgba(0,240,255,0.45)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: reduceMotion ? 0.35 : SPLASH_MIN_MS / 1000 - 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
            className="mt-3 text-center font-display text-[9px] tracking-[0.25em] text-slate-500 uppercase"
          >
            {t("splash.initializing")}
          </motion.p>
        </div>
      </div>

      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute top-0 left-0 h-24 w-24 border-t border-l border-cyan-400/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 border-r border-b border-fuchsia-400/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </>
      )}
    </motion.div>
  );
}

export function SplashGate({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const duration = reduceMotion ? SPLASH_MIN_REDUCED_MS : SPLASH_MIN_MS;
    const timer = window.setTimeout(() => setReady(true), duration);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <>
      <AnimatePresence mode="wait">{!ready && <SplashOverlay key="splash" />}</AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.45, delay: ready ? 0.05 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
