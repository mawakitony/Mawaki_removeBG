"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { motion } from "framer-motion";
import { Crop, RotateCcw, ZoomIn } from "lucide-react";
import { NeonPanel } from "@/components/NeonPanel";
import { useLanguage } from "@/i18n/LanguageContext";
import type { CropAreaPixels } from "@/lib/types";

type AspectOption = {
  id: string;
  labelKey: "crop.ratioFree" | "crop.ratioSquare" | "crop.ratioLandscape" | "crop.ratioWide" | "crop.ratioPortrait";
  value: number | undefined;
};

const ASPECT_OPTIONS: AspectOption[] = [
  { id: "free", labelKey: "crop.ratioFree", value: undefined },
  { id: "1:1", labelKey: "crop.ratioSquare", value: 1 },
  { id: "4:3", labelKey: "crop.ratioLandscape", value: 4 / 3 },
  { id: "16:9", labelKey: "crop.ratioWide", value: 16 / 9 },
  { id: "9:16", labelKey: "crop.ratioPortrait", value: 9 / 16 },
];

type CropEditorProps = {
  imageUrl: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  crop: Point;
  zoom: number;
  aspect: number | undefined;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onAspectChange: (aspect: number | undefined) => void;
  onCropComplete: (area: CropAreaPixels | null) => void;
  onReset: () => void;
};

export function CropEditor({
  imageUrl,
  enabled,
  onEnabledChange,
  crop,
  zoom,
  aspect,
  onCropChange,
  onZoomChange,
  onAspectChange,
  onCropComplete,
  onReset,
}: CropEditorProps) {
  const { t } = useLanguage();
  const [activeAspect, setActiveAspect] = useState("free");

  const handleCropComplete = useCallback(
    (_: Area, pixels: Area) => {
      onCropComplete({
        x: Math.round(pixels.x),
        y: Math.round(pixels.y),
        width: Math.round(pixels.width),
        height: Math.round(pixels.height),
      });
    },
    [onCropComplete]
  );

  return (
    <NeonPanel glow="cyan" className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <Crop className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-[10px] font-semibold tracking-[0.3em] text-cyan-400/70 uppercase">
            {t("crop.title")}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onEnabledChange(!enabled)}
          className={`rounded-lg border px-3 py-1.5 font-display text-[9px] tracking-wider uppercase transition-all ${
            enabled
              ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
              : "border-white/10 text-slate-500 hover:text-slate-300"
          }`}
        >
          {enabled ? t("crop.enabled") : t("crop.disabled")}
        </button>
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 p-4"
        >
          <p className="text-xs leading-relaxed text-slate-500">{t("crop.hint")}</p>

          <div className="relative h-[280px] overflow-hidden rounded-xl border border-cyan-400/20 bg-[#080812] sm:h-[320px]">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={handleCropComplete}
              objectFit="contain"
              showGrid
              style={{
                containerStyle: {
                  background:
                    "linear-gradient(45deg,#0d0d18 25%,transparent 25%),linear-gradient(-45deg,#0d0d18 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#0d0d18 75%),linear-gradient(-45deg,transparent 75%,#0d0d18 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                  backgroundColor: "#080812",
                },
                cropAreaStyle: {
                  border: "2px solid rgba(0,240,255,0.85)",
                  boxShadow: "0 0 0 9999px rgba(3,3,8,0.65)",
                },
              }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ASPECT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setActiveAspect(option.id);
                  onAspectChange(option.value);
                }}
                className={`rounded-full border px-3 py-1 font-display text-[9px] tracking-wider uppercase transition-all ${
                  activeAspect === option.id
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/8 text-slate-500 hover:border-white/15"
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 shrink-0 text-cyan-400/70" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
            />
            <span className="w-10 text-right font-mono text-xs text-slate-500">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="btn-neon-secondary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs text-slate-400"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400/60" />
            <span className="font-display tracking-wider uppercase">{t("crop.reset")}</span>
          </button>
        </motion.div>
      )}
    </NeonPanel>
  );
}
