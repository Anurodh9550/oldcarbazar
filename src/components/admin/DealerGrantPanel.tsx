"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatExpiryLabel, type DealerOfferPlan } from "@/lib/dealerOffers";
import { useAdmin } from "@/context/AdminContext";

type GrantInfo = {
  plan: string;
  plan_name: string;
  expires_at: string;
};

export default function DealerGrantPanel({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { logActivity } = useAdmin();
  const [plans, setPlans] = useState<DealerOfferPlan[]>([]);
  const [defaultPlan, setDefaultPlan] = useState("dealer_trial_20");
  const [selectedPlan, setSelectedPlan] = useState("dealer_trial_20");
  const [campaignEnabled, setCampaignEnabled] = useState(true);
  const [activeGrant, setActiveGrant] = useState<GrantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.adminDealerOffers();
      setPlans(data.plans);
      setDefaultPlan(data.campaign.default_plan_code);
      setSelectedPlan(data.campaign.default_plan_code);
      setCampaignEnabled(data.campaign.enabled);
      const match = data.active_grants.find((g) => g.user_id === userId);
      if (match) {
        setActiveGrant({
          plan: match.plan,
          plan_name: match.plan_name,
          expires_at: match.expires_at,
        });
      } else {
        setActiveGrant(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load offer info.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const grant = async () => {
    if (!campaignEnabled) {
      setError("Dealer offer campaign is OFF. Enable it in Dealer Offers admin first.");
      return;
    }
    setGranting(true);
    setError("");
    setMessage("");
    try {
      const result = await api.adminGrantSubscription(userId, selectedPlan);
      setMessage(`${result.plan_name} activated for ${userName}!`);
      logActivity(
        "dealer-offer-granted",
        `Granted ${result.plan_name} to ${userName}`,
        userId
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not grant offer.");
    } finally {
      setGranting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
        Loading dealer offer…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Dealer offer</h3>
          <p className="mt-1 text-xs text-slate-500">
            Unlimited listing trial — sales team ke liye
          </p>
        </div>
        <Link
          href="/admin/dealer-offers"
          className="shrink-0 text-xs font-semibold text-[#f75d34] hover:underline"
        >
          Manage →
        </Link>
      </div>

      {activeGrant ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-bold text-emerald-800">Active: {activeGrant.plan_name}</p>
          <p className="mt-0.5 text-xs text-emerald-700">
            {formatExpiryLabel(activeGrant.expires_at)} · expires{" "}
            {new Date(activeGrant.expires_at).toLocaleDateString("en-IN")}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-600">Is user par abhi koi dealer trial active nahi hai.</p>
      )}

      {error ? <p className="mt-3 text-xs font-medium text-red-600">{error}</p> : null}
      {message ? <p className="mt-3 text-xs font-medium text-emerald-700">{message}</p> : null}

      <div className="mt-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-700">Select plan</label>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
        >
          {plans.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name} — {p.duration_days} days unlimited
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={grant}
          disabled={granting || !campaignEnabled}
          className="w-full rounded-xl bg-[#f75d34] py-3 text-sm font-bold text-white hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {granting
            ? "Activating…"
            : activeGrant
              ? "Extend / renew offer"
              : `Give ${defaultPlan === "dealer_trial_15" ? "15" : "20"}-day offer`}
        </button>

        {!campaignEnabled ? (
          <p className="text-center text-[11px] text-amber-700">
            Campaign is OFF —{" "}
            <Link href="/admin/dealer-offers" className="font-semibold underline">
              enable in Dealer Offers
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
