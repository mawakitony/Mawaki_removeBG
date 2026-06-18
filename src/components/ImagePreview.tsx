"use client";

import { motion } from "framer-motion";
import { NeonPanel } from "./NeonPanel";
import { useLanguage } from "@/i18n/LanguageContext";
import type { BackgroundMode } from "@/lib/types";

type ImagePreviewProps = {
  originalUrl: string | null;
  processedUrl: string | null;
  exportPreviewUrl?: string | null;
  cropEnabled?: boolean;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  backgroundImageUrl: string | null;
};

export function ImagePreview({
  originalUrl,
  processedUrl,
  exportPreviewUrl,
  cropEnabled = false,
  backgroundMode,
  backgroundColor,
  backgroundImageUrl,
}: ImagePreviewProps) {
  const { t } = useLanguage();
  const displayUrl = exportPreviewUrl ?? processedUrl;

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #0d0d18 25%, transparent 25%),
      linear-gradient(-45deg, #0d0d18 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #0d0d18 75%),
      linear-gradient(-45deg, transparent 75%, #0d0d18 75%)
    `,
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
    backgroundColor: "#080812",
  };

  const resultBackground =
    exportPreviewUrl && backgroundMode !== "transparent"
      ? checkerboardStyle
      : backgroundMode === "color"
        ? { backgroundColor: backgroundColor }
        : backgroundMode === "image" && backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : checkerboardStyle;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PreviewPanel
        label={t("preview.original")}
        tag={t("preview.input")}
        style={checkerboardStyle}
        glow="cyan"
      >
        {originalUrl && (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={originalUrl}
            alt={t("preview.originalAlt")}
            className="max-h-[400px] w-full object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,240,255,0.15))" }}
          />
        )}
      </PreviewPanel>

      <PreviewPanel
        label={cropEnabled ? t("preview.export") : t("preview.result")}
        tag={cropEnabled ? t("preview.exportTag") : t("preview.output")}
        style={resultBackground}
        glow="magenta"
      >
        {displayUrl && (
          <motion.img
            key={`${backgroundMode}-${backgroundColor}-${backgroundImageUrl}-${displayUrl}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={displayUrl}
            alt={t("preview.resultAlt")}
            className="max-h-[400px] w-full object-contain"
            style={{
              filter: "drop-shadow(0 0 25px rgba(255,45,149,0.15))",
            }}
          />
        )}
      </PreviewPanel>
    </div>
  );
}

function PreviewPanel({
  label,
  tag,
  style,
  glow,
  children,
}: {
  label: string;
  tag: string;
  style: React.CSSProperties;
  glow: "cyan" | "magenta";
  children: React.ReactNode;
}) {
  return (
    <NeonPanel glow={glow} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <span className="font-display text-[10px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
          {label}
        </span>
        <span
          className={`font-display rounded border px-2 py-0.5 text-[9px] tracking-widest uppercase ${
            glow === "cyan"
              ? "border-cyan-400/20 text-cyan-400/60"
              : "border-fuchsia-400/20 text-fuchsia-400/60"
          }`}
        >
          {tag}
        </span>
      </div>
      <div
        className="relative flex min-h-[300px] items-center justify-center p-4"
        style={style}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,240,255,0.5) 3px, rgba(0,240,255,0.5) 4px)",
          }}
        />
        <div className="relative z-[1]">{children}</div>
      </div>
    </NeonPanel>
  );
}
