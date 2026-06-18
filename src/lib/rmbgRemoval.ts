import { isMobileDevice } from "./deviceUtils";

const MODEL_ID = "briaai/RMBG-1.4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let segmenterPromise: Promise<any> | null = null;

async function configureTransformersEnv() {
  const { env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  if (env.backends.onnx.wasm) {
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
  }
  return env;
}

async function createSegmenter(
  device: "webgpu" | "wasm",
  onProgress?: (progress: number) => void
) {
  await configureTransformersEnv();
  const { pipeline } = await import("@huggingface/transformers");

  return pipeline("background-removal", MODEL_ID, {
    device,
    progress_callback: (progress) => {
      if (progress.status === "progress" && progress.total) {
        const pct = Math.round((progress.loaded / progress.total) * 12);
        onProgress?.(pct);
      }
    },
  });
}

async function getSegmenter(onProgress?: (progress: number) => void) {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const canTryWebGpu =
        !isMobileDevice() &&
        typeof navigator !== "undefined" &&
        "gpu" in navigator;

      if (canTryWebGpu) {
        try {
          return await createSegmenter("webgpu", onProgress);
        } catch {
          segmenterPromise = null;
        }
      }

      return createSegmenter("wasm", onProgress);
    })();
  }
  return segmenterPromise;
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
