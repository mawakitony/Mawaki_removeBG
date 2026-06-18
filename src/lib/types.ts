export type BackgroundMode = "transparent" | "color" | "image";

export type CropAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EditorState = {
  originalFile: File | null;
  originalUrl: string | null;
  processedBlob: Blob | null;
  processedUrl: string | null;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  backgroundImage: File | null;
  backgroundImageUrl: string | null;
  isProcessing: boolean;
  progress: number;
  error: string | null;
};
