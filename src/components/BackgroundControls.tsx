"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ImagePlus, Plus, Search, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";
import type { BackgroundMode } from "@/lib/types";
import {
  PHOTO_FILTERS,
  getPresetsForTab,
  type BackgroundTab,
  type PresetBackground,
  type PresetCategory,
} from "@/lib/presetBackgrounds";

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#00f0ff",
  "#ff2d95",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#78716c",
];

const TABS: { id: BackgroundTab; labelKey: TranslationKey; icon: React.ReactNode }[] = [
  { id: "magique", labelKey: "background.tabMagique", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "photo", labelKey: "background.tabPhoto", icon: <ImagePlus className="h-3.5 w-3.5" /> },
  { id: "couleur", labelKey: "background.tabCouleur", icon: <Palette className="h-3.5 w-3.5" /> },
];

const FILTER_LABEL_KEYS: Partial<Record<PresetCategory | "tous", TranslationKey>> = {
  tous: "background.filterTous",
  technologie: "background.filterTechnologie",
  flou: "background.filterFlou",
  naturel: "background.filterNaturel",
  architecture: "background.filterArchitecture",
  urbain: "background.filterUrbain",
  interieur: "background.filterInterieur",
  ciel: "background.filterCiel",
};

type BackgroundControlsProps = {
  mode: BackgroundMode;
  color: string;
  selectedPresetId: string | null;
  isLoadingPreset: boolean;
  onModeChange: (mode: BackgroundMode) => void;
  onColorChange: (color: string) => void;
  onImageSelect: (file: File) => void;
  onPresetSelect: (preset: PresetBackground) => void;
};

export function BackgroundControls({
  mode,
  color,
  selectedPresetId,
  isLoadingPreset,
  onModeChange,
  onColorChange,
  onImageSelect,
  onPresetSelect,
}: BackgroundControlsProps) {
  const { t } = useLanguage();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<BackgroundTab>("photo");
  const [search, setSearch] = useState("");
  const [photoFilter, setPhotoFilter] = useState<PresetCategory | "tous">("tous");

  const presets = getPresetsForTab(activeTab).filter((p) => {
    if (activeTab !== "photo") return true;
    const matchesFilter = photoFilter === "tous" || p.category === photoFilter;
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[10px] font-semibold tracking-[0.3em] text-cyan-400/50 uppercase">
          {t("background.title")}
        </h3>
        <button
          onClick={() => onModeChange("transparent")}
          className={`rounded-lg border px-2.5 py-1 font-display text-[9px] tracking-wider uppercase transition-all ${
            mode === "transparent"
              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
              : "border-white/10 text-slate-500 hover:text-slate-300"
          }`}
        >
          {t("background.transparent")}
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 rounded-xl border border-white/8 bg-white/[0.02] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-display text-[10px] tracking-wider uppercase transition-all ${
              activeTab === tab.id
                ? "bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.icon}
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageSelect(file);
          e.target.value = "";
        }}
      />

      <AnimatePresence mode="wait">
        {activeTab === "couleur" ? (
          <motion.div
            key="couleur"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <p className="text-xs text-slate-500">{t("background.colorHint")}</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => onColorChange(preset)}
                  className={`h-9 w-9 rounded-lg transition-all hover:scale-110 ${
                    mode === "color" && color === preset
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#08081a]"
                      : "ring-1 ring-white/10"
                  }`}
                  style={{
                    backgroundColor: preset,
                    boxShadow:
                      mode === "color" && color === preset
                        ? `0 0 15px ${preset}80`
                        : undefined,
                  }}
                  aria-label={`${t("background.colorAria")} ${preset}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="flex-1 rounded-lg border border-cyan-400/15 bg-cyan-400/5 px-3 py-2 font-mono text-sm text-cyan-100"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {activeTab === "photo" && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("background.searchPlaceholder")}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pr-3 pl-9 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/30 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {presets.length} {t("background.presetsCount")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPhotoFilter(f.id)}
                      className={`rounded-full border px-3 py-1 font-display text-[9px] tracking-wider uppercase transition-all ${
                        photoFilter === f.id
                          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                          : "border-white/8 text-slate-500 hover:border-white/15"
                      }`}
                    >
                      {t(FILTER_LABEL_KEYS[f.id] ?? "background.filterTous")}
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeTab === "magique" && (
              <p className="text-xs text-slate-500">{t("background.magiqueHint")}</p>
            )}

            {/* Grille */}
            <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
              {/* Bouton upload */}
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] text-slate-500 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                <Plus className="h-6 w-6" />
                <span className="font-display text-[8px] tracking-wider uppercase">
                  {t("background.import")}
                </span>
              </button>

              {presets.map((preset) => (
                <PresetThumbnail
                  key={preset.id}
                  preset={preset}
                  selected={selectedPresetId === preset.id && mode === "image"}
                  loading={isLoadingPreset && selectedPresetId === preset.id}
                  onSelect={() => onPresetSelect(preset)}
                  disabled={isLoadingPreset}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PresetThumbnail({
  preset,
  selected,
  loading,
  onSelect,
  disabled,
}: {
  preset: PresetBackground;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:scale-[1.03] ${
        selected
          ? "border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          : "border-transparent hover:border-white/20"
      }`}
      title={preset.name}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      )}
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white/5 p-2">
          <ImagePlus className="h-5 w-5 text-slate-600" />
          <span className="text-center text-[8px] text-slate-500">{preset.name}</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={preset.thumbUrl}
          alt={preset.name}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="block truncate text-[9px] text-white">{preset.name}</span>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        </div>
      )}
    </button>
  );
}
