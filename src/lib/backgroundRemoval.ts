import type { Config } from "@imgly/background-removal";
import {
  prepareImageForRemoval,
  restoreOriginalDimensions,
} from "./imagePreprocess";
import { postProcessCutout } from "./maskRefinement";
import { removeBackgroundWithModnet } from "./modnetRemoval";

const IMGLY_PUBLIC_PATH = "/bg-removal-data/";

function buildImglyConfig(onProgress?: (progress: number) => void): Config {
  return {
    publicPath: IMGLY_PUBLIC_PATH,
    model: "isnet_quint8",
    device: "cpu",
    rescale: true,
    proxyToWorker: false,
    debug: process.env.NODE_ENV === "development",
    output: { format: "image/png", quality: 1 },
    progress: onProgress
      ? (key, current, total) => {
          if (total > 0) {
            const isDownload = key.includes("fetch") || key.includes("download");
            const base = isDownload ? 5 : 20;
            const range = isDownload ? 25 : 65;
            onProgress(base + Math.round((current / total) * range));
          }
        }
      : undefined,
  };
}

async function safePostProcess(
  cutout: Blob,
  prepared: Blob
): Promise<Blob> {
  try {
    return await postProcessCutout(cutout, prepared);
  } catch {
    return cutout;
  }
}

async function removeWithImgly(
  prepared: Blob,
  originalFile: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { removeBackground, preload } = await import(
    "@imgly/background-removal"
  );
  const config = buildImglyConfig(onProgress);
  await preload(config);
  onProgress?.(40);

  const cutout = await removeBackground(prepared, config);
  onProgress?.(88);
  const processed = await safePostProcess(cutout, prepared);
  return restoreOriginalDimensions(processed, originalFile);
}

async function removeWithModnet(
  prepared: Blob,
  originalFile: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);
  const cutout = await removeBackgroundWithModnet(prepared, onProgress);
  onProgress?.(88);
  const processed = await safePostProcess(cutout, prepared);
  return restoreOriginalDimensions(processed, originalFile);
}

export async function preloadRemovalModel(): Promise<void> {
  // Chargement paresseux à l'upload.
}

export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(2);
  const prepared = await prepareImageForRemoval(file);
  onProgress?.(8);

  const errors: unknown[] = [];

  try {
    const result = await removeWithImgly(prepared, file, onProgress);
    onProgress?.(100);
    return result;
  } catch (error) {
    errors.push(error);
  }

  try {
    onProgress?.(12);
    const result = await removeWithModnet(prepared, file, onProgress);
    onProgress?.(100);
    return result;
  } catch (error) {
    errors.push(error);
  }

  console.error("Background removal failed:", errors);
  throw new Error("Background removal failed");
}
