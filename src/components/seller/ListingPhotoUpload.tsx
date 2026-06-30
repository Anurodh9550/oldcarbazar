"use client";

import { useRef, useState } from "react";
import {
  MAX_LISTING_PHOTOS,
  MIN_LISTING_PHOTOS,
} from "@/data/sellCarForm";
import {
  compressImageFile,
  validatePhotoCount,
} from "@/lib/listingPhotos";

type ListingPhotoUploadProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
  onError?: (message: string) => void;
  /** Garage / optional flows — no minimum photo count */
  optional?: boolean;
  maxPhotos?: number;
  label?: string;
  hint?: string;
};

export default function ListingPhotoUpload({
  photos,
  onChange,
  onError,
  optional = false,
  maxPhotos = MAX_LISTING_PHOTOS,
  label,
  hint,
}: ListingPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const remaining = maxPhotos - photos.length;
  const countMsg = optional
    ? photos.length > maxPhotos
      ? `Maximum ${maxPhotos} photos allowed.`
      : ""
    : validatePhotoCount(photos.length);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const slots = maxPhotos - photos.length;
    if (slots <= 0) {
      onError?.(`Maximum ${maxPhotos} photos allowed.`);
      return;
    }

    const toAdd = Array.from(files).slice(0, slots);
    setBusy(true);

    try {
      const next = [...photos];
      for (const file of toAdd) {
        const dataUrl = await compressImageFile(file);
        next.push(dataUrl);
      }
      onChange(next);
      onError?.("");
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "Could not add photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-600">
          {label ??
            (optional
              ? `Car photos (up to ${maxPhotos})`
              : `Car photos * (${MIN_LISTING_PHOTOS}–${MAX_LISTING_PHOTOS})`)}
        </span>
        <span
          className={`text-xs font-semibold ${
            optional
              ? "text-gray-600"
              : photos.length >= MIN_LISTING_PHOTOS
                ? "text-green-600"
                : "text-amber-600"
          }`}
        >
          {photos.length} / {maxPhotos}
        </span>
      </div>

      <p className="text-caption text-gray-500">
        {hint ??
          (optional
            ? "Add exterior, interior and odometer shots. First photo is the cover."
            : "Front, back, interior & odometer recommended. First photo is cover image.")}
      </p>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((src, i) => (
            <div
              key={`${i}-${src.slice(0, 32)}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <img src={src} alt={`Car photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-[#f75d34] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex gap-0.5 bg-black/60 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setCover(i)}
                    className="flex-1 rounded bg-white/90 py-0.5 text-[10px] font-semibold text-gray-800"
                  >
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex-1 rounded bg-red-500 py-0.5 text-[10px] font-semibold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition hover:border-[#f75d34] hover:bg-[#f75d34]/5 ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="text-2xl">📷</span>
          <span className="mt-2 text-sm font-semibold text-gray-800">
            {busy ? "Processing photos…" : "Add photos"}
          </span>
          <span className="mt-1 text-center text-xs text-gray-500">
            {remaining} more allowed • JPG/PNG • max 2MB each
          </span>
        </label>
      )}

      {countMsg && photos.length > 0 && (
        <p className="text-xs text-amber-700">{countMsg}</p>
      )}
    </div>
  );
}
