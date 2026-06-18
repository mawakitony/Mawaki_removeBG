"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw, Layers } from "lucide-react";
import { BackgroundControls } from "./BackgroundControls";
import { CropEditor } from "./CropEditor";
import { ImagePreview } from "./ImagePreview";
import { NeonPanel } from "./NeonPanel";
import { useLanguage } from "@/i18n/LanguageContext";
import type { BackgroundMode, CropAreaPixels } from "@/lib/types";
import type { PresetBackground } from "@/lib/presetBackgrounds";
import type { Point } from "react-easy-crop";

type EditorProps = {
  originalUrl: string | null;
  processedUrl: string | null;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  backgroundImageUrl: string | null;
  selectedPresetId: string | null;
  isLoadingPreset: boolean;
  onModeChange: (mode: BackgroundMode) => void;
  onColorChange: (color: string) => void;
  onImageSelect: (file: File) => void;
  onPresetSelect: (preset: PresetBackground) => void;
  onDownloadTransparent: () => void;
  onDownloadFinal: () => void;
  onReset: () => void;
  cropEnabled: boolean;
  crop: Point;
  zoom: number;
  aspect: number | undefined;
  cropResetKey: number;
  exportPreviewUrl: string | null;
  onCropEnabledChange: (enabled: boolean) => void;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onAspectChange: (aspect: number | undefined) => void;
  onCropComplete: (area: CropAreaPixels | null) => void;
  onCropReset: () => void;
};

export function Editor({
  originalUrl,
  processedUrl,
  backgroundMode,
  backgroundColor,
  backgroundImageUrl,
  selectedPresetId,
  isLoadingPreset,
  onModeChange,
  onColorChange,
  onImageSelect,
  onPresetSelect,
  onDownloadTransparent,
  onDownloadFinal,
  onReset,
  cropEnabled,
  crop,
  zoom,
  aspect,
  cropResetKey,
  exportPreviewUrl,
  onCropEnabledChange,
  onCropChange,
  onZoomChange,
  onAspectChange,
  onCropComplete,
  onCropReset,
}: EditorProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-6xl space-y-6"
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold tracking-[0.3em] text-cyan-400/60 uppercase">
          {t("editor.studio")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-display text-[10px] tracking-widest text-emerald-400/70 uppercase">
            {t("editor.done")}
          </span>
        </div>
      </div>

      <ImagePreview
        originalUrl={originalUrl}
        processedUrl={processedUrl}
        exportPreviewUrl={exportPreviewUrl}
        cropEnabled={cropEnabled}
        backgroundMode={backgroundMode}
        backgroundColor={backgroundColor}
        backgroundImageUrl={backgroundImageUrl}
      />

      {processedUrl && (
        <CropEditor
          key={cropResetKey}
          imageUrl={processedUrl}
          enabled={cropEnabled}
          onEnabledChange={onCropEnabledChange}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onAspectChange={onAspectChange}
          onCropComplete={onCropComplete}
          onReset={onCropReset}
        />
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <NeonPanel glow="violet" className="flex-1 p-6">
          <BackgroundControls
            mode={backgroundMode}
            color={backgroundColor}
            selectedPresetId={selectedPresetId}
            isLoadingPreset={isLoadingPreset}
            onModeChange={onModeChange}
            onColorChange={onColorChange}
            onImageSelect={onImageSelect}
            onPresetSelect={onPresetSelect}
          />
        </NeonPanel>

        <div className="flex w-full flex-col gap-3 lg:w-72">
          <DownloadButton
            onClick={onDownloadTransparent}
            icon={<Layers className="h-4 w-4" />}
            label={t("editor.pngTransparent")}
            description={t("editor.pngTransparentDesc")}
            variant="secondary"
          />
          <DownloadButton
            onClick={onDownloadFinal}
            icon={<Download className="h-4 w-4" />}
            label={t("editor.downloadResult")}
            description={t("editor.downloadResultDesc")}
            variant="primary"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="btn-neon-secondary flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm text-slate-400"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400/60" />
            <span className="font-display text-xs tracking-wider uppercase">
              {t("editor.newImage")}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function DownloadButton({
  onClick,
  icon,
  label,
  description,
  variant,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  variant: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-xl px-5 py-4 text-left ${
        isPrimary ? "btn-neon-primary text-white" : "btn-neon-secondary text-white"
      }`}
    >
      <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide uppercase">
        {icon}
        {label}
      </div>
      <span
        className={`text-xs ${isPrimary ? "text-cyan-200/60" : "text-slate-500"}`}
      >
        {description}
      </span>
    </motion.button>
  );
}
