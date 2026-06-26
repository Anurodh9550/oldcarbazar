"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  type SellerLead,
  type SellerLeadType,
  type SellerLeadsResponse,
} from "@/lib/api";

const TYPE_META: Record<
  SellerLeadType,
  { label: string; icon: string; badge: string }
> = {
  view: { label: "Viewed", icon: "👁", badge: "bg-blue-50 text-blue-700 ring-blue-200" },
  inquiry: { label: "Inquiry", icon: "💬", badge: "bg-violet-50 text-violet-700 ring-violet-200" },
  whatsapp: { label: "WhatsApp", icon: "🟢", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  call: { label: "Call", icon: "📞", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  offer: { label: "Offer", icon: "₹", badge: "bg-orange-50 text-[#f75d34] ring-orange-200" },
  test_drive: { label: "Test drive", icon: "🚗", badge: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
};

type FilterKey = "all" | SellerLeadType;

function fmtTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export default function LeadsContent() {
  const [data, setData] = useState<SellerLeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.sellerLeads();
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load leads.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.leads;
    if (filter === "inquiry") {
      return data.leads.filter(
        (l) => l.type === "inquiry" || l.type === "call" || l.type === "whatsapp"
      );
    }
    return data.leads.filter((l) => l.type === filter);
  }, [data, filter]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const s = data.summary;
  const stats = [
    { label: "Total leads", value: s.total, tone: "from-orange-500 to-[#f75d34]" },
    { label: "Views", value: s.views, tone: "from-blue-500 to-indigo-600" },
    { label: "Inquiries", value: s.inquiries, tone: "from-violet-500 to-purple-600" },
    { label: "Offers", value: s.offers, tone: "from-orange-400 to-amber-500" },
    { label: "Test drives", value: s.test_drives, tone: "from-emerald-500 to-green-600" },
  ];

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "view", label: "Views" },
    { key: "inquiry", label: "Inquiries" },
    { key: "offer", label: "Offers" },
    { key: "test_drive", label: "Test drives" },
  ];

  return (
    <div className="space-y-8">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((card) => (
          <li
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.tone} p-4 text-white shadow-md`}
          >
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs font-medium opacity-90">{card.label}</p>
          </li>
        ))}
      </ul>

      {data.per_listing.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">Leads by car</h2>
          <p className="mt-1 text-xs text-gray-500">
            See how much interest each listing is getting.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-2 pr-3">Car</th>
                  <th className="py-2 px-2 text-center">👁 Views</th>
                  <th className="py-2 px-2 text-center">💬 Inquiry</th>
                  <th className="py-2 px-2 text-center">₹ Offer</th>
                  <th className="py-2 px-2 text-center">🚗 Test</th>
                  <th className="py-2 pl-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.per_listing.map((row) => (
                  <tr key={row.listing_id} className="border-b border-gray-100">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/used-cars/${row.listing_id}`}
                        className="font-semibold text-gray-900 hover:text-[#f75d34]"
                      >
                        {row.listing_title}
                      </Link>
                      {row.listing_price && (
                        <span className="ml-2 text-xs text-[#f75d34]">
                          {row.listing_price}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-700">{row.views}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{row.inquiries}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{row.offers}</td>
                    <td className="py-3 px-2 text-center text-gray-700">{row.test_drives}</td>
                    <td className="py-3 pl-2 text-center font-bold text-gray-900">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === f.key
                  ? "bg-[#f75d34] text-white shadow"
                  : "border border-gray-200 text-gray-600 hover:border-[#f75d34] hover:text-[#f75d34]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredLeads.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
            <span className="text-5xl">📭</span>
            <p className="mt-3 text-sm font-medium text-gray-700">No leads yet</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
              When a customer views your listing or sends an inquiry, it will appear
              here with their name and number.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={`${lead.type}-${lead.id}`}
                lead={lead}
                onMarkedResponded={() => {
                  void (async () => {
                    try {
                      const res = await api.sellerLeads();
                      setData(res);
                    } catch {
                      /* refresh best-effort */
                    }
                  })();
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function LeadCard({
  lead,
  onMarkedResponded,
}: {
  lead: SellerLead;
  onMarkedResponded?: () => void;
}) {
  const meta = TYPE_META[lead.type] ?? TYPE_META.inquiry;
  const hasPhone = lead.phone && lead.phone.replace(/\D/g, "").length >= 10;
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(
    lead.status === "responded" || lead.status === "closed"
  );
  const canMarkResponded =
    (lead.type === "inquiry" ||
      lead.type === "call" ||
      lead.type === "whatsapp") &&
    !marked;

  const handleMarkResponded = async () => {
    if (marking || marked) return;
    setMarking(true);
    try {
      await api.markInquiryResponded(lead.id);
      setMarked(true);
      onMarkedResponded?.();
    } catch {
      /* endpoint may be unavailable until backend deploy */
    } finally {
      setMarking(false);
    }
  };

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${meta.badge}`}
            >
              {meta.icon} {meta.label}
            </span>
            {lead.amount != null && (
              <span className="text-sm font-bold text-[#f75d34]">
                ₹{lead.amount.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Link
            href={`/used-cars/${lead.listing_id}`}
            className="mt-2 block truncate text-sm font-bold text-gray-900 hover:text-[#f75d34]"
          >
            {lead.listing_title}
          </Link>
          <p className="mt-1 text-sm text-gray-700">{lead.message}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-700">{lead.name}</span>
            {hasPhone && <span>+91 {lead.phone}</span>}
            {lead.city && <span>📍 {lead.city}</span>}
            <span>•</span>
            <span>{fmtTime(lead.created_at)}</span>
          </p>
        </div>

        {hasPhone && (
          <div className="flex shrink-0 flex-col gap-1.5">
            {canMarkResponded && (
              <button
                type="button"
                disabled={marking}
                onClick={() => void handleMarkResponded()}
                className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-60"
              >
                {marking ? "Saving…" : marked ? "✓ Responded" : "Mark responded"}
              </button>
            )}
            <a
              href={`tel:+91${lead.phone.replace(/\D/g, "").slice(-10)}`}
              className="flex items-center justify-center gap-1 rounded-lg bg-[#f75d34] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#e54d24]"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/${waNumber(lead.phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              🟢 WhatsApp
            </a>
          </div>
        )}
      </div>
    </li>
  );
}
