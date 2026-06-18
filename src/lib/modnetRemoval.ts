import { isMobileDevice } from "./deviceUtils";

const MODEL_ID = "Xenova/modnet";

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
}

async function getSegmenter(onProgress?: (progress: number) => void) {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      await configureTransformersEnv();
      const { pipeline } = await import("@huggingface/transformers");

      return pipeline("background-removal", MODEL_ID, {
        device: "wasm",
        progress_callback: (progress) => {
          if (progress.status === "progress" && progress.total) {
            const pct = Math.round((progress.loaded / progress.total) * 15);
            onProgress?.(pct);
          }
        },
      });
    })();
  }
  return segmenterPromise;
}

export async function removeBackgroundWithModnet(
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (isMobileDevice()) {
    onProgress?.(5);
  }

  const segmenter = await getSegmenter(onProgress);
  onProgress?.(20);

  const result = await segmenter(file);
  onProgress?.(85);

  const rawImage = Array.isArray(result) ? result[0] : result;
  const blob = await rawImage.toBlob("image/png");
  onProgress?.(88);

  return blob;
}
