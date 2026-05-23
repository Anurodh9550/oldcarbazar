/** Fallback when a listing has no photo or the remote URL fails to load. */
export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop";

export function isRemoteImageUrl(src: string | undefined): boolean {
  return Boolean(src && (src.startsWith("https://") || src.startsWith("http://")));
}

export function resolveListingImageUrl(src: string | undefined): string {
  if (!src?.trim() || !isRemoteImageUrl(src)) return DEFAULT_LISTING_IMAGE;
  return src.trim();
}
