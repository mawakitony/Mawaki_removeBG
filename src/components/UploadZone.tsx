"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, X, ScanLine } from "lucide-react";
import { NeonPanel } from "./NeonPanel";
import { useLanguage } from "@/i18n/LanguageContext";

type UploadZoneProps = {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  disabled?: boolean;
};

export function UploadZone({
  onFileSelect,
  previewUrl,
  disabled,
}: UploadZoneProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (disabled) return;
      onFileSelect(file);
    },
    [onFileSelect, disabled]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative z-10 w-full max-w-2xl"
    >
      <NeonPanel animated corners className="cursor-pointer" glow="cyan">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`group relative transition-all duration-300 ${
            isDragging ? "scale-[1.01]" : ""
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/bmp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-60"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                className="relative flex min-h-[300px] items-center justify-center p-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={t("upload.preview")}
                  className="max-h-64 max-w-full rounded-lg object-contain"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(0,240,255,0.2))",
                  }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded border border-cyan-400/20 bg-cyan-400/5 px-2 py-1">
                  <ScanLine className="h-3 w-3 text-cyan-400" />
                  <span className="font-display text-[9px] tracking-widest text-cyan-400 uppercase">
                    {t("upload.preview")}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[300px] flex-col items-center justify-center gap-5 p-10"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    boxShadow: [
                      "0 0 20px rgba(0,240,255,0.2)",
                      "0 0 40px rgba(0,240,255,0.4)",
                      "0 0 20px rgba(0,240,255,0.2)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10"
                >
                  <Upload className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <div className="text-center">
                  <p className="font-display text-lg font-semibold tracking-wide text-white uppercase">
                    {t("upload.dragTitle")}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("upload.dragHint")}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-4 py-1.5 text-xs text-slate-600">
                  <ImageIcon className="h-3.5 w-3.5 text-cyan-500/50" />
                  <span>{t("upload.formats")}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-cyan-400/5 backdrop-blur-sm"
            >
              <p className="font-display text-lg font-semibold tracking-widest text-cyan-300 uppercase">
                {t("upload.dropRelease")}
              </p>
            </motion.div>
          )}
        </div>
      </NeonPanel>
    </motion.div>
  );
}

export function ErrorMessage({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur-sm"
      style={{ boxShadow: "0 0 20px rgba(239,68,68,0.1)" }}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-300">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
