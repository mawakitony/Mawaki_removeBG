"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileImage, Upload } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CHECKERBOARD =
  "linear-gradient(45deg,#14141f 25%,transparent 25%),linear-gradient(-45deg,#14141f 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#14141f 75%),linear-gradient(-45deg,transparent 75%,#14141f 75%)";

function PersonSilhouette({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute bottom-2 left-1/2 z-[2] -translate-x-1/2 ${className}`}>
      <div className="mx-auto h-5 w-5 rounded-full bg-slate-300 shadow-[0_0_12px_rgba(0,240,255,0.35)]" />
      <div className="mt-0.5 h-12 w-9 rounded-t-2xl rounded-b-md bg-slate-400 shadow-[0_0_16px_rgba(0,240,255,0.2)]" />
    </div>
  );
}

function PanelTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-1.5 left-1.5 z-[3] rounded border border-white/10 bg-black/50 px-1.5 py-0.5 font-display text-[7px] tracking-widest text-cyan-300/80 uppercase">
      {children}
    </span>
  );
}

export function UploadVisual() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-40 w-full max-w-[280px]">
      <motion.div
        className="absolute inset-0 rounded-2xl border border-dashed border-cyan-400/35 bg-cyan-400/5"
        animate={reduceMotion ? undefined : { borderColor: ["rgba(0,240,255,0.25)", "rgba(0,240,255,0.55)", "rgba(0,240,255,0.25)"] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FileImage className="h-3 w-3 text-cyan-400" />
        <span className="font-display text-[7px] tracking-wider text-slate-400 uppercase">
          {t("guide.animFormats")}
        </span>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/15 shadow-[0_0_24px_rgba(0,240,255,0.15)]"
        animate={reduceMotion ? undefined : { y: [-28, -36, -28], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative h-24 bg-gradient-to-b from-sky-700 via-slate-600 to-slate-800">
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-amber-200/30 to-transparent" />
          <PersonSilhouette />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2"
        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <Upload className="h-4 w-4 text-cyan-400" />
        <span className="font-display text-[8px] tracking-[0.2em] text-cyan-300/80 uppercase">
          {t("guide.animDrop")}
        </span>
      </motion.div>

      {!reduceMotion && (
        <motion.div
          className="absolute bottom-0 left-4 right-4 h-1 overflow-hidden rounded-full bg-white/10"
          initial={false}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-400"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}

export function ProcessVisual() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const phases = [
    t("guide.animDetect"),
    t("guide.animMask"),
    t("guide.animRemove"),
  ];

  return (
    <div className="relative h-40 w-full max-w-[300px]">
      <div className="flex items-center justify-center gap-2">
        <div className="relative h-32 w-[108px] overflow-hidden rounded-xl border border-cyan-400/25">
          <PanelTag>{t("guide.animWithBg")}</PanelTag>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-slate-700 to-slate-900">
            <div className="absolute inset-x-2 top-3 h-10 rounded-sm bg-sky-500/20" />
            <div className="absolute bottom-0 left-0 h-8 w-full bg-slate-600/50" />
          </div>
          <PersonSilhouette />
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute inset-y-0 z-[4] w-0.5 bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 z-[3] bg-cyan-400/10"
                animate={{ opacity: [0, 0.35, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 z-[1]"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(to bottom, rgba(30,58,138,0.9), rgba(51,65,85,0.95))",
                }}
              />
              <motion.svg
                className="absolute inset-0 z-[5] h-full w-full"
                viewBox="0 0 108 128"
                fill="none"
                initial={false}
              >
                <motion.ellipse
                  cx="54"
                  cy="78"
                  rx="22"
                  ry="38"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  animate={{ opacity: [0, 1, 1, 0], pathLength: [0, 1, 1, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.35, 0.7, 1] }}
                />
              </motion.svg>
            </>
          )}
        </div>

        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArrowRight className="h-5 w-5 text-fuchsia-400" />
        </motion.div>

        <div className="relative h-32 w-[108px] overflow-hidden rounded-xl border border-fuchsia-400/25">
          <PanelTag>{t("guide.animNoBg")}</PanelTag>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: CHECKERBOARD,
              backgroundSize: "10px 10px",
              backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0",
              backgroundColor: "#0a0a12",
            }}
          />
          <PersonSilhouette />
          {!reduceMotion && (
            <motion.div
              className="absolute inset-0 bg-emerald-400/10"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 1.6 }}
            />
          )}
        </div>
      </div>

      {!reduceMotion && (
        <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-3">
          {phases.map((label, i) => (
            <motion.span
              key={label}
              className="font-display text-[7px] tracking-wider uppercase"
              animate={{
                color: ["#475569", "#22d3ee", "#475569"],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                delay: i * 1.05,
              }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      )}

      <motion.span
        className="absolute -top-1 right-0 font-display text-[7px] tracking-[0.3em] text-fuchsia-400/70 uppercase"
        animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {t("guide.animScan")}
      </motion.span>
    </div>
  );
}

export function EditVisual() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const colors = ["#00f0ff", "#ff2d95", "#8b5cf6", "#22c55e", "#3b82f6"];

  return (
    <div className="relative h-40 w-full max-w-[280px]">
      <div className="relative mx-auto h-32 w-56 overflow-hidden rounded-xl border border-white/10">
        <PanelTag>{t("guide.animReplace")}</PanelTag>

        {!reduceMotion ? (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(160deg, #0ea5e9 0%, #1e3a5f 100%)",
                "linear-gradient(160deg, #ff2d95 0%, #4c1d95 100%)",
                "linear-gradient(160deg, #8b5cf6 0%, #0f172a 100%)",
                "linear-gradient(160deg, #22c55e 0%, #134e4a 100%)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-800 to-slate-900" />
        )}

        <div
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage: CHECKERBOARD,
            backgroundSize: "10px 10px",
            backgroundColor: "#0a0a12",
          }}
        />

        <PersonSilhouette />

        {!reduceMotion && (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: CHECKERBOARD,
              backgroundSize: "10px 10px",
              backgroundColor: "#0a0a12",
            }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.15, 0.35, 0.55, 0.75] }}
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-display text-[7px] tracking-wider text-slate-500 uppercase">
          {t("guide.animTransparent")}
        </span>
        <div className="flex gap-1">
          {colors.map((color, i) => (
            <motion.span
              key={color}
              className="h-4 w-4 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
              animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExportVisual() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-40 w-full max-w-[260px] flex-col items-center justify-center">
      <div className="relative flex items-center gap-3">
        <motion.div
          className="relative h-28 w-20 overflow-hidden rounded-lg border border-cyan-400/30"
          animate={reduceMotion ? undefined : { scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: CHECKERBOARD,
              backgroundSize: "8px 8px",
              backgroundColor: "#0a0a12",
            }}
          />
          <PersonSilhouette className="scale-90" />
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent py-1 text-center font-display text-[6px] tracking-widest text-emerald-300 uppercase"
            animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            .png
          </motion.div>
        </motion.div>

        {!reduceMotion && (
          <motion.div
            className="flex flex-col items-center gap-1"
            animate={{ x: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-cyan-400"
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}

        <motion.div
          className="flex h-16 w-14 flex-col items-center justify-center rounded-xl border border-emerald-400/35 bg-emerald-400/10"
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span className="font-display text-lg font-bold text-emerald-300">↓</span>
          <span className="font-display text-[7px] tracking-wider text-emerald-400/80 uppercase">
            {t("guide.animPngReady")}
          </span>
        </motion.div>
      </div>

      <motion.p
        className="mt-3 font-display text-[8px] tracking-[0.25em] text-slate-500 uppercase"
        animate={reduceMotion ? undefined : { opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {t("guide.animDownload")}
      </motion.p>
    </div>
  );
}
