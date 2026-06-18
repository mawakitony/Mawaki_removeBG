export type Locale = "fr" | "en";

export const translations = {
  fr: {
    meta: {
      title: "Mawaki_removeBG — Suppression d'arrière-plan IA",
      description:
        "Supprimez l'arrière-plan de vos images gratuitement. 100% privé, traitement local, export PNG transparent.",
    },
    header: {
      neuralEngine: "Neural Engine v2.0",
      secure: "Sécurisé · Zéro stockage",
    },
    hero: {
      badge: "IA locale · Traitement instantané",
      titleLine1: "Supprimez",
      titleLine2: "l'arrière-plan",
      description:
        "Téléversez une image et laissez le moteur neural retirer le fond en temps réel. Remplacez-le par une couleur ou une image, puis exportez le résultat.",
      formats: "PNG · WebP · JPG · 25 Mo max",
    },
    features: {
      privateTitle: "100% privé",
      privateDesc:
        "Vos images restent dans votre navigateur. Aucun stockage serveur.",
      fastTitle: "Traitement rapide",
      fastDesc:
        "Moteur neural local pour un détourage précis en quelques secondes.",
      sessionTitle: "Session temporaire",
      sessionDesc:
        "Toutes les données sont effacées à la fermeture de l'onglet.",
    },
    upload: {
      preview: "Aperçu",
      dragTitle: "Glissez votre image",
      dragHint: "ou cliquez pour parcourir vos fichiers",
      formats: "JPG · PNG · WebP · Max 25 Mo",
      dropRelease: "Relâchez pour téléverser",
    },
    editor: {
      studio: "Studio d'édition",
      done: "Traitement terminé",
      pngTransparent: "PNG transparent",
      pngTransparentDesc: "Fond supprimé uniquement",
      downloadResult: "Télécharger le résultat",
      downloadResultDesc: "Avec l'arrière-plan appliqué",
      newImage: "Nouvelle image",
    },
    preview: {
      original: "Original",
      result: "Résultat",
      export: "Aperçu export",
      input: "INPUT",
      output: "OUTPUT",
      exportTag: "CROP",
      originalAlt: "Image originale",
      resultAlt: "Résultat",
    },
    crop: {
      title: "Recadrage",
      hint: "Ajustez la zone exportée avant le téléchargement. Le recadrage s'applique aux deux formats PNG.",
      enabled: "Activé",
      disabled: "Désactivé",
      ratioFree: "Libre",
      ratioSquare: "1:1",
      ratioLandscape: "4:3",
      ratioWide: "16:9",
      ratioPortrait: "9:16",
      reset: "Réinitialiser",
    },
    background: {
      title: "Arrière-plan",
      transparent: "Transparent",
      tabMagique: "Magique",
      tabPhoto: "Photo",
      tabCouleur: "Couleur",
      colorHint: "Choisissez une couleur unie pour l'arrière-plan",
      colorAria: "Couleur",
      searchPlaceholder: "Rechercher un arrière-plan...",
      presetsCount:
        "arrière-plans disponibles · technologie, flou, naturel, architecture…",
      magiqueHint: "Arrière-plans abstraits et effets visuels",
      import: "Importer",
      filterTous: "Tous",
      filterTechnologie: "Technologie",
      filterFlou: "Flou",
      filterNaturel: "Naturel",
      filterArchitecture: "Architecture",
      filterUrbain: "Urbain",
      filterInterieur: "Intérieur",
      filterCiel: "Ciel",
    },
    processing: {
      label: "Neural Processing",
      title: "Analyse en cours",
      subtitle: "Détection des sujets · Suppression de l'environnement...",
      status: "Processing",
      stepSegment: "SEGMENT",
      stepMask: "MASK",
      stepExport: "EXPORT",
    },
    errors: {
      unsupportedFormat: "Format non supporté. Utilisez JPG, PNG ou WebP.",
      fileTooLarge: "L'image dépasse la limite de 25 Mo.",
      removalFailed:
        "Échec du détourage. Veuillez réessayer avec une autre image.",
      bgFormatUnsupported: "Format de fond non supporté.",
      bgLoadFailed:
        "Impossible de charger cet arrière-plan. Réessayez ou importez une image.",
    },
    splash: {
      neuralEngine: "Neural Engine v2.0",
      initializing: "Initialisation du moteur neural...",
    },
    guide: {
      eyebrow: "Procédure",
      title: "Comment utiliser Mawaki_removeBG",
      subtitle:
        "Quatre étapes simples pour détourer, personnaliser et exporter vos visuels en toute confidentialité.",
      timeline: "Workflow neural",
      step1Title: "Téléversez",
      step1Desc:
        "Glissez-déposez ou sélectionnez une photo JPG, PNG ou WebP (max 25 Mo).",
      step2Title: "Analyse IA",
      step2Desc:
        "Le moteur neural détecte le sujet et supprime l'arrière-plan localement dans votre navigateur.",
      step3Title: "Personnalisez",
      step3Desc:
        "Choisissez un fond transparent, une couleur ou une image parmi 99 arrière-plans.",
      step4Title: "Exportez",
      step4Desc:
        "Téléchargez le PNG transparent ou le rendu final avec le nouveau fond.",
      visualUpload: "INPUT",
      visualProcess: "NEURAL",
      visualEdit: "STUDIO",
      visualExport: "OUTPUT",
      animDrop: "Déposez l'image",
      animFormats: "JPG · PNG · WebP",
      animDetect: "Détection du sujet",
      animMask: "Création du masque",
      animRemove: "Suppression du fond",
      animWithBg: "Avec fond",
      animNoBg: "Sans fond",
      animScan: "SCAN IA",
      animReplace: "Remplacement",
      animTransparent: "Transparent",
      animDownload: "Téléchargement",
      animPngReady: "PNG prêt",
    },
  },
  en: {
    meta: {
      title: "Mawaki_removeBG — AI Background Removal",
      description:
        "Remove image backgrounds for free. 100% private, local processing, transparent PNG export.",
    },
    header: {
      neuralEngine: "Neural Engine v2.0",
      secure: "Secure · Zero Storage",
    },
    hero: {
      badge: "Local AI · Instant processing",
      titleLine1: "Remove",
      titleLine2: "the background",
      description:
        "Upload an image and let the neural engine remove the background in real time. Replace it with a color or image, then export your result.",
      formats: "PNG · WebP · JPG · 25 MB max",
    },
    features: {
      privateTitle: "100% private",
      privateDesc:
        "Your images stay in your browser. No server storage.",
      fastTitle: "Fast processing",
      fastDesc:
        "Local neural engine for precise cutouts in seconds.",
      sessionTitle: "Temporary session",
      sessionDesc:
        "All data is cleared when you close the tab.",
    },
    upload: {
      preview: "Preview",
      dragTitle: "Drop your image",
      dragHint: "or click to browse files",
      formats: "JPG · PNG · WebP · Max 25 MB",
      dropRelease: "Release to upload",
    },
    editor: {
      studio: "Editing studio",
      done: "Processing complete",
      pngTransparent: "Transparent PNG",
      pngTransparentDesc: "Background removed only",
      downloadResult: "Download result",
      downloadResultDesc: "With background applied",
      newImage: "New image",
    },
    preview: {
      original: "Original",
      result: "Result",
      export: "Export preview",
      input: "INPUT",
      output: "OUTPUT",
      exportTag: "CROP",
      originalAlt: "Original image",
      resultAlt: "Result",
    },
    crop: {
      title: "Crop",
      hint: "Adjust the export area before downloading. Cropping applies to both PNG exports.",
      enabled: "Enabled",
      disabled: "Disabled",
      ratioFree: "Free",
      ratioSquare: "1:1",
      ratioLandscape: "4:3",
      ratioWide: "16:9",
      ratioPortrait: "9:16",
      reset: "Reset",
    },
    background: {
      title: "Background",
      transparent: "Transparent",
      tabMagique: "Magic",
      tabPhoto: "Photo",
      tabCouleur: "Color",
      colorHint: "Choose a solid color for the background",
      colorAria: "Color",
      searchPlaceholder: "Search backgrounds...",
      presetsCount:
        "backgrounds available · technology, blur, nature, architecture…",
      magiqueHint: "Abstract backgrounds and visual effects",
      import: "Import",
      filterTous: "All",
      filterTechnologie: "Technology",
      filterFlou: "Blur",
      filterNaturel: "Nature",
      filterArchitecture: "Architecture",
      filterUrbain: "Urban",
      filterInterieur: "Interior",
      filterCiel: "Sky",
    },
    processing: {
      label: "Neural Processing",
      title: "Analysis in progress",
      subtitle: "Subject detection · Environment removal...",
      status: "Processing",
      stepSegment: "SEGMENT",
      stepMask: "MASK",
      stepExport: "EXPORT",
    },
    errors: {
      unsupportedFormat: "Unsupported format. Use JPG, PNG or WebP.",
      fileTooLarge: "Image exceeds the 25 MB limit.",
      removalFailed:
        "Background removal failed. Please try another image.",
      bgFormatUnsupported: "Unsupported background format.",
      bgLoadFailed:
        "Could not load this background. Try again or upload an image.",
    },
    splash: {
      neuralEngine: "Neural Engine v2.0",
      initializing: "Initializing neural engine...",
    },
    guide: {
      eyebrow: "Procedure",
      title: "How to use Mawaki_removeBG",
      subtitle:
        "Four simple steps to cut out, customize and export your visuals privately.",
      timeline: "Neural workflow",
      step1Title: "Upload",
      step1Desc:
        "Drag and drop or select a JPG, PNG or WebP photo (max 25 MB).",
      step2Title: "AI analysis",
      step2Desc:
        "The neural engine detects the subject and removes the background locally in your browser.",
      step3Title: "Customize",
      step3Desc:
        "Pick a transparent background, a solid color or one of 99 preset backgrounds.",
      step4Title: "Export",
      step4Desc:
        "Download the transparent PNG or the final render with your new background.",
      visualUpload: "INPUT",
      visualProcess: "NEURAL",
      visualEdit: "STUDIO",
      visualExport: "OUTPUT",
      animDrop: "Drop your image",
      animFormats: "JPG · PNG · WebP",
      animDetect: "Subject detection",
      animMask: "Mask generation",
      animRemove: "Background removal",
      animWithBg: "With background",
      animNoBg: "No background",
      animScan: "AI SCAN",
      animReplace: "Replacement",
      animTransparent: "Transparent",
      animDownload: "Downloading",
      animPngReady: "PNG ready",
    },
  },
} as const;

export type TranslationTree = typeof translations.fr;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationTree>;

export function getTranslation(
  locale: Locale,
  key: TranslationKey
): string {
  const parts = key.split(".");
  let value: unknown = translations[locale];
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}
