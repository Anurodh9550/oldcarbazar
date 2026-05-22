import {
  MAX_LISTING_PHOTO_BYTES,
  MAX_LISTING_PHOTOS,
  MIN_LISTING_PHOTOS,
} from "@/data/sellCarForm";

export { MIN_LISTING_PHOTOS, MAX_LISTING_PHOTOS };

export function compressImageFile(
  file: File,
  maxWidth = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error(`${file.name} is not an image.`));
      return;
    }
    if (file.size > MAX_LISTING_PHOTO_BYTES) {
      reject(new Error(`${file.name} is too large (max 2MB per photo).`));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image."));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load ${file.name}.`));
    };

    img.src = url;
  });
}

export async function filesToPhotoDataUrls(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files);
  const results: string[] = [];

  for (const file of list) {
    const dataUrl = await compressImageFile(file);
    results.push(dataUrl);
  }

  return results;
}

export function validatePhotoCount(count: number): string {
  if (count < MIN_LISTING_PHOTOS) {
    return `Upload at least ${MIN_LISTING_PHOTOS} photos (front, back & interior recommended).`;
  }
  if (count > MAX_LISTING_PHOTOS) {
    return `Maximum ${MAX_LISTING_PHOTOS} photos allowed.`;
  }
  return "";
}
