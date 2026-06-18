function dilateAlpha(
  alpha: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const out = new Uint8Array(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let max = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = Math.min(height - 1, Math.max(0, y + dy));
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          max = Math.max(max, alpha[ny * width + nx]);
        }
      }
      out[y * width + x] = max;
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

/** Ouvre le masque pour couper les liens fins entre sujet et artefacts UI. */
export function openAlpha(
  alpha: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const eroded = erodeAlpha(alpha, width, height, radius);
  return dilateAlpha(eroded, width, height, radius);
}

/** Ne garde l'alpha que dans la zone du sujet (personne). */
export function constrainToPersonRegion(
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const margin = Math.max(6, Math.round(Math.min(width, height) * 0.012));
  const allowed = dilateAlpha(personMask, width, height, margin);
  const out = new Uint8Array(alpha.length);

  for (let i = 0; i < alpha.length; i++) {
    if (allowed[i] < 40) {
      out[i] = 0;
    } else {
      out[i] = Math.min(alpha[i], allowed[i]);
    }
  }

  return out;
}

function getPersonBBox(
  personMask: Uint8Array,
  width: number,
  height: number,
  threshold = 55
): { minX: number; maxX: number; minY: number; maxY: number } | null {
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (personMask[y * width + x] > threshold) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;
  return { minX, maxX, minY, maxY };
}

/** Coupe tout ce qui est hors du cadre de la personne (hologrammes latéraux, sol…). */
export function clipAlphaToPersonBBox(
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number,
  padRatio = 0.055
): Uint8Array {
  const bbox = getPersonBBox(personMask, width, height);
  if (!bbox) return alpha;

  const padX = Math.max(8, Math.round(width * padRatio));
  const padY = Math.max(8, Math.round(height * padRatio));
  const x0 = Math.max(0, bbox.minX - padX);
  const x1 = Math.min(width, bbox.maxX + padX + 1);
  const y0 = Math.max(0, bbox.minY - padY);
  const y1 = Math.min(height, bbox.maxY + padY + 1);

  const out = new Uint8Array(alpha);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < x0 || x >= x1 || y < y0 || y >= y1) {
        out[y * width + x] = 0;
      }
    }
  }

  return out;
}

/** Ne conserve que l'alpha relié au noyau de la personne (coupe les ponts avec artefacts). */
export function keepAlphaReachableFromPerson(
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha.length);
  const visited = new Uint8Array(alpha.length);
  const coreRadius = Math.max(2, Math.round(Math.min(width, height) * 0.006));
  const core = erodeAlpha(personMask, width, height, coreRadius);
  const queue: number[] = [];
  const alphaThreshold = 50;

  for (let i = 0; i < alpha.length; i++) {
    if (core[i] > 90 && alpha[i] >= alphaThreshold) {
      visited[i] = 1;
      queue.push(i);
      out[i] = alpha[i];
    }
  }

  if (queue.length === 0) {
    for (let i = 0; i < alpha.length; i++) {
      if (personMask[i] > 80 && alpha[i] >= alphaThreshold) {
        visited[i] = 1;
        queue.push(i);
        out[i] = alpha[i];
      }
    }
  }

  while (queue.length > 0) {
    const idx = queue.shift()!;
    const x = idx % width;
    const y = Math.floor(idx / width);

    const neighbors = [
      y > 0 ? idx - width : -1,
      y < height - 1 ? idx + width : -1,
      x > 0 ? idx - 1 : -1,
      x < width - 1 ? idx + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n < 0 || visited[n] || alpha[n] < alphaThreshold) continue;
      visited[n] = 1;
      out[n] = alpha[n];
      queue.push(n);
    }
  }

  return out;
}

type Component = {
  pixels: number[];
  area: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  personOverlap: number;
};

function findComponents(
  alpha: Uint8Array,
  width: number,
  height: number,
  threshold = 80
): Component[] {
  const visited = new Uint8Array(alpha.length);
  const components: Component[] = [];

  for (let start = 0; start < alpha.length; start++) {
    if (visited[start] || alpha[start] < threshold) continue;

    const queue = [start];
    const pixels: number[] = [];
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    visited[start] = 1;

    while (queue.length > 0) {
      const idx = queue.pop()!;
      pixels.push(idx);
      const x = idx % width;
      const y = Math.floor(idx / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

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

    components.push({
      pixels,
      area: pixels.length,
      minX,
      maxX,
      minY,
      maxY,
      personOverlap: 0,
    });
  }

  return components;
}

function computePersonOverlap(
  pixels: number[],
  personMask: Uint8Array
): number {
  if (pixels.length === 0) return 0;
  let hits = 0;
  for (const idx of pixels) {
    if (personMask[idx] > 60) hits++;
  }
  return hits / pixels.length;
}

/** Supprime les composantes sans chevauchement avec la personne (UI, hologrammes…). */
export function keepPersonAlignedComponents(
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const components = findComponents(alpha, width, height, 70);

  if (components.length <= 1) return out;

  for (const comp of components) {
    comp.personOverlap = computePersonOverlap(comp.pixels, personMask);
  }

  components.sort((a, b) => b.personOverlap - a.personOverlap);
  const best = components[0];

  for (const comp of components) {
    const keep =
      comp.personOverlap >= 0.18 &&
      (comp === best || comp.personOverlap >= best.personOverlap * 0.72);

    if (!keep) {
      for (const idx of comp.pixels) out[idx] = 0;
    }
  }

  return out;
}

function isFlatGraphicPixel(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;

  const isYellow = r > 165 && g > 120 && b < 130 && saturation > 0.22;
  const isBluePanel = b > 105 && b > r * 1.15 && b > g * 0.85 && saturation > 0.25;
  const isNearWhite = min > 195 && saturation < 0.1;
  const isBrightAccent = r > 175 && g < 95 && b < 95 && saturation > 0.35;

  return isYellow || isBluePanel || isNearWhite || isBrightAccent;
}

/** Retire texte, badges et panneaux graphiques hors silhouette personne. */
function removeGraphicDesignArtifacts(
  rgba: Uint8ClampedArray,
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const pad = Math.max(22, Math.round(Math.min(width, height) * 0.065));
  const allowed = dilateAlpha(personMask, width, height, pad);

  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 28) {
      out[i] = 0;
      continue;
    }

    if (allowed[i] > 42) {
      out[i] = a;
      continue;
    }

    const idx = i * 4;
    const r = rgba[idx];
    const g = rgba[idx + 1];
    const b = rgba[idx + 2];

    if (isFlatGraphicPixel(r, g, b)) {
      out[i] = 0;
      continue;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const isHoloBlue = b > 90 && b > r * 1.1 && b > g;
    const isGrayGhost = saturation < 0.14 && max > 65 && max < 230 && a < 210;

    out[i] = isHoloBlue || isGrayGhost ? 0 : 0;
  }

  return out;
}

/**
 * Garde le sujet principal (RMBG) dans l'enveloppe personne élargie.
 * Supprime bannières / texte connectés sans rogner tête ni pieds.
 */
export function applyPersonEnvelope(
  alpha: Uint8Array,
  personMask: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha.length);
  const pad = Math.max(26, Math.round(Math.min(width, height) * 0.075));
  const allowed = dilateAlpha(personMask, width, height, pad);
  const bbox = getPersonBBox(personMask, width, height, 50);

  if (!bbox) {
    for (let i = 0; i < alpha.length; i++) {
      out[i] = allowed[i] > 40 ? alpha[i] : 0;
    }
    return out;
  }

  const hPad = Math.max(12, Math.round(width * 0.035));
  const headRoom = Math.round(height * 0.1);
  const footRoom = Math.round(height * 0.06);
  const x0 = Math.max(0, bbox.minX - hPad);
  const x1 = Math.min(width, bbox.maxX + hPad + 1);
  const y0 = Math.max(0, bbox.minY - headRoom);
  const y1 = Math.min(height, bbox.maxY + footRoom);

  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 25) {
      out[i] = 0;
      continue;
    }

    if (allowed[i] > 40) {
      out[i] = a;
      continue;
    }

    const x = i % width;
    const y = Math.floor(i / width);
    const inPersonColumn =
      x >= x0 && x < x1 && y >= y0 && y < y1 && a >= 60;

    out[i] = inPersonColumn ? a : 0;
  }

  return out;
}

/** Sans masque personne : garde seulement les composantes centrales dominantes. */
export function keepCentralSubjects(
  alpha: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const components = findComponents(alpha, width, height);
  if (components.length <= 1) return out;

  components.sort((a, b) => b.area - a.area);
  const main = components[0];
  const cx = (main.minX + main.maxX) / 2;
  const cy = (main.minY + main.maxY) / 2;

  for (const comp of components) {
    const ccx = (comp.minX + comp.maxX) / 2;
    const ccy = (comp.minY + comp.maxY) / 2;
    const dist = Math.hypot(ccx - cx, ccy - cy) / Math.min(width, height);
    const isTiny = comp.area < main.area * 0.08;
    const isFar = dist > 0.28;
    const isSideGhost = isFar && comp.area < main.area * 0.55;
    const isLeftUiGhost =
      ccx < cx - width * 0.12 && comp.area < main.area * 0.65;

    if (isTiny || isSideGhost || isLeftUiGhost) {
      for (const idx of comp.pixels) out[idx] = 0;
    }
  }

  return out;
}

/** Retire les pixels type overlay holographique bleu/cyan/gris semi-transparent. */
export function removeHolographicOverlays(
  rgba: Uint8ClampedArray,
  alpha: Uint8Array,
  personMask?: Uint8Array | null,
  width?: number,
  height?: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  let protectedRegion: Uint8Array | null = null;

  if (personMask && width && height) {
    const margin = Math.max(14, Math.round(Math.min(width, height) * 0.03));
    protectedRegion = dilateAlpha(personMask, width, height, margin);
  }

  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 40) {
      out[i] = 0;
      continue;
    }

    if (protectedRegion && protectedRegion[i] > 45) {
      out[i] = a;
      continue;
    }

    const idx = i * 4;
    const r = rgba[idx];
    const g = rgba[idx + 1];
    const b = rgba[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    const isHoloBlue = b > 100 && b > r * 1.15 && b > g;
    const isGlowingUi = b > 85 && g > 70 && r < 130 && saturation > 0.2;
    const isGrayGhost =
      saturation < 0.12 && max > 70 && max < 215 && a < 175;
    const isCyanUi = g > 100 && b > 100 && r < 100 && a < 235;

    if (isHoloBlue || isGlowingUi || isGrayGhost || isCyanUi) {
      out[i] = 0;
    } else {
      out[i] = a;
    }
  }

  return out;
}

/** Retire les pixels hors zone personne uniquement s'ils ressemblent à des artefacts. */
function removeArtifactsOutsidePerson(
  alpha: Uint8Array,
  personMask: Uint8Array,
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const out = new Uint8Array(alpha);
  const margin = Math.max(18, Math.round(Math.min(width, height) * 0.035));
  const allowed = dilateAlpha(personMask, width, height, margin);

  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a < 30) {
      out[i] = 0;
      continue;
    }

    if (allowed[i] > 40) {
      out[i] = a;
      continue;
    }

    const idx = i * 4;
    const r = rgba[idx];
    const g = rgba[idx + 1];
    const b = rgba[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    const isHoloBlue = b > 95 && b > r * 1.12 && b > g;
    const isGlowingUi = b > 80 && g > 65 && r < 135 && saturation > 0.18;
    const isGrayGhost = saturation < 0.14 && max < 225 && a < 240;
    const isCyanUi = g > 95 && b > 95 && r < 105;

    out[i] = isHoloBlue || isGlowingUi || isGrayGhost || isCyanUi ? 0 : 0;
  }

  return out;
}

export function isolateSubjectAlpha(
  alpha: Uint8Array,
  width: number,
  height: number,
  personMask: Uint8Array | null,
  originalRgba?: Uint8ClampedArray
): Uint8Array {
  let result = new Uint8Array(alpha);

  if (originalRgba) {
    result = new Uint8Array(
      removeHolographicOverlays(originalRgba, result, personMask, width, height)
    );
  }

  result = new Uint8Array(openAlpha(result, width, height, 2));

  if (personMask) {
    if (originalRgba) {
      result = new Uint8Array(
        removeGraphicDesignArtifacts(originalRgba, result, personMask, width, height)
      );
      result = new Uint8Array(
        removeArtifactsOutsidePerson(result, personMask, originalRgba, width, height)
      );
    }
    result = new Uint8Array(keepPersonAlignedComponents(result, personMask, width, height));
    result = new Uint8Array(openAlpha(result, width, height, 2));
    result = new Uint8Array(applyPersonEnvelope(result, personMask, width, height));
  } else {
    result = new Uint8Array(keepCentralSubjects(result, width, height));
  }

  if (originalRgba) {
    result = new Uint8Array(
      removeHolographicOverlays(originalRgba, result, personMask, width, height)
    );
  }

  return result;
}
