import { createWriteStream, existsSync, mkdirSync, cpSync, rmSync } from "fs";
import { pipeline } from "stream/promises";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const VERSION = "1.7.0";
const PACKAGE_URL = `https://staticimgly.com/@imgly/background-removal-data/${VERSION}/package.tgz`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "bg-removal-data");
const MARKER = path.join(OUT_DIR, "resources.json");
const TMP_DIR = path.join(ROOT, ".tmp-imgly");
const ARCHIVE = path.join(TMP_DIR, "package.tgz");

if (existsSync(MARKER)) {
  console.log("[imgly] Assets déjà présents, skip.");
  process.exit(0);
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Téléchargement échoué (${response.status}): ${url}`);
  }
  await pipeline(response.body, createWriteStream(destination));
}

console.log(`[imgly] Téléchargement des modèles v${VERSION}...`);
mkdirSync(TMP_DIR, { recursive: true });
await download(PACKAGE_URL, ARCHIVE);

console.log("[imgly] Extraction...");
execSync(`tar -xzf "${ARCHIVE}" -C "${TMP_DIR}"`, { stdio: "inherit" });

const extractedDist = path.join(TMP_DIR, "package", "dist");
if (!existsSync(path.join(extractedDist, "resources.json"))) {
  throw new Error("Archive imgly invalide (resources.json introuvable).");
}

mkdirSync(OUT_DIR, { recursive: true });
cpSync(extractedDist, OUT_DIR, { recursive: true });
rmSync(TMP_DIR, { recursive: true, force: true });

console.log("[imgly] Assets installés dans public/bg-removal-data/");
