"use client";

import { motion } from "framer-motion";
import { Loader2, Cpu } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type ProcessingOverlayProps = {
  progress: number;
};

export function ProcessingOverlay({ progress }: ProcessingOverlayProps) {
  const { t } = useLanguage();

  const steps = [
    t("processing.stepSegment"),
    t("processing.stepMask"),
    t("processing.stepExport"),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="neon-border-animated relative mx-4 w-full max-w-md overflow-hidden rounded-2xl glass-neon p-8 text-center"
        style={{ boxShadow: "0 0 80px rgba(0,240,255,0.1)" }}
      >
        <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />

        <div className="relative z-[1]">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-fuchsia-400"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-400 border-l-cyan-400"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <p className="font-display text-[10px] tracking-[0.4em] text-cyan-400/60 uppercase">
            {t("processing.label")}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold tracking-wide text-white uppercase">
            {t("processing.title")}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{t("processing.subtitle")}</p>

          <div className="mt-8">
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #00f0ff, #ff2d95, #8b5cf6)",
                  boxShadow: "0 0 10px rgba(0,240,255,0.5)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(progress, 3)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-display text-xs tracking-widest">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                <span className="uppercase">{t("processing.status")}</span>
              </div>
              <span className="neon-text-cyan">{progress}%</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
            {steps.map((step, i) => (
              <div key={step} className="text-center">
                <div
                  className={`font-display text-[9px] tracking-widest uppercase ${
                    progress > i * 33 ? "text-cyan-400" : "text-slate-600"
                  }`}
                >
                  {step}
                </div>
                <div
                  className={`mt-1 h-0.5 rounded ${
                    progress > i * 33 ? "bg-cyan-400" : "bg-white/5"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
