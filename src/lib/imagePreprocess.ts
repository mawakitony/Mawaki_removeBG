const MIN_LONG_EDGE = 768;
const MAX_LONG_EDGE = 2048;

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

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Échec conversion canvas"))),
      "image/png",
      1
    );
  });
}

/**
 * Upscale les petites images et limite les très grandes
 * pour maximiser la précision du modèle (inférence à 1024px).
 */
export async function prepareImageForRemoval(file: File): Promise<Blob> {
  const img = await loadImageFromBlob(file);
  const { width, height } = img;
  const longEdge = Math.max(width, height);

  let targetLong = longEdge;
  if (longEdge < MIN_LONG_EDGE) targetLong = MIN_LONG_EDGE;
  if (longEdge > MAX_LONG_EDGE) targetLong = MAX_LONG_EDGE;

  if (targetLong === longEdge) {
    return file;
  }

  const scale = targetLong / longEdge;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return file;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  return canvasToBlob(canvas);
}

export async function restoreOriginalDimensions(
  blob: Blob,
  originalFile: File
): Promise<Blob> {
  const [resultImg, originalImg] = await Promise.all([
    loadImageFromBlob(blob),
    loadImageFromBlob(originalFile),
  ]);

  if (
    resultImg.naturalWidth === originalImg.naturalWidth &&
    resultImg.naturalHeight === originalImg.naturalHeight
  ) {
    return blob;
  }

  const canvas = document.createElement("canvas");
  canvas.width = originalImg.naturalWidth;
  canvas.height = originalImg.naturalHeight;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return blob;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    resultImg,
    0,
    0,
    originalImg.naturalWidth,
    originalImg.naturalHeight
  );

  return canvasToBlob(canvas);
}
