"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultPromoOffer,
  getPromoOffer,
  PROMO_THEMES,
  resetPromoOffer,
  savePromoOffer,
  type PromoOffer,
  type PromoTheme,
} from "@/lib/promoOffer";
import PromoCard from "@/components/promo/PromoCard";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {hint && <span className="ml-1 text-[11px] text-slate-400">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15";

export default function PromoOffersContent() {
  const [offer, setOffer] = useState<PromoOffer>(defaultPromoOffer);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOffer(getPromoOffer());
  }, []);

  const update = <K extends keyof PromoOffer>(key: K, value: PromoOffer[K]) => {
    setOffer((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    const next = savePromoOffer(offer);
    setOffer(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const next = resetPromoOffer();
    setOffer(next);
    setSaved(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Editor */}
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-bold text-slate-900">Popup status</p>
            <p className="text-xs text-slate-500">
              When on, this offer card shows to visitors across the site.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={offer.enabled}
            onClick={() => update("enabled", !offer.enabled)}
            className={`relative h-7 w-12 rounded-full transition ${
              offer.enabled ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                offer.enabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Field label="Badge" hint="(small label on top)">
            <input
              className={inputClass}
              value={offer.badge}
              onChange={(e) => update("badge", e.target.value)}
              placeholder="LIMITED OFFER"
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={offer.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Festive Season Dhamaka!"
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputClass}
              value={offer.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Up to ₹50,000 off on assured cars"
            />
          </Field>
          <Field label="Description">
            <textarea
              className={inputClass}
              rows={3}
              value={offer.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the offer or new feature…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text">
              <input
                className={inputClass}
                value={offer.ctaLabel}
                onChange={(e) => update("ctaLabel", e.target.value)}
                placeholder="Explore Offers"
              />
            </Field>
            <Field label="Button link" hint="(e.g. /used-cars)">
              <input
                className={inputClass}
                value={offer.ctaHref}
                onChange={(e) => update("ctaHref", e.target.value)}
                placeholder="/used-cars"
              />
            </Field>
          </div>

          <Field label="Image URL" hint="(optional banner)">
            <input
              className={inputClass}
              value={offer.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://…/banner.jpg"
            />
          </Field>

          <Field label="Theme">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PROMO_THEMES) as PromoTheme[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update("theme", key)}
                  className={`rounded-lg border-2 px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    offer.theme === key
                      ? "border-[#f75d34] text-[#f75d34]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`mr-1.5 inline-block h-3 w-3 rounded-full align-middle ${PROMO_THEMES[key].card}`}
                  />
                  {PROMO_THEMES[key].label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Show after (seconds)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={offer.delaySeconds}
                onChange={(e) =>
                  update("delaySeconds", Number(e.target.value) || 0)
                }
              />
            </Field>
            <Field label="Re-show after (days)" hint="(once dismissed)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={offer.dismissDays}
                onChange={(e) =>
                  update("dismissDays", Number(e.target.value) || 0)
                }
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            Save & publish
          </button>
          <Link
            href="/admin/dealer-offers"
            className="rounded-lg border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-semibold text-[#c2410c] hover:bg-orange-100"
          >
            Dealer Offers →
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset to default
          </button>
          {saved && (
            <span className="text-sm font-semibold text-emerald-600">
              ✓ Saved — live on the site
            </span>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div>
        <div className="sticky top-24">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Live preview
          </p>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-6">
            {offer.enabled ? (
              <PromoCard offer={offer} preview />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Popup is turned off
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Turn it on to show this offer to visitors.
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Tip: changes go live for visitors as soon as you click “Save &amp;
            publish”. Edited offers re-appear even for users who closed an older
            version.
          </p>
        </div>
      </div>
    </div>
  );
}
