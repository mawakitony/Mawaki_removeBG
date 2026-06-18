function boxBlurAlpha(
  alpha: Uint8Array | Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const temp = new Float32Array(width * height);
  const out = new Float32Array(width * height);
  const kernel = radius * 2 + 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        sum += alpha[y * width + Math.min(width - 1, Math.max(0, x + k))];
      }
      temp[y * width + x] = sum / kernel;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        sum += temp[Math.min(height - 1, Math.max(0, y + k)) * width + x];
      }
      out[y * width + x] = sum / kernel;
    }
  }

  return out;
}

function erodeAlpha(
  alpha: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const out = new Uint8Array(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let min = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = Math.min(height - 1, Math.max(0, y + dy));
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          min = Math.min(min, alpha[ny * width + nx]);
        }
      }
      out[y * width + x] = min;
    }
  }
  return out;
}

function removeSmallRegions(
  alpha: Uint8Array,
  width: number,
  height: number,
  minAreaRatio = 0.003
): Uint8Array {
  const minArea = Math.floor(width * height * minAreaRatio);
  const visited = new Uint8Array(alpha.length);
  const out = new Uint8Array(alpha);
  const threshold = 90;

  for (let start = 0; start < alpha.length; start++) {
    if (visited[start] || alpha[start] < threshold) continue;

    const queue = [start];
    const component: number[] = [];
    visited[start] = 1;

    while (queue.length > 0) {
      const idx = queue.pop()!;
      component.push(idx);

      const x = idx % width;
      const y = Math.floor(idx / width);
      const neighbors = [
        y > 0 ? idx - width : -1,
        y < height - 1 ? idx + width : -1,
        x > 0 ? idx - 1 : -1,
        x < width - 1 ? idx + 1 : -1,
      ];

      for (const n of neighbors) {
        if (n >= 0 && !visited[n] && alpha[n] >= threshold) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }

    if (component.length < minArea) {
      for (const idx of component) out[idx] = 0;
    }
  }

  return out;
}

/** Supprime les bords de l'image (fantômes latéraux). */
function removeBorderBleed(
  alpha: Uint8Array,
  width: number,
  height: number,
  marginRatio = 0.025
): Uint8Array {
  const out = new Uint8Array(alpha);
  const mx = Math.floor(width * marginRatio);
  const my = Math.floor(height * marginRatio);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < mx || x >= width - mx || y < my || y >= height - my) {
        out[y * width + x] = Math.round(out[y * width + x] * 0.15);
      }
    }
  }

  return out;
}

/** Supprime logos et artefacts dans les coins sans toucher au sujet principal. */
function removeCornerArtifacts(
  alpha: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const cornerW = Math.floor(width * 0.22);
  const cornerH = Math.floor(height * 0.16);

  let subjectMinX = width;
  let subjectMaxX = 0;
  let subjectMinY = height;
  let subjectMaxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] >= 80) {
        subjectMinX = Math.min(subjectMinX, x);
        subjectMaxX = Math.max(subjectMaxX, x);
        subjectMinY = Math.min(subjectMinY, y);
        subjectMaxY = Math.max(subjectMaxY, y);
      }
    }
  }

  const padX = Math.floor(width * 0.02);
  const padY = Math.floor(height * 0.02);
  const hasSubject = subjectMaxX >= subjectMinX;

  const corners = [
    { x0: 0, y0: height - cornerH, x1: cornerW, y1: height },
    { x0: width - cornerW, y0: height - cornerH, x1: width, y1: height },
    { x0: 0, y0: 0, x1: cornerW, y1: cornerH },
    { x0: width - cornerW, y0: 0, x1: width, y1: cornerH },
  ];

  for (const { x0, y0, x1, y1 } of corners) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (
          hasSubject &&
          x >= subjectMinX - padX &&
          x <= subjectMaxX + padX &&
          y >= subjectMinY - padY &&
          y <= subjectMaxY + padY
        ) {
          continue;
        }
        out[y * width + x] = 0;
      }
    }
  }

  return out;
}

/** Retire les zones latérales déconnectées du sujet principal. */
function removeDisconnectedSides(
  alpha: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const threshold = 100;
  const visited = new Uint8Array(alpha.length);
  const components: { pixels: number[]; minX: number; maxX: number; area: number }[] = [];

  for (let start = 0; start < alpha.length; start++) {
    if (visited[start] || alpha[start] < threshold) continue;

    const queue = [start];
    const pixels: number[] = [];
    let minX = width;
    let maxX = 0;
    visited[start] = 1;

    while (queue.length > 0) {
      const idx = queue.pop()!;
      pixels.push(idx);
      const x = idx % width;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);

      const y = Math.floor(idx / width);
      const neighbors = [
        y > 0 ? idx - width : -1,
        y < height - 1 ? idx + width : -1,
        x > 0 ? idx - 1 : -1,
        x < width - 1 ? idx + 1 : -1,
      ];

      for (const n of neighbors) {
        if (n >= 0 && !visited[n] && alpha[n] >= threshold) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }

    components.push({ pixels, minX, maxX, area: pixels.length });
  }

  if (components.length <= 1) return out;

  components.sort((a, b) => b.area - a.area);
  const main = components[0];
  const mainCenterX = (main.minX + main.maxX) / 2;

  for (let c = 1; c < components.length; c++) {
    const comp = components[c];
    const compCenterX = (comp.minX + comp.maxX) / 2;
    const distFromMain = Math.abs(compCenterX - mainCenterX) / width;
    const isSmall = comp.area < main.area * 0.12;
    const isFarSide = distFromMain > 0.12;

    if (isSmall || isFarSide) {
      for (const idx of comp.pixels) out[idx] = 0;
    }
  }

  return out;
}

function refineAlphaValues(alpha: Float32Array): Uint8Array {
  const out = new Uint8Array(alpha.length);
  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 25) out[i] = 0;
    else if (a > 230) out[i] = 255;
    else out[i] = Math.round(Math.pow(a / 255, 0.68) * 255);
  }
  return out;
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

function getAlphaChannel(data: Uint8ClampedArray, width: number, height: number): Uint8Array {
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alpha[i] = data[i * 4 + 3];
  }
  return alpha;
}

type RGB = { r: number; g: number; b: number };

function sampleBackgroundColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): RGB {
  const samples: RGB[] = [];
  const margin = Math.floor(Math.min(width, height) * 0.04);
  const points = [
    [margin, margin],
    [width - margin, margin],
    [margin, height - margin],
    [width - margin, height - margin],
    [Math.floor(width / 2), margin],
    [Math.floor(width / 2), height - margin],
  ];

  for (const [x, y] of points) {
    const i = (y * width + x) * 4;
    samples.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  return {
    r: samples.reduce((s, c) => s + c.r, 0) / samples.length,
    g: samples.reduce((s, c) => s + c.g, 0) / samples.length,
    b: samples.reduce((s, c) => s + c.b, 0) / samples.length,
  };
}

function decontaminateEdges(
  data: Uint8ClampedArray,
  bgColor: RGB,
  strength = 0.9
): void {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a <= 0.03 || a >= 0.97) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const spill = (1 - a) * strength;

    data[i] = Math.round(r + (bgColor.r - r) * spill * 0.45);
    data[i + 1] = Math.round(g + (bgColor.g - g) * spill * 0.45);
    data[i + 2] = Math.round(b + (bgColor.b - b) * spill * 0.45);

    const warmth = Math.max(0, r - Math.max(g, b));
    if (warmth > 15) {
      const warmSpill = warmth * (1 - a) * 0.75;
      data[i] = Math.max(0, Math.round(data[i] - warmSpill));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] + warmSpill * 0.2));
    }
  }
}

function applyAlphaToData(data: Uint8ClampedArray, alpha: Uint8Array): void {
  for (let i = 0; i < alpha.length; i++) {
    data[i * 4 + 3] = alpha[i];
    if (alpha[i] === 0) {
      data[i * 4] = 0;
      data[i * 4 + 1] = 0;
      data[i * 4 + 2] = 0;
    }
  }
}

export function cleanSubjectAlpha(
  alpha: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  let result: Uint8Array = new Uint8Array(alpha);
  result = new Uint8Array(removeBorderBleed(result, width, height));
  result = new Uint8Array(removeSmallRegions(result, width, height, 0.0008));
  result = new Uint8Array(removeCornerArtifacts(result, width, height));
  result = new Uint8Array(removeDisconnectedSides(result, width, height));
  result = new Uint8Array(erodeAlpha(result, width, height, 1));
  const blurred = boxBlurAlpha(result, width, height, 1);
  return refineAlphaValues(blurred);
}

export async function refineMaskBlob(maskBlob: Blob): Promise<Blob> {
  const img = await loadImageFromBlob(maskBlob);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return maskBlob;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let alpha = getAlphaChannel(data, width, height);
  alpha = cleanSubjectAlpha(alpha, width, height);

  for (let i = 0; i < alpha.length; i++) {
    const idx = i * 4;
    data[idx] = 255;
    data[idx + 1] = 255;
    data[idx + 2] = 255;
    data[idx + 3] = alpha[i];
  }

  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(canvas);
}

export async function postProcessCutout(
  cutoutBlob: Blob,
  originalBlob?: Blob,
  _personMask?: Uint8Array | null
): Promise<Blob> {
  const img = await loadImageFromBlob(cutoutBlob);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return cutoutBlob;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let alpha = getAlphaChannel(data, width, height);

  let bgColor: RGB = { r: 128, g: 128, b: 128 };
  if (originalBlob) {
    const originalImg = await loadImageFromBlob(originalBlob);
    const oCanvas = document.createElement("canvas");
    oCanvas.width = width;
    oCanvas.height = height;
    const oCtx = oCanvas.getContext("2d");
    if (oCtx) {
      oCtx.drawImage(originalImg, 0, 0, width, height);
      const originalData = oCtx.getImageData(0, 0, width, height);
      bgColor = sampleBackgroundColor(originalData.data, width, height);
    }
  }

  alpha = cleanSubjectAlpha(alpha, width, height);
  applyAlphaToData(data, alpha);

  decontaminateEdges(data, bgColor, 0.95);
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(canvas);
}
