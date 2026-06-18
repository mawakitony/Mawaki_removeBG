"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Point } from "react-easy-crop";
import { removeImageBackground } from "@/lib/backgroundRemoval";
import {
  revokeAllObjectUrls,
  revokeObjectUrl,
  trackObjectUrl,
} from "@/lib/cleanup";
import { buildExportBlob, downloadBlob } from "@/lib/imageCompositor";
import { fetchImageAsBlob } from "@/lib/fetchBackgroundImage";
import type { PresetBackground } from "@/lib/presetBackgrounds";
import type { BackgroundMode, CropAreaPixels } from "@/lib/types";

import type { TranslationKey } from "@/i18n/translations";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
const MAX_SIZE = 25 * 1024 * 1024;
const DEFAULT_CROP: Point = { x: 0, y: 0 };
const DEFAULT_ZOOM = 1;

export type EditorErrorKey = Extract<
  TranslationKey,
  | "errors.unsupportedFormat"
  | "errors.fileTooLarge"
  | "errors.removalFailed"
  | "errors.bgFormatUnsupported"
  | "errors.bgLoadFailed"
>;

export function useImageEditor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("transparent");
  const [backgroundColor, setBackgroundColor] = useState("#6366f1");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorKey, setErrorKey] = useState<EditorErrorKey | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isLoadingPreset, setIsLoadingPreset] = useState(false);
  const [cropEnabled, setCropEnabled] = useState(false);
  const [crop, setCrop] = useState<Point>(DEFAULT_CROP);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CropAreaPixels | null>(null);
  const [exportPreviewUrl, setExportPreviewUrl] = useState<string | null>(null);
  const [cropResetKey, setCropResetKey] = useState(0);
  const previewRequestRef = useRef(0);

  const resetCropState = useCallback(() => {
    setCropEnabled(false);
    setCrop(DEFAULT_CROP);
    setZoom(DEFAULT_ZOOM);
    setAspect(undefined);
    setCroppedAreaPixels(null);
    setCropResetKey((key) => key + 1);
  }, []);

  const reset = useCallback(() => {
    revokeObjectUrl(originalUrl);
    revokeObjectUrl(processedUrl);
    revokeObjectUrl(backgroundImageUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setBackgroundMode("transparent");
    setBackgroundColor("#6366f1");
    setBackgroundImageUrl(null);
    setIsProcessing(false);
    setProgress(0);
    setErrorKey(null);
    setSelectedPresetId(null);
    setIsLoadingPreset(false);
    resetCropState();
    setExportPreviewUrl((prev) => {
      revokeObjectUrl(prev);
      return null;
    });
  }, [originalUrl, processedUrl, backgroundImageUrl, resetCropState]);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorKey("errors.unsupportedFormat");
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrorKey("errors.fileTooLarge");
      return;
    }

    setErrorKey(null);
    setIsProcessing(true);
    setProgress(0);
    resetCropState();
    setExportPreviewUrl((prev) => {
      revokeObjectUrl(prev);
      return null;
    });

    const url = trackObjectUrl(URL.createObjectURL(file));
    setOriginalFile(file);
    setOriginalUrl(url);

    try {
      const blob = await removeImageBackground(file, setProgress);
      const resultUrl = trackObjectUrl(URL.createObjectURL(blob));
      setProcessedBlob(blob);
      setProcessedUrl(resultUrl);
    } catch {
      setErrorKey("errors.removalFailed");
      revokeObjectUrl(url);
      setOriginalFile(null);
      setOriginalUrl(null);
    } finally {
      setIsProcessing(false);
    }
  }, [resetCropState]);

  const handleBackgroundImage = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorKey("errors.bgFormatUnsupported");
      return;
    }
    setErrorKey(null);
    setSelectedPresetId(null);
    setBackgroundMode("image");
    setBackgroundImageUrl((prev) => {
      revokeObjectUrl(prev);
      return trackObjectUrl(URL.createObjectURL(file));
    });
  }, []);

  const handlePresetBackground = useCallback(async (preset: PresetBackground) => {
    setErrorKey(null);
    setIsLoadingPreset(true);
    setSelectedPresetId(preset.id);

    try {
      const blob = await fetchImageAsBlob(preset.fullUrl);
      setBackgroundMode("image");
      setBackgroundImageUrl((prev) => {
        revokeObjectUrl(prev);
        return trackObjectUrl(URL.createObjectURL(blob));
      });
    } catch {
      setErrorKey("errors.bgLoadFailed");
      setSelectedPresetId(null);
    } finally {
      setIsLoadingPreset(false);
    }
  }, []);

  const changeBackgroundMode = useCallback((mode: BackgroundMode) => {
    setBackgroundMode(mode);
    setErrorKey(null);
  }, []);

  const changeBackgroundColor = useCallback((color: string) => {
    setBackgroundColor(color);
    setBackgroundMode("color");
    setErrorKey(null);
  }, []);

  const getActiveCrop = useCallback((): CropAreaPixels | null => {
    if (!cropEnabled || !croppedAreaPixels) return null;
    return croppedAreaPixels;
  }, [cropEnabled, croppedAreaPixels]);

  const downloadTransparent = useCallback(async () => {
    if (!processedBlob || !originalFile) return;
    const name = originalFile.name.replace(/\.[^.]+$/, "") + "-transparent.png";
    const blob = await buildExportBlob(processedBlob, {
      backgroundMode: "transparent",
      backgroundColor,
      backgroundImageUrl,
      crop: getActiveCrop(),
    });
    downloadBlob(blob, name);
  }, [
    processedBlob,
    originalFile,
    backgroundColor,
    backgroundImageUrl,
    getActiveCrop,
  ]);

  const downloadFinal = useCallback(async () => {
    if (!processedBlob || !originalFile) return;
    const name = originalFile.name.replace(/\.[^.]+$/, "") + "-final.png";
    const blob = await buildExportBlob(processedBlob, {
      backgroundMode,
      backgroundColor,
      backgroundImageUrl,
      crop: getActiveCrop(),
    });
    downloadBlob(blob, name);
  }, [
    processedBlob,
    originalFile,
    backgroundMode,
    backgroundColor,
    backgroundImageUrl,
    getActiveCrop,
  ]);

  const resetCrop = useCallback(() => {
    setCrop(DEFAULT_CROP);
    setZoom(DEFAULT_ZOOM);
    setAspect(undefined);
    setCroppedAreaPixels(null);
    setCropResetKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!processedBlob || !cropEnabled) {
      setExportPreviewUrl((prev) => {
        revokeObjectUrl(prev);
        return null;
      });
      return;
    }

    const activeCrop = croppedAreaPixels;
    const requestId = ++previewRequestRef.current;

    const timer = window.setTimeout(async () => {
      try {
        const blob = await buildExportBlob(processedBlob, {
          backgroundMode,
          backgroundColor,
          backgroundImageUrl,
          crop: activeCrop,
        });

        if (previewRequestRef.current !== requestId) return;

        const url = trackObjectUrl(URL.createObjectURL(blob));
        setExportPreviewUrl((prev) => {
          revokeObjectUrl(prev);
          return url;
        });
      } catch {
        if (previewRequestRef.current !== requestId) return;
        setExportPreviewUrl((prev) => {
          revokeObjectUrl(prev);
          return null;
        });
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [
    processedBlob,
    backgroundMode,
    backgroundColor,
    backgroundImageUrl,
    cropEnabled,
    croppedAreaPixels,
  ]);

  useEffect(() => {
    const handleBeforeUnload = () => revokeAllObjectUrls();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      revokeAllObjectUrls();
    };
  }, []);

  return {
    originalUrl,
    processedUrl,
    backgroundMode,
    backgroundColor,
    backgroundImageUrl,
    selectedPresetId,
    isLoadingPreset,
    isProcessing,
    progress,
    errorKey,
    hasResult: !!processedBlob,
    cropEnabled,
    crop,
    zoom,
    aspect,
    cropResetKey,
    exportPreviewUrl,
    processFile,
    reset,
    setBackgroundMode: changeBackgroundMode,
    setBackgroundColor: changeBackgroundColor,
    setBackgroundImage: handleBackgroundImage,
    setBackgroundPreset: handlePresetBackground,
    setCropEnabled,
    setCrop,
    setZoom,
    setAspect,
    setCroppedAreaPixels,
    resetCrop,
    downloadTransparent,
    downloadFinal,
    clearError: () => setErrorKey(null),
  };
}
