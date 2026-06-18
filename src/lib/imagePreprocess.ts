import { isMobileDevice } from "./deviceUtils";

const DESKTOP_MIN_LONG_EDGE = 768;
const DESKTOP_MAX_LONG_EDGE = 2048;
const MOBILE_MAX_LONG_EDGE = 1024;

function getLimits() {
  if (isMobileDevice()) {
    return { minLong: 0, maxLong: MOBILE_MAX_LONG_EDGE };
  }
  return { minLong: DESKTOP_MIN_LONG_EDGE, maxLong: DESKTOP_MAX_LONG_EDGE };
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

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Échec conversion canvas"))),
      "image/png",
      1
    );
  });
}

export async function prepareImageForRemoval(file: File): Promise<Blob> {
  const img = await loadImageFromBlob(file);
  const { width, height } = img;
  const longEdge = Math.max(width, height);
  const { minLong, maxLong } = getLimits();

  let targetLong = longEdge;
  if (minLong > 0 && longEdge < minLong) targetLong = minLong;
  if (longEdge > maxLong) targetLong = maxLong;

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

  const longOriginal = Math.max(
    originalImg.naturalWidth,
    originalImg.naturalHeight
  );
  if (isMobileDevice() && longOriginal > MOBILE_MAX_LONG_EDGE) {
    return blob;
  }

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
