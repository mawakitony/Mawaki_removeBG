import { cleanSubjectAlpha } from "./maskRefinement";
import { isolateSubjectAlpha } from "./subjectIsolation";

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

export function extractAlphaFromCutout(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alpha[i] = data[i * 4 + 3];
  }
  return alpha;
}

/** RMBG = source de vérité pour le sujet ; le masque personne sert uniquement à retirer les artefacts. */
export function preserveRmbgSubject(rmbgAlpha: Uint8Array): Uint8Array {
  return new Uint8Array(rmbgAlpha);
}

export async function applyAlphaMaskToImage(
  imageBlob: Blob,
  alpha: Uint8Array,
  width: number,
  height: number
): Promise<Blob> {
  const img = await loadImageFromBlob(imageBlob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas indisponible");

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    const idx = i * 4;
    data[idx + 3] = a;
    if (a === 0) {
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(canvas);
}

export async function buildIsolatedCutout(
  originalBlob: Blob,
  rmbgCutout: Blob,
  personMask: Uint8Array | null
): Promise<Blob> {
  const [rmbgImg, originalImg] = await Promise.all([
    loadImageFromBlob(rmbgCutout),
    loadImageFromBlob(originalBlob),
  ]);
  const width = rmbgImg.naturalWidth;
  const height = rmbgImg.naturalHeight;

  const rCanvas = document.createElement("canvas");
  rCanvas.width = width;
  rCanvas.height = height;
  const rCtx = rCanvas.getContext("2d", { alpha: true });
  if (!rCtx) return rmbgCutout;

  rCtx.drawImage(rmbgImg, 0, 0);
  const rmbgData = rCtx.getImageData(0, 0, width, height);

  const oCanvas = document.createElement("canvas");
  oCanvas.width = width;
  oCanvas.height = height;
  const oCtx = oCanvas.getContext("2d", { alpha: true });
  if (!oCtx) return rmbgCutout;
  oCtx.drawImage(originalImg, 0, 0, width, height);
  const originalData = oCtx.getImageData(0, 0, width, height);

  let alpha = preserveRmbgSubject(extractAlphaFromCutout(rmbgData.data, width, height));

  alpha = isolateSubjectAlpha(
    alpha,
    width,
    height,
    personMask,
    originalData.data
  );

  alpha = cleanSubjectAlpha(alpha, width, height);

  return applyAlphaMaskToImage(originalBlob, alpha, width, height);
}
