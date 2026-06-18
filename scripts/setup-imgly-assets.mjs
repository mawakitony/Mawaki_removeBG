import {
  createWriteStream,
  existsSync,
  mkdirSync,
  cpSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { pipeline } from "stream/promises";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const VERSION = "1.7.0";
const PACKAGE_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`;
const MODEL = "isnet_quint8";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "bg-removal-data");
const MARKER = path.join(OUT_DIR, "resources.json");
const TMP_DIR = path.join(ROOT, ".tmp-imgly");
const ARCHIVE = path.join(TMP_DIR, "package.tgz");

const KEEP_RESOURCE_KEYS = new Set([
  "/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/onnxruntime-web/ort-wasm-simd-threaded.mjs",
  `/models/${MODEL}`,
]);

function collectChunkHashes(resources, keys) {
  const hashes = new Set();
  for (const key of keys) {
    const entry = resources[key];
    if (!entry?.chunks) continue;
    for (const chunk of entry.chunks) {
      hashes.add(chunk.name);
    }
  }
  return hashes;
}

function pruneAssets(distDir) {
  const resourcesPath = path.join(distDir, "resources.json");
  const resources = JSON.parse(readFileSync(resourcesPath, "utf8"));
  const pruned = Object.fromEntries(
    Object.entries(resources).filter(([key]) => KEEP_RESOURCE_KEYS.has(key))
  );
  const keepHashes = collectChunkHashes(resources, KEEP_RESOURCE_KEYS);

  for (const file of readdirSync(distDir)) {
    if (file === "resources.json") continue;
    if (!keepHashes.has(file)) {
      rmSync(path.join(distDir, file), { force: true });
    }
  }

  writeFileSync(resourcesPath, JSON.stringify(pruned, null, 2));
}

if (existsSync(MARKER)) {
  const existing = JSON.parse(readFileSync(MARKER, "utf8"));
  const keys = Object.keys(existing);
  if (keys.length <= KEEP_RESOURCE_KEYS.size && keys.every((k) => KEEP_RESOURCE_KEYS.has(k))) {
    console.log("[imgly] Assets déjà présents, skip.");
    process.exit(0);
  }
  rmSync(OUT_DIR, { recursive: true, force: true });
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Téléchargement échoué (${response.status}): ${url}`);
  }
  await pipeline(response.body, createWriteStream(destination));
}

console.log(`[imgly] Téléchargement des modèles v${VERSION} (${MODEL})...`);
mkdirSync(TMP_DIR, { recursive: true });
await download(PACKAGE_URL, ARCHIVE);

console.log("[imgly] Extraction...");
execSync(`tar -xzf "${ARCHIVE}" -C "${TMP_DIR}"`, { stdio: "inherit" });

const extractedDist = path.join(TMP_DIR, "package", "dist");
if (!existsSync(path.join(extractedDist, "resources.json"))) {
  throw new Error("Archive imgly invalide (resources.json introuvable).");
}

console.log("[imgly] Réduction au modèle léger...");
pruneAssets(extractedDist);

mkdirSync(OUT_DIR, { recursive: true });
cpSync(extractedDist, OUT_DIR, { recursive: true });
rmSync(TMP_DIR, { recursive: true, force: true });

console.log("[imgly] Assets installés dans public/bg-removal-data/");
