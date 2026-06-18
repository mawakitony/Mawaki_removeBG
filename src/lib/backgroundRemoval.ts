import type { Config } from "@imgly/background-removal";
import { buildIsolatedCutout } from "./applyMask";
import {
  prepareImageForRemoval,
  restoreOriginalDimensions,
} from "./imagePreprocess";
import { postProcessCutout, refineMaskBlob } from "./maskRefinement";
import {
  getImageDimensions,
  getPersonMask,
  preloadPersonModel,
} from "./personSegmentation";
import { preloadRmbgModel, removeBackgroundWithRmbg } from "./rmbgRemoval";

function buildImglyConfig(onProgress?: (progress: number) => void): Config {
  return {
    model: "isnet",
    device: "gpu",
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
  const refinedMask = await refineMaskBlob(maskBlob);
  const cutout = await applySegmentationMask(prepared, refinedMask, config);
  const processed = await postProcessCutout(cutout, prepared);
  return restoreOriginalDimensions(processed, originalFile);
}

export async function preloadRemovalModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  await Promise.allSettled([
    preloadRmbgModel(onProgress),
    preloadPersonModel(),
    import("@imgly/background-removal").then(({ preload }) =>
      preload(buildImglyConfig())
    ),
  ]);
}

export async function removeImageBackground(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(2);
  const prepared = await prepareImageForRemoval(file);
  const { width, height } = await getImageDimensions(prepared);
  onProgress?.(6);

  try {
    onProgress?.(8);

    const [rmbgCutout, personMask] = await Promise.all([
      removeBackgroundWithRmbg(prepared, onProgress),
      getPersonMask(prepared, width, height).catch(() => null),
    ]);

    onProgress?.(86);

    const isolated = await buildIsolatedCutout(
      prepared,
      rmbgCutout,
      personMask
    );
    onProgress?.(92);

    const processed = await postProcessCutout(isolated, prepared, personMask);
    onProgress?.(97);

    const final = await restoreOriginalDimensions(processed, file);
    onProgress?.(100);
    return final;
  } catch {
    onProgress?.(20);
    return removeWithImgly(prepared, file, onProgress);
  }
}
