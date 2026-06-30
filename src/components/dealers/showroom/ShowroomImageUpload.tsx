"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { compressImageFile } from "@/lib/listingPhotos";
import { fieldClass } from "@/components/ui/Input";

type ShowroomImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  variant: "banner" | "logo";
  hint?: string;
};

export default function ShowroomImageUpload({
  label,
  value,
  onChange,
  variant,
  hint,
}: ShowroomImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const previewClass =
    variant === "banner"
      ? "aspect-[21/9] w-full max-h-48"
      : "h-24 w-24 rounded-xl";

  const openPicker = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const maxWidth = variant === "banner" ? 1920 : 512;
      const dataUrl = await compressImageFile(file, maxWidth, 0.85);
      onChange(dataUrl);

      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const uploadFile = new File(
          [blob],
          `${variant}-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        const uploaded = await api.uploadMedia(
          uploadFile,
          "old-car-bazar/showroom"
        );
        onChange(uploaded.secure_url || uploaded.url);
      } catch {
        // Cloudinary/API unavailable — compressed preview stays for local save
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload image.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const urlValue = value.startsWith("data:") ? "" : value;

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div
          className={`relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 ${previewClass}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              disabled={busy}
              onClick={openPicker}
              className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow hover:bg-white disabled:opacity-60"
            >
              {busy ? "Uploading…" : "Change"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={openPicker}
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#f75d34] hover:bg-orange-50/50 disabled:opacity-60 ${
            variant === "banner" ? "px-4 py-10" : "h-28 max-w-xs px-4 py-6"
          }`}
        >
          <span className="text-2xl">{variant === "banner" ? "🖼️" : "🏷️"}</span>
          <span className="mt-2 text-sm font-semibold text-gray-800">
            {busy ? "Processing…" : "Upload from computer"}
          </span>
          <span className="mt-1 text-center text-xs text-gray-500">
            JPG, PNG · max 2 MB
          </span>
        </button>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or paste URL
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <input
        className={fieldClass}
        value={urlValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        disabled={busy}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
