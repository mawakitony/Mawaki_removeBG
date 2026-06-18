const PERSON_LABELS = new Set([
  "person",
  "man",
  "woman",
  "boy",
  "girl",
  "people",
  "human",
  "child",
  "adult",
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let segmenterPromise: Promise<any> | null = null;

async function getPersonSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      try {
        return await pipeline(
          "image-segmentation",
          "Xenova/segformer-b0-finetuned-ade-512-512",
          { device: "webgpu" }
        );
      } catch {
        return pipeline(
          "image-segmentation",
          "Xenova/segformer-b0-finetuned-ade-512-512",
          { device: "wasm" }
        );
      }
    })();
  }
  return segmenterPromise;
}

export async function preloadPersonModel(): Promise<void> {
  await getPersonSegmenter();
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Fusionne les masques « personne » détectés par SegFormer. */
export async function getPersonMask(
  imageBlob: Blob,
  width: number,
  height: number
): Promise<Uint8Array | null> {
  const segmenter = await getPersonSegmenter();
  const result = await segmenter(imageBlob);

  const segments = (Array.isArray(result) ? result : [result]).filter(
    (s: { label?: string | null }) =>
      s.label && PERSON_LABELS.has(s.label.toLowerCase())
  );

  if (segments.length === 0) return null;

  const combined = new Uint8Array(width * height);

  for (const segment of segments) {
    const mask = segment.mask as {
      data: Uint8Array | Uint8ClampedArray;
      width: number;
      height: number;
      channels: number;
      resize: (w: number, h: number) => unknown;
    };

    let maskData = mask;
    if (mask.width !== width || mask.height !== height) {
      maskData = mask.resize(width, height) as typeof mask;
    }

    const data = maskData.data;
    const channels = maskData.channels;

    for (let i = 0; i < width * height; i++) {
      const value = channels === 1 ? data[i] : data[i * channels];
      if (value > combined[i]) combined[i] = value;
    }
  }

  const coverage = combined.filter((v) => v > 60).length / combined.length;
  if (coverage < 0.003) return null;

  return combined;
}

export async function getImageDimensions(
  blob: Blob
): Promise<{ width: number; height: number }> {
  const img = await loadImageFromBlob(blob);
  return { width: img.naturalWidth, height: img.naturalHeight };
}
