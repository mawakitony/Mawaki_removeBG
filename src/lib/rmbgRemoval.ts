const MODEL_ID = "briaai/RMBG-1.4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let segmenterPromise: Promise<any> | null = null;

async function getSegmenter(
  onProgress?: (progress: number) => void
) {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      return pipeline("background-removal", MODEL_ID, {
        device: "webgpu",
        progress_callback: (progress) => {
          if (progress.status === "progress" && progress.total) {
            const pct = Math.round((progress.loaded / progress.total) * 12);
            onProgress?.(pct);
          }
        },
      });
    })();
  }
  return segmenterPromise;
}

export async function preloadRmbgModel(
  onProgress?: (progress: number) => void
): Promise<void> {
  await getSegmenter(onProgress);
}

export async function removeBackgroundWithRmbg(
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const segmenter = await getSegmenter(onProgress);
  onProgress?.(15);

  const result = await segmenter(file);
  onProgress?.(85);

  const rawImage = Array.isArray(result) ? result[0] : result;
  const blob = await rawImage.toBlob("image/png");
  onProgress?.(88);

  return blob;
}
