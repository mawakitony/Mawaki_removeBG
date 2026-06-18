import type { CropAreaPixels } from "./types";

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

export async function cropImageBlob(
  blob: Blob,
  area: CropAreaPixels
): Promise<Blob> {
  const img = await loadImageFromBlob(blob);
  const canvas = document.createElement("canvas");
  const width = Math.max(1, Math.round(area.width));
  const height = Math.max(1, Math.round(area.height));
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas indisponible");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height
  );

  return canvasToBlob(canvas);
}

export function isFullImageCrop(
  area: CropAreaPixels,
  imageWidth: number,
  imageHeight: number
): boolean {
  const tolerance = 2;
  return (
    area.x <= tolerance &&
    area.y <= tolerance &&
    Math.abs(area.width - imageWidth) <= tolerance &&
    Math.abs(area.height - imageHeight) <= tolerance
  );
}
