const objectUrls = new Set<string>();

export function trackObjectUrl(url: string): string {
  objectUrls.add(url);
  return url;
}

export function revokeObjectUrl(url: string | null): void {
  if (!url) return;
  URL.revokeObjectURL(url);
  objectUrls.delete(url);
}

export function revokeAllObjectUrls(): void {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls.clear();
}
