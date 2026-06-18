import type { Config } from "@imgly/background-removal";
import {
  prepareImageForRemoval,
  restoreOriginalDimensions,
} from "./imagePreprocess";
import { postProcessCutout } from "./maskRefinement";

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

  const { removeBackground, preload } = await import(
    "@imgly/background-removal"
  );
  const config = buildImglyConfig(onProgress);

  await preload(config);
  onProgress?.(30);

  const prepared = await prepareImageForRemoval(file);
  onProgress?.(35);

  const cutout = await removeBackground(prepared, config);
  onProgress?.(90);

  const processed = await postProcessCutout(cutout, prepared);
  const final = await restoreOriginalDimensions(processed, file);
  onProgress?.(100);
  return final;
}
