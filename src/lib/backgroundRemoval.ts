import type { Config } from "@imgly/background-removal";
import {
  prepareImageForRemoval,
  restoreOriginalDimensions,
} from "./imagePreprocess";
import { postProcessCutout, refineMaskBlob } from "./maskRefinement";
import { removeBackgroundWithRmbg } from "./rmbgRemoval";

function supportsWebGpu(): boolean {
  if (typeof navigator === "undefined") return false;
  return "gpu" in navigator;
}

function buildImglyConfig(onProgress?: (progress: number) => void): Config {
  return {
    model: "isnet",
    device: supportsWebGpu() ? "gpu" : "cpu",
    rescale: true,
    proxyToWorker: true,
    output: { format: "image/png", quality: 1 },
    progress: onProgress
      ? (key, current, total) => {
          if (total > 0) {
            const isDownload = key.includes("fetch") || key.includes("download");
            const base = isDownload ? 0 : 15;
            const range = isDownload ? 15 : 70;
            onProgress(base + Math.round((current / total) * range));
          }
        }
      : undefined,
  };
}

async function removeWithImgly(
  prepared: Blob,
  originalFile: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { segmentForeground, applySegmentationMask } = await import(
    "@imgly/background-removal"
  );
  const config = buildImglyConfig(onProgress);

  const maskBlob = await segmentForeground(prepared, config);
  onProgress?.(82);
  const refinedMask = await refineMaskBlob(maskBlob);
  const cutout = await applySegmentationMask(prepared, refinedMask, config);
  onProgress?.(92);
  const processed = await postProcessCutout(cutout, prepared);
  return restoreOriginalDimensions(processed, originalFile);
}

async function removeWithRmbgFallback(
  prepared: Blob,
  originalFile: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(20);
  const cutout = await removeBackgroundWithRmbg(prepared, onProgress);
  onProgress?.(90);
  const processed = await postProcessCutout(cutout, prepared);
  return restoreOriginalDimensions(processed, originalFile);
}

let preloadPromise: Promise<void> | null = null;

export async function preloadRemovalModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  if (!preloadPromise) {
    preloadPromise = (async () => {
      const { preload } = await import("@imgly/background-removal");
      await preload(buildImglyConfig(onProgress));
    })();
  }
  await preloadPromise;
}

export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(2);
  await preloadRemovalModel(onProgress);
  const prepared = await prepareImageForRemoval(file);
  onProgress?.(8);

  try {
    const result = await removeWithImgly(prepared, file, onProgress);
    onProgress?.(100);
    return result;
  } catch {
    onProgress?.(12);
    try {
      const result = await removeWithRmbgFallback(prepared, file, onProgress);
      onProgress?.(100);
      return result;
    } catch {
      throw new Error("Background removal failed");
    }
  }
}
