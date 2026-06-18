import { NextRequest, NextResponse } from "next/server";
import { PEXELS_IMAGE_IDS } from "@/lib/presetBackgrounds";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const w = request.nextUrl.searchParams.get("w") ?? "800";

  const numericId = Number(id);
  if (!id || Number.isNaN(numericId) || !PEXELS_IMAGE_IDS.has(numericId)) {
    return NextResponse.json({ error: "Image non autorisée" }, { status: 400 });
  }

  const width = Math.min(Math.max(Number(w) || 800, 100), 2560);
  const pexelsUrl = `https://images.pexels.com/photos/${numericId}/pexels-photo-${numericId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&dpr=2`;

  try {
    const upstream = await fetch(pexelsUrl, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "private, no-store, max-age=0",
        "Cross-Origin-Resource-Policy": "same-origin",
      },
    });
  } catch {
    return NextResponse.json({ error: "Échec du chargement" }, { status: 502 });
  }
}
