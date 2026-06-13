"use client";

import { useEffect, useState } from "react";
import {
  AD_PAGES,
  AD_PLACEMENTS,
  AD_PLATFORMS,
  AD_STYLES,
  getAds,
  makeEmptyAd,
  normalizeAds,
  resetAds,
  saveAds,
  setLocalAds,
  type Ad,
  type AdPageKey,
} from "@/lib/ads";
import { api } from "@/lib/api";
import AdBanner from "@/components/ads/AdBanner";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15";

function AdEditor({
  ad,
  onChange,
  onDelete,
}: {
  ad: Ad;
  onChange: (next: Ad) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof Ad>(key: K, value: Ad[K]) =>
    onChange({ ...ad, [key]: value });

  const togglePage = (key: AdPageKey) => {
    const has = ad.pages.includes(key);
    set("pages", has ? ad.pages.filter((p) => p !== key) : [...ad.pages, key]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-300"
          value={ad.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ad name (internal)"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={ad.enabled}
            onClick={() => set("enabled", !ad.enabled)}
            className={`relative h-6 w-11 rounded-full transition ${
              ad.enabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
            title={ad.enabled ? "Live" : "Paused"}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                ad.enabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Style</span>
            <div className="mt-1 flex gap-2">
              {AD_STYLES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => set("style", s.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    ad.style === s.key
                      ? "border-[#f75d34] text-[#f75d34]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              Run on
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {AD_PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => set("platform", p.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    (ad.platform ?? "both") === p.key
                      ? "border-[#f75d34] bg-[#f75d34] text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Pick “Website + App” to show this ad (photo or video) on both the
              website and the mobile app, or restrict it to one.
            </p>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Title</span>
            <input
              className={`mt-1 ${inputClass}`}
              value={ad.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              Description
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={ad.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              Image URL{" "}
              <span className="text-slate-400">
                (
                {ad.style === "image"
                  ? "required"
                  : ad.style === "video"
                    ? "poster / fallback"
                    : "optional"}
                )
              </span>
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={ad.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://…/banner.jpg"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              Video URL{" "}
              <span className="text-slate-400">
                ({ad.style === "video" ? "required" : "optional"})
              </span>
            </span>
            <input
              className={`mt-1 ${inputClass}`}
              value={ad.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://…/promo.mp4"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Choose the “Video banner” style above and paste a direct .mp4/.webm
              link. It autoplays muted &amp; loops on the website and app.
            </p>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">
                Button text
              </span>
              <input
                className={`mt-1 ${inputClass}`}
                value={ad.ctaLabel}
                onChange={(e) => set("ctaLabel", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">
                Button link
              </span>
              <input
                className={`mt-1 ${inputClass}`}
                value={ad.ctaHref}
                onChange={(e) => set("ctaHref", e.target.value)}
                placeholder="/used-cars"
              />
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-slate-700">
              Show on pages
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {AD_PAGES.map((p) => {
                const active = ad.pages.includes(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => togglePage(p.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[#f75d34] bg-[#f75d34] text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-[#f75d34]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">
              Placement
            </span>
            <select
              className={`mt-1 ${inputClass}`}
              value={ad.placement}
              onChange={(e) =>
                set("placement", e.target.value as Ad["placement"])
              }
            >
              {AD_PLACEMENTS.map((pl) => (
                <option key={pl.key} value={pl.key}>
                  {pl.label}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs font-semibold text-slate-700">Preview</span>
            <div className="mt-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
              <AdBanner ad={ad} preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdsContent() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    // Show the local cache instantly, then refresh from the backend so ads
    // edited on another device (or meant for the app) load correctly.
    setAds(getAds());
    api
      .fetchAllAdsForAdmin()
      .then((remote) => {
        const normalized = normalizeAds(remote as Partial<Ad>[]);
        if (normalized.length > 0) {
          setAds(normalized);
          setLocalAds(normalized);
        }
      })
      .catch(() => {
        // Backend unreachable — keep working from the local cache.
      });
  }, []);

  const updateAd = (id: string, next: Ad) => {
    setAds((prev) => prev.map((a) => (a.id === id ? next : a)));
    setSaved(false);
  };
  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
    setSaved(false);
  };
  const addAd = () => {
    setAds((prev) => [...prev, makeEmptyAd()]);
    setSaved(false);
  };
  const handleSave = async () => {
    setSyncError("");
    setSaving(true);
    // Save locally first so the website updates instantly.
    saveAds(ads);
    try {
      // Push to the backend so the mobile app (and other devices) get the ads.
      await api.updateAds(ads);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSyncError(
        "Saved on this device, but couldn't sync to the server — the app may not see these ads. Check your admin login and try again."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleReset = () => {
    setAds(resetAds());
    setSaved(false);
  };

  const liveCount = ads.filter((a) => a.enabled).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {ads.length} ad{ads.length === 1 ? "" : "s"} · {liveCount} live
          </p>
          <p className="text-xs text-slate-500">
            Create banners and choose which pages they appear on.
          </p>
        </div>
        <button
          type="button"
          onClick={addAd}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + Add ad
        </button>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-slate-600">No ads yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Click “Add ad” to create your first banner.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <AdEditor
              key={ad.id}
              ad={ad}
              onChange={(next) => updateAd(ad.id, next)}
              onDelete={() => deleteAd(ad.id)}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save & publish"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Reset
        </button>
        {saved && (
          <span className="text-sm font-semibold text-emerald-600">
            ✓ Saved — live on the site &amp; app
          </span>
        )}
        {syncError && (
          <span className="text-sm font-semibold text-amber-600">
            {syncError}
          </span>
        )}
      </div>
    </div>
  );
}
