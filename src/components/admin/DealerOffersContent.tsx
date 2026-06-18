"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  campaignToPromoPatch,
  daysUntilExpiry,
  defaultDealerOfferCampaign,
  type DealerOfferCampaign,
  type DealerOffersResponse,
} from "@/lib/dealerOffers";
import { getPromoOffer, savePromoOffer } from "@/lib/promoOffer";
import { useAdmin } from "@/context/AdminContext";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15";

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
      {hint ? <span className="ml-1 text-[11px] text-slate-400">{hint}</span> : null}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function DealerOffersContent() {
  const { logActivity } = useAdmin();
  const [data, setData] = useState<DealerOffersResponse | null>(null);
  const [campaign, setCampaign] = useState<DealerOfferCampaign>(defaultDealerOfferCampaign);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [promoSynced, setPromoSynced] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await api.adminDealerOffers();
      setData(next);
      setCampaign(next.campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dealer offers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = <K extends keyof DealerOfferCampaign>(key: K, value: DealerOfferCampaign[K]) => {
    setCampaign((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const next = await api.adminUpdateDealerOfferCampaign(campaign);
      setCampaign(next);
      setSaved(true);
      logActivity("dealer-offer-updated", "Dealer offer campaign saved");
      setTimeout(() => setSaved(false), 2500);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const syncPromo = () => {
    savePromoOffer({ ...getPromoOffer(), ...campaignToPromoPatch(campaign) });
    setPromoSynced(true);
    logActivity("dealer-offer-updated", "Synced dealer offer to site promo popup");
    setTimeout(() => setPromoSynced(false), 2500);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading dealer offers…
      </div>
    );
  }

  const stats = data?.stats;
  const grants = data?.active_grants ?? [];
  const plans = data?.plans ?? [];

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offer status" value={campaign.enabled ? "LIVE" : "OFF"} live={campaign.enabled} />
        <StatCard
          label="Active dealers"
          value={String(stats?.grants_used ?? 0)}
          sub={stats?.max_grants ? `of ${stats.max_grants} slots` : undefined}
        />
        <StatCard
          label="Slots left"
          value={stats?.slots_remaining != null ? String(stats.slots_remaining) : "∞"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Campaign editor */}
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-900">Campaign ON/OFF</p>
              <p className="text-xs text-slate-500">Jab ON ho, sales team offer de sakti hai</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={campaign.enabled}
              onClick={() => update("enabled", !campaign.enabled)}
              className={`relative h-7 w-12 rounded-full transition ${
                campaign.enabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  campaign.enabled ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Field label="Default plan">
              <select
                className={inputClass}
                value={campaign.default_plan_code}
                onChange={(e) => update("default_plan_code", e.target.value)}
              >
                {plans.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} — {p.duration_days} days,{" "}
                    {p.listing_limit === null ? "unlimited" : `${p.listing_limit} listings`}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Max dealers" hint="(offer limit)">
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={campaign.max_grants}
                  onChange={(e) => update("max_grants", Number(e.target.value) || 1)}
                />
              </Field>
              <Field label="Badge">
                <input
                  className={inputClass}
                  value={campaign.badge}
                  onChange={(e) => update("badge", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Title">
              <input className={inputClass} value={campaign.title} onChange={(e) => update("title", e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <input
                className={inputClass}
                value={campaign.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={inputClass}
                rows={3}
                value={campaign.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text">
                <input
                  className={inputClass}
                  value={campaign.cta_label}
                  onChange={(e) => update("cta_label", e.target.value)}
                />
              </Field>
              <Field label="Button link">
                <input
                  className={inputClass}
                  value={campaign.cta_href}
                  onChange={(e) => update("cta_href", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[#f75d34] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e54d24] disabled:opacity-60"
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save campaign"}
            </button>
            <button
              type="button"
              onClick={syncPromo}
              className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {promoSynced ? "Promo synced ✓" : "Sync to site popup"}
            </button>
          </div>
        </div>

        {/* Plans summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Available plans</h3>
            <ul className="mt-4 space-y-3">
              {plans.map((p) => (
                <li
                  key={p.code}
                  className={`rounded-xl border p-4 ${
                    p.code === campaign.default_plan_code
                      ? "border-[#f75d34] bg-orange-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {p.duration_days} days ·{" "}
                    {p.listing_limit === null ? "Unlimited listings" : `${p.listing_limit} listings`} ·{" "}
                    {p.price_inr === 0 ? "Free" : `₹${p.price_inr}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Sales team flow</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed">
              <li>Dealer register kare — /partner</li>
              <li>Admin → Sellers → user kholo</li>
              <li>&quot;Give dealer offer&quot; button dabao</li>
              <li>Dealer unlimited listing daal sakta hai</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Active grants table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Active dealer offers</h3>
          <p className="text-xs text-slate-500">Jo dealers abhi trial par hain</p>
        </div>
        {grants.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Abhi koi active dealer offer nahi hai.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Dealer</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Listings</th>
                  <th className="px-5 py-3">Expires</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grants.map((g) => (
                  <tr key={g.subscription_id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{g.user_name}</p>
                      <p className="text-xs text-slate-500">
                        +91 {g.user_phone} {g.user_city ? `· ${g.user_city}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{g.plan_name}</td>
                    <td className="px-5 py-3 font-semibold text-[#f75d34]">{g.listings_count}</td>
                    <td className="px-5 py-3">
                      <p className="text-slate-700">{daysUntilExpiry(g.expires_at)} days left</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(g.expires_at).toLocaleDateString("en-IN")}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/users/${g.user_id}`}
                        className="text-xs font-semibold text-[#f75d34] hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  live,
}: {
  label: string;
  value: string;
  sub?: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          live === true ? "text-emerald-600" : live === false ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}
