"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Upload,
  Cpu,
  Palette,
  Download,
  ChevronRight,
} from "lucide-react";
import {
  EditVisual,
  ExportVisual,
  ProcessVisual,
  UploadVisual,
} from "@/components/GuideStepVisuals";
import { NeonPanel } from "@/components/NeonPanel";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const STEP_COUNT = 4;
const CYCLE_MS = 6000;

type StepConfig = {
  icon: typeof Upload;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  tagKey: TranslationKey;
  glow: "cyan" | "magenta" | "violet";
};

const STEPS: StepConfig[] = [
  {
    icon: Upload,
    titleKey: "guide.step1Title",
    descKey: "guide.step1Desc",
    tagKey: "guide.visualUpload",
    glow: "cyan",
  },
  {
    icon: Cpu,
    titleKey: "guide.step2Title",
    descKey: "guide.step2Desc",
    tagKey: "guide.visualProcess",
    glow: "violet",
  },
  {
    icon: Palette,
    titleKey: "guide.step3Title",
    descKey: "guide.step3Desc",
    tagKey: "guide.visualEdit",
    glow: "magenta",
  },
  {
    icon: Download,
    titleKey: "guide.step4Title",
    descKey: "guide.step4Desc",
    tagKey: "guide.visualExport",
    glow: "cyan",
  },
];

export function UsageGuide() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % STEP_COUNT);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const step = STEPS[active];
  const StepIcon = step.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 w-full max-w-6xl"
    >
      <div className="mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
          viewport={{ once: true }}
          className="font-display text-[10px] text-cyan-400/70 uppercase"
        >
          {t("guide.eyebrow")}
        </motion.p>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-wide text-white uppercase sm:text-3xl">
          {t("guide.title")}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {t("guide.subtitle")}
        </p>
      </div>

      <NeonPanel glow={step.glow} animated corners className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[300px] border-b border-white/5 bg-black/20 p-6 sm:min-h-[340px] sm:p-8 lg:border-r lg:border-b-0">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
              <motion.div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,240,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "28px 28px"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="pointer-events-none absolute right-3 bottom-3 h-8 w-8 border-r border-b border-cyan-400/20" />

            <div className="relative z-[1] flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-[9px] tracking-[0.35em] text-cyan-400/50 uppercase">
                  {t("guide.timeline")}
                </span>
                <span className="font-display rounded border border-white/10 px-2 py-0.5 text-[9px] tracking-widest text-slate-500 uppercase">
                  {t(step.tagKey)}
                </span>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex w-full items-center justify-center"
                  >
                    <StepVisual step={active} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2">
                {STEPS.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`${t(STEPS[index].titleKey)}`}
                    className="group relative h-1.5 overflow-hidden rounded-full bg-white/10 transition-all"
                    style={{ width: index === active ? 44 : 16 }}
                  >
                    {index === active && !reduceMotion && (
                      <motion.span
                        className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                      />
                    )}
                    {index === active && reduceMotion && (
                      <span className="absolute inset-0 rounded-full bg-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="mb-6 hidden items-center gap-1 lg:flex">
              {STEPS.map((item, index) => (
                <div key={item.titleKey} className="flex items-center gap-1">
                  <TimelineNode
                    index={index}
                    active={active}
                    onSelect={() => setActive(index)}
                    label={t(item.titleKey)}
                  />
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="h-3 w-3 shrink-0 text-white/15" />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 16px rgba(0,240,255,0.25)",
                        "0 0 28px rgba(255,45,149,0.35)",
                        "0 0 16px rgba(0,240,255,0.25)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10"
                  >
                    <StepIcon className="h-5 w-5 text-cyan-300" />
                  </motion.div>
                  <div>
                    <p className="font-display text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase">
                      0{active + 1} / 0{STEP_COUNT}
                    </p>
                    <h4 className="font-display text-lg font-semibold tracking-wide text-white uppercase">
                      {t(step.titleKey)}
                    </h4>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                  {t(step.descKey)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 space-y-2 lg:hidden">
              {STEPS.map((item, index) => (
                <button
                  key={item.titleKey}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    index === active
                      ? "border-cyan-400/30 bg-cyan-400/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span
                    className={`font-display text-xs font-bold ${
                      index === active ? "neon-text-cyan" : "text-slate-600"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`font-display text-xs tracking-wider uppercase ${
                      index === active ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {t(item.titleKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </NeonPanel>
    </motion.section>
  );
}

function TimelineNode({
  index,
  active,
  onSelect,
  label,
}: {
  index: number;
  active: number;
  onSelect: () => void;
  label: string;
}) {
  const isActive = index === active;
  const isDone = index < active;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-center gap-2"
    >
      <motion.span
        animate={{
          scale: isActive ? 1.08 : 1,
          borderColor: isActive
            ? "rgba(0,240,255,0.6)"
            : isDone
              ? "rgba(0,240,255,0.35)"
              : "rgba(255,255,255,0.12)",
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full border bg-black/40 font-display text-[10px] font-bold text-cyan-300"
      >
        0{index + 1}
      </motion.span>
      <span
        className={`max-w-[72px] text-center font-display text-[8px] leading-tight tracking-wider uppercase ${
          isActive ? "text-cyan-300" : "text-slate-600 group-hover:text-slate-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function StepVisual({ step }: { step: number }) {
  if (step === 0) return <UploadVisual />;
  if (step === 1) return <ProcessVisual />;
  if (step === 2) return <EditVisual />;
  return <ExportVisual />;
}
