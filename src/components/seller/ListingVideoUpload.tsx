"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

type ListingVideoUploadProps = {
  videoUrl: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
};

export default function ListingVideoUpload({
  videoUrl,
  onChange,
  onError,
}: ListingVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError?.("Sirf MP4, MOV ya WEBM video upload karein.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      onError?.("Video 100 MB se chhoti honi chahiye.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.uploadMedia(file, "old-car-bazar/listing-videos");
      onChange(res.secure_url || res.url);
      onError?.("");
    } catch (e) {
      onError?.(
        e instanceof Error ? e.message : "Video upload fail ho gaya."
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">
            Owner Video Proof{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            30–60 sec: odometer, engine sound, exterior walk-around — trust
            badhta hai.
          </p>
        </div>
        {!videoUrl && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Upload video"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => void pick(e.target.files)}
      />

      {videoUrl && (
        <div className="mt-3 space-y-2">
          <video
            src={videoUrl}
            controls
            className="max-h-48 w-full rounded-lg bg-black"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Remove video
          </button>
        </div>
      )}
    </div>
  );
}
