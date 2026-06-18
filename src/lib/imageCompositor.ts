import type { BackgroundMode, CropAreaPixels } from "./types";
import { cropImageBlob } from "./imageCrop";

type CompositeOptions = {
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  backgroundImageUrl: string | null;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function compositeImage(
  foregroundBlob: Blob,
  options: CompositeOptions
): Promise<Blob> {
  const foregroundUrl = URL.createObjectURL(foregroundBlob);
  const foreground = await loadImage(foregroundUrl);
  URL.revokeObjectURL(foregroundUrl);

  const canvas = document.createElement("canvas");
  canvas.width = foreground.naturalWidth;
  canvas.height = foreground.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible de créer le contexte canvas");

  if (options.backgroundMode === "color") {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (
    options.backgroundMode === "image" &&
    options.backgroundImageUrl
  ) {
    const background = await loadImage(options.backgroundImageUrl);
    const scale = Math.max(
      canvas.width / background.naturalWidth,
      canvas.height / background.naturalHeight
    );
    const w = background.naturalWidth * scale;
    const h = background.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(background, x, y, w, h);
  }

  ctx.drawImage(foreground, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Échec de la génération de l'image"));
      },
      "image/png",
      1
    );
  });
}

export async function buildExportBlob(
  processedBlob: Blob,
  options: CompositeOptions & { crop?: CropAreaPixels | null }
): Promise<Blob> {
  let blob = processedBlob;

  if (options.crop) {
    blob = await cropImageBlob(blob, options.crop);
  }

  if (options.backgroundMode === "transparent") {
    return blob;
  }

  return compositeImage(blob, {
    backgroundMode: options.backgroundMode,
    backgroundColor: options.backgroundColor,
    backgroundImageUrl: options.backgroundImageUrl,
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
