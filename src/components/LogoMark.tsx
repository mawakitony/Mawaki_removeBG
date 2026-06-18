"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cpu } from "lucide-react";

type LogoMarkProps = {
  size?: "sm" | "lg" | "xl";
  showRings?: boolean;
  pulse?: boolean;
};

const SIZES = {
  sm: { box: "h-11 w-11", icon: "h-5 w-5", ringOuter: "h-16 w-16", ringInner: "h-[3.25rem] w-[3.25rem]" },
  lg: { box: "h-20 w-20", icon: "h-9 w-9", ringOuter: "h-28 w-28", ringInner: "h-[5.5rem] w-[5.5rem]" },
  xl: { box: "h-28 w-28", icon: "h-12 w-12", ringOuter: "h-40 w-40", ringInner: "h-[7.5rem] w-[7.5rem]" },
};

export function LogoMark({ size = "sm", showRings = false, pulse = true }: LogoMarkProps) {
  const reduceMotion = useReducedMotion();
  const s = SIZES[size];

  return (
    <div className="relative flex items-center justify-center">
      {showRings && !reduceMotion && (
        <>
          <motion.div
            className={`absolute rounded-full border border-transparent border-t-cyan-400 border-r-fuchsia-400/80 ${s.ringOuter}`}
            animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
            transition={{
              rotate: { duration: 3.5, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity },
            }}
          />
          <motion.div
            className={`absolute rounded-full border border-transparent border-b-violet-400 border-l-cyan-400/80 ${s.ringInner}`}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={`absolute rounded-full ${s.ringOuter}`}
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(0,240,255,0.35), transparent, rgba(255,45,149,0.25), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <motion.div
        animate={
          pulse && !reduceMotion
            ? {
                boxShadow: [
                  "0 0 24px rgba(0,240,255,0.35), 0 0 48px rgba(139,92,246,0.2)",
                  "0 0 40px rgba(0,240,255,0.55), 0 0 72px rgba(255,45,149,0.25)",
                  "0 0 24px rgba(0,240,255,0.35), 0 0 48px rgba(139,92,246,0.2)",
                ],
                scale: [1, 1.03, 1],
              }
            : undefined
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className={`relative z-[1] flex items-center justify-center rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500/25 to-violet-600/25 ${s.box}`}
      >
        <motion.div
          animate={!reduceMotion ? { opacity: [0.7, 1, 0.7] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <Cpu className={`${s.icon} text-cyan-300`} strokeWidth={1.75} />
        </motion.div>
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/15" />
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-x-2 top-2 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
            animate={{ top: ["8%", "88%", "8%"], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function LogoWordmark({ large = false }: { large?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      className="text-center"
    >
      <h1
        className={`font-display font-black text-white uppercase ${
          large
            ? "text-2xl tracking-[0.12em] sm:text-3xl"
            : "text-[11px] tracking-[0.08em] sm:text-sm sm:tracking-[0.1em]"
        }`}
      >
        Mawaki
        <motion.span
          className="neon-text-cyan"
          animate={!reduceMotion ? { opacity: [0.85, 1, 0.85] } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        >
          _removeBG
        </motion.span>
      </h1>
    </motion.div>
  );
}
