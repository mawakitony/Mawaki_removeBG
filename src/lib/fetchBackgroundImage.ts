export async function fetchImageAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Impossible de charger l'image de fond");
  }

  return response.blob();
}
