"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Header } from "@/components/Header";
import { UploadZone, ErrorMessage } from "@/components/UploadZone";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { Editor } from "@/components/Editor";
import { UsageGuide } from "@/components/UsageGuide";
import { NeonPanel } from "@/components/NeonPanel";
import { useImageEditor } from "@/hooks/useImageEditor";
import { useLanguage } from "@/i18n/LanguageContext";
import { preloadRemovalModel } from "@/lib/backgroundRemoval";
import { Shield, Zap, Lock, Radio } from "lucide-react";

export default function BgRemoverApp() {
  const editor = useImageEditor();
  const { t } = useLanguage();

  useEffect(() => {
    preloadRemovalModel().catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />

      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-20">
        {!editor.hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5"
            >
              <Radio className="h-3 w-3 animate-pulse text-cyan-400" />
              <span className="font-display text-[10px] tracking-[0.25em] text-cyan-400/80 uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              <span className="holo-text">{t("hero.titleLine1")}</span>
              <br />
              <span className="text-white">{t("hero.titleLine2")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {t("hero.description")}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 font-display text-[10px] tracking-[0.2em] text-cyan-500/40 uppercase">
              <span>{t("hero.formats")}</span>
            </div>
          </motion.div>
        )}

        {editor.errorKey && (
          <div className="mb-6 w-full max-w-2xl">
            <ErrorMessage
              message={t(editor.errorKey)}
              onDismiss={editor.clearError}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!editor.hasResult ? (
            <UploadZone
              key="upload"
              onFileSelect={editor.processFile}
              previewUrl={editor.originalUrl}
              disabled={editor.isProcessing}
            />
          ) : (
            <Editor
              key="editor"
              originalUrl={editor.originalUrl}
              processedUrl={editor.processedUrl}
              backgroundMode={editor.backgroundMode}
              backgroundColor={editor.backgroundColor}
              backgroundImageUrl={editor.backgroundImageUrl}
              selectedPresetId={editor.selectedPresetId}
              isLoadingPreset={editor.isLoadingPreset}
              onModeChange={editor.setBackgroundMode}
              onColorChange={editor.setBackgroundColor}
              onImageSelect={editor.setBackgroundImage}
              onPresetSelect={editor.setBackgroundPreset}
              onDownloadTransparent={editor.downloadTransparent}
              onDownloadFinal={editor.downloadFinal}
              onReset={editor.reset}
              cropEnabled={editor.cropEnabled}
              crop={editor.crop}
              zoom={editor.zoom}
              aspect={editor.aspect}
              cropResetKey={editor.cropResetKey}
              exportPreviewUrl={editor.exportPreviewUrl}
              onCropEnabledChange={editor.setCropEnabled}
              onCropChange={editor.setCrop}
              onZoomChange={editor.setZoom}
              onAspectChange={editor.setAspect}
              onCropComplete={editor.setCroppedAreaPixels}
              onCropReset={editor.resetCrop}
            />
          )}
        </AnimatePresence>

        {!editor.hasResult && <UsageGuide />}

        {!editor.hasResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid w-full max-w-3xl gap-5 sm:grid-cols-3"
          >
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-cyan-400" />}
              title={t("features.privateTitle")}
              description={t("features.privateDesc")}
              glow="cyan"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5 text-fuchsia-400" />}
              title={t("features.fastTitle")}
              description={t("features.fastDesc")}
              glow="magenta"
            />
            <FeatureCard
              icon={<Lock className="h-5 w-5 text-violet-400" />}
              title={t("features.sessionTitle")}
              description={t("features.sessionDesc")}
              glow="violet"
            />
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {editor.isProcessing && (
          <ProcessingOverlay key="processing" progress={editor.progress} />
        )}
      </AnimatePresence>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  glow,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  glow: "cyan" | "magenta" | "violet";
}) {
  return (
    <NeonPanel glow={glow} className="p-5">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
          {icon}
        </div>
        <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </motion.div>
    </NeonPanel>
  );
}
