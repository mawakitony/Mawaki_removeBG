export type BackgroundTab = "magique" | "photo" | "couleur";

export type PresetCategory =
  | "magique"
  | "technologie"
  | "flou"
  | "naturel"
  | "architecture"
  | "urbain"
  | "interieur"
  | "ciel";

export type PresetBackground = {
  id: string;
  name: string;
  category: PresetCategory;
  tab: "magique" | "photo";
  thumbUrl: string;
  fullUrl: string;
};

const pexels = (id: number, w = 400) =>
  `/api/background-image?id=${id}&w=${w}`;

function bg(
  id: string,
  name: string,
  category: PresetCategory,
  pexelsId: number,
  tab: "magique" | "photo" = "photo"
): PresetBackground {
  return {
    id,
    name,
    category,
    tab,
    thumbUrl: pexels(pexelsId, 300),
    fullUrl: pexels(pexelsId, 1920),
  };
}

export const PRESET_BACKGROUNDS: PresetBackground[] = [
  // ── Magique ──
  bg("mag-1", "Aurore boréale", "magique", 7134985, "magique"),
  bg("mag-2", "Néon cosmique", "magique", 7130560, "magique"),
  bg("mag-3", "Vortex violet", "magique", 7135046, "magique"),
  bg("mag-4", "Gradient arc-en-ciel", "magique", 7130472, "magique"),
  bg("mag-5", "Fluid art", "magique", 698808, "magique"),
  bg("mag-6", "Explosion colorée", "magique", 2343468, "magique"),
  bg("mag-7", "Galaxie", "magique", 2343466, "magique"),
  bg("mag-8", "Abstrait rose", "magique", 1323550, "magique"),
  bg("mag-9", "Peinture fluide", "magique", 1323712, "magique"),
  bg("mag-10", "Art digital", "magique", 1323552, "magique"),
  bg("mag-11", "Holographique", "magique", 3493777, "magique"),
  bg("mag-12", "Prisme", "magique", 3493778, "magique"),

  // ── Technologie ──
  bg("tech-1", "Réseau digital", "technologie", 373543),
  bg("tech-2", "Circuit futuriste", "technologie", 577585),
  bg("tech-3", "Ville connectée", "technologie", 3861969),
  bg("tech-4", "Bureau moderne", "technologie", 1181244),
  bg("tech-5", "Passerelle futuriste", "technologie", 3184292),
  bg("tech-6", "Code informatique", "technologie", 259924),
  bg("tech-7", "Data center", "technologie", 735911),
  bg("tech-8", "Robotique", "technologie", 442150),
  bg("tech-9", "Innovation tech", "technologie", 256381),
  bg("tech-10", "Serveurs", "technologie", 259725),
  bg("tech-11", "Intelligence artificielle", "technologie", 3862132),
  bg("tech-12", "Cybersécurité", "technologie", 1181263),
  bg("tech-13", "Écran digital", "technologie", 1181354),
  bg("tech-14", "Smart city", "technologie", 1181396),

  // ── Flou / abstrait ──
  bg("blur-1", "Bokeh coloré", "flou", 2559941),
  bg("blur-2", "Lumières douces", "flou", 1103970),
  bg("blur-3", "Pastel flou", "flou", 325185),
  bg("blur-4", "Sunset flou", "flou", 325000),
  bg("blur-5", "Rose flou", "flou", 325001),
  bg("blur-6", "Bleu flou", "flou", 325002),
  bg("blur-7", "Violet flou", "flou", 325003),
  bg("blur-8", "Orange flou", "flou", 325005),
  bg("blur-9", "Vert flou", "flou", 325007),
  bg("blur-10", "Jaune flou", "flou", 325021),
  bg("blur-11", "Turquoise flou", "flou", 325022),
  bg("blur-12", "Magenta flou", "flou", 325023),
  bg("blur-13", "Indigo flou", "flou", 325024),
  bg("blur-14", "Corail flou", "flou", 325025),
  bg("blur-15", "Lavande flou", "flou", 325028),
  bg("blur-16", "Ambre flou", "flou", 325029),
  bg("blur-17", "Cyan flou", "flou", 325038),

  // ── Naturel ──
  bg("nat-1", "Montagnes", "naturel", 417074),
  bg("nat-2", "Forêt", "naturel", 1578750),
  bg("nat-3", "Désert", "naturel", 1687845),
  bg("nat-4", "Plage tropicale", "naturel", 457878),
  bg("nat-5", "Brume naturelle", "naturel", 2397652),
  bg("nat-6", "Tropical luxuriant", "naturel", 1450360),
  bg("nat-7", "Lac de montagne", "naturel", 2662116),
  bg("nat-8", "Champ de fleurs", "naturel", 1133389),
  bg("nat-9", "Cascade", "naturel", 1092246),
  bg("nat-10", "Prairie", "naturel", 1624496),
  bg("nat-11", "Rivière", "naturel", 1770313),
  bg("nat-12", "Jungle", "naturel", 1287145),
  bg("nat-13", "Océan", "naturel", 248797),
  bg("nat-14", "Vagues", "naturel", 1032650),
  bg("nat-15", "Côte rocheuse", "naturel", 457866),
  bg("nat-16", "Aurore nature", "naturel", 1095973),
  bg("nat-17", "Sentier forestier", "naturel", 211816),

  // ── Architecture ──
  bg("arch-1", "Gratte-ciel", "architecture", 1109541),
  bg("arch-2", "Pont moderne", "architecture", 323780),
  bg("arch-3", "Dôme classique", "architecture", 137070),
  bg("arch-4", "Façade vitrée", "architecture", 280193),
  bg("arch-5", "Bâtiment minimaliste", "architecture", 1643383),
  bg("arch-6", "Structure géométrique", "architecture", 258729),
  bg("arch-7", "Escalier design", "architecture", 1181391),
  bg("arch-8", "Hall moderne", "architecture", 1181304),
  bg("arch-9", "Colonnade", "architecture", 1181206),
  bg("arch-10", "Architecture futuriste", "architecture", 1181260),

  // ── Urbain ──
  bg("urb-1", "Rue de nuit", "urbain", 313705),
  bg("urb-2", "Métropole", "urbain", 169647),
  bg("urb-3", "Ville animée", "urbain", 210182),
  bg("urb-4", "Skyline nocturne", "urbain", 1526711),
  bg("urb-5", "Traffic urbain", "urbain", 1563356),
  bg("urb-6", "Quartier moderne", "urbain", 3496107),
  bg("urb-7", "Boulevard", "urbain", 3496108),
  bg("urb-8", "Centre-ville", "urbain", 3496109),
  bg("urb-9", "Panorama urbain", "urbain", 3496110),

  // ── Intérieur ──
  bg("int-1", "Salon design", "interieur", 1571460),
  bg("int-2", "Espace minimaliste", "interieur", 1457842),
  bg("int-3", "Bureau épuré", "interieur", 276724),
  bg("int-4", "Chambre cosy", "interieur", 1350789),
  bg("int-5", "Cuisine moderne", "interieur", 1866144),
  bg("int-6", "Loft industriel", "interieur", 3493780),
  bg("int-7", "Studio créatif", "interieur", 1222271),
  bg("int-8", "Bibliothèque", "interieur", 1222272),
  bg("int-9", "Salle à manger", "interieur", 1222273),
  bg("int-10", "Espace de travail", "interieur", 1222274),

  // ── Ciel & atmosphère ──
  bg("sky-1", "Coucher de soleil", "ciel", 325000),
  bg("sky-2", "Lever de soleil", "ciel", 325001),
  bg("sky-3", "Nuages dorés", "ciel", 325002),
  bg("sky-4", "Ciel rose", "ciel", 325003),
  bg("sky-5", "Crépuscule", "ciel", 325005),
  bg("sky-6", "Aube", "ciel", 325007),
  bg("sky-7", "Ciel dégagé", "ciel", 325021),
  bg("sky-8", "Orage", "ciel", 325022),
  bg("sky-9", "Arc-en-ciel", "ciel", 325023),
  bg("sky-10", "Nuit étoilée", "ciel", 325024),
];

/** Whitelist auto-générée depuis les presets. */
export const PEXELS_IMAGE_IDS = new Set(
  PRESET_BACKGROUNDS.map((p) => {
    const match = p.thumbUrl.match(/id=(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter((id) => id > 0)
);

export const PHOTO_FILTERS: { id: PresetCategory | "tous"; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "technologie", label: "Technologie" },
  { id: "flou", label: "Flou" },
  { id: "naturel", label: "Naturel" },
  { id: "architecture", label: "Architecture" },
  { id: "urbain", label: "Urbain" },
  { id: "interieur", label: "Intérieur" },
  { id: "ciel", label: "Ciel" },
];

export function getPresetsForTab(tab: BackgroundTab): PresetBackground[] {
  if (tab === "magique") {
    return PRESET_BACKGROUNDS.filter((p) => p.tab === "magique");
  }
  if (tab === "photo") {
    return PRESET_BACKGROUNDS.filter((p) => p.tab === "photo");
  }
  return [];
}
