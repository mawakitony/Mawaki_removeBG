"use client";

import { useEffect } from "react";

function isBlockedShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  const { ctrlKey, metaKey, shiftKey } = event;
  const mod = ctrlKey || metaKey;

  if (key === "f12") return true;
  if (mod && shiftKey && (key === "i" || key === "j" || key === "c")) return true;
  if (mod && key === "u") return true;
  if (mod && key === "s") return true;

  return false;
}

export function SourceProtection() {
  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const blockShortcuts = (event: KeyboardEvent) => {
      if (isBlockedShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const blockDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockShortcuts, true);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockShortcuts, true);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return null;
}
