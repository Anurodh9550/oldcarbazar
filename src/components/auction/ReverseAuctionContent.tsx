"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { carBrands, fuelTypes, transmissionTypes } from "@/data/sellCarForm";
import { bodyTypes } from "@/data/explorePage";
import {
  addDealerBid,
  AUCTION_CHANGED_EVENT,
  closeAuction,
  createAuction,
  getBuyerAuctions,
  listOpenAuctions,
} from "@/lib/reverseAuction";
import type { ReverseAuctionRequest } from "@/types/reverseAuction";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

type Tab = "buyer" | "dealer";

const emptyBuyer = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  city: "",
  budgetMinLakh: "3",
  budgetMaxLakh: "8",
  brand: "",
  bodyType: "SUV",
  fuel: "Petrol",
  transmission: "Manual",
  notes: "",
};

const emptyBid = {
  dealerName: "",
  dealerPhone: "",
  carTitle: "",
  priceLakh: "",
  year: String(new Date().getFullYear() - 2),
  kms: "",
  message: "",
};

function fmtTime(ts: number) {
  return new Date(ts).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReverseAuctionContent() {
  const { user, isLoggedIn } = useAuth();
  const { selectedCity } = useLocation();
  const [tab, setTab] = useState<Tab>("buyer");
  const [openAuctions, setOpenAuctions] = useState<ReverseAuctionRequest[]>([]);
  const [myAuctions, setMyAuctions] = useState<ReverseAuctionRequest[]>([]);
  const [buyerForm, setBuyerForm] = useState(emptyBuyer);
  const [bidForm, setBidForm] = useState(emptyBid);
  const [bidTarget, setBidTarget] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const refresh = () => {
    setOpenAuctions(listOpenAuctions());
    const phone = user?.phone || buyerForm.buyerPhone;
    setMyAuctions(phone ? getBuyerAuctions(phone) : []);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(AUCTION_CHANGED_EVENT, handler);
    return () => window.removeEventListener(AUCTION_CHANGED_EVENT, handler);
  }, [user?.phone, buyerForm.buyerPhone]);

  useEffect(() => {
    if (user) {
      setBuyerForm((f) => ({
        ...f,
        buyerName: user.name || f.buyerName,
        buyerPhone: user.phone || f.buyerPhone,
        buyerEmail: user.email || f.buyerEmail,
        city: f.city || selectedCity,
      }));
    }
  }, [user, selectedCity]);

  const lowestBid = useMemo(() => {
    const map: Record<string, number> = {};
    openAuctions.forEach((a) => {
      map[a.id] = a.bids[0]?.priceLakh ?? 0;
    });
    return map;
  }, [openAuctions]);

  const postRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerForm.buyerName.trim() || buyerForm.buyerPhone.length < 10) {
      setToast("Enter your name and valid 10-digit mobile.");
      return;
    }
    if (Number(buyerForm.budgetMaxLakh) < Number(buyerForm.budgetMinLakh)) {
      setToast("Max budget must be greater than min budget.");
      return;
    }
    createAuction({
      buyerName: buyerForm.buyerName.trim(),
      buyerPhone: buyerForm.buyerPhone,
      buyerEmail: buyerForm.buyerEmail.trim(),
      city: buyerForm.city || selectedCity,
      budgetMinLakh: Number(buyerForm.budgetMinLakh),
      budgetMaxLakh: Number(buyerForm.budgetMaxLakh),
      brand: buyerForm.brand,
      bodyType: buyerForm.bodyType,
      fuel: buyerForm.fuel,
      transmission: buyerForm.transmission,
      notes: buyerForm.notes.trim(),
    });
    setToast("Request posted — dealers will compete with their best offers.");
    refresh();
  };

  const submitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidTarget) return;
    if (!bidForm.dealerName.trim() || bidForm.dealerPhone.length < 10) {
      setToast("Enter dealer name and valid phone.");
      return;
    }
    const price = Number(bidForm.priceLakh);
    if (!price || price <= 0) {
      setToast("Enter a valid offer price in Lakhs.");
      return;
    }
    const ok = addDealerBid(bidTarget, {
      dealerName: bidForm.dealerName.trim(),
      dealerPhone: bidForm.dealerPhone,
      carTitle: bidForm.carTitle.trim() || "Used car offer",
      priceLakh: price,
      year: Number(bidForm.year) || 2020,
      kms: Number(bidForm.kms) || 0,
      message: bidForm.message.trim(),
    });
    if (!ok) {
      setToast("Could not place bid — auction may be closed.");
      return;
    }
    setToast("Bid submitted — buyer will see your competing offer.");
    setBidTarget(null);
    setBidForm(emptyBid);
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Reverse Auction
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          Dealers compete — you pick the best deal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Post what you need once. Verified dealers submit competing offers —
          lowest price wins your attention. No haggling with multiple sellers.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "buyer" as const, label: "I'm a buyer" },
            { id: "dealer" as const, label: "I'm a dealer" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              tab === t.id
                ? "bg-[#f75d34] text-white"
                : "border border-gray-200 text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast && (
        <p className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white">
          {toast}
          <button
            type="button"
            className="ml-3 text-white/70 hover:text-white"
            onClick={() => setToast("")}
          >
            ✕
          </button>
        </p>
      )}

      {tab === "buyer" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={postRequest}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-gray-900">Post your requirement</h3>
            {!isLoggedIn && (
              <p className="text-xs text-gray-500">
                <Link href="/sell-car" className="font-semibold text-[#f75d34]">
                  Log in
                </Link>{" "}
                to auto-fill contact details.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Your name *
                </span>
                <input
                  required
                  value={buyerForm.buyerName}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, buyerName: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Mobile *
                </span>
                <input
                  required
                  value={buyerForm.buyerPhone}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, buyerPhone: e.target.value }))
                  }
                  className={inputClass}
                  maxLength={10}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  City
                </span>
                <input
                  value={buyerForm.city}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, city: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Budget min (₹ Lakh)
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={buyerForm.budgetMinLakh}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, budgetMinLakh: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Budget max (₹ Lakh)
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={buyerForm.budgetMaxLakh}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, budgetMaxLakh: e.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Preferred brand
                </span>
                <select
                  value={buyerForm.brand}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, brand: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Any brand</option>
                  {carBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Body type
                </span>
                <select
                  value={buyerForm.bodyType}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, bodyType: e.target.value }))
                  }
                  className={inputClass}
                >
                  {bodyTypes.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Fuel
                </span>
                <select
                  value={buyerForm.fuel}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, fuel: e.target.value }))
                  }
                  className={inputClass}
                >
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-gray-600">
                  Transmission
                </span>
                <select
                  value={buyerForm.transmission}
                  onChange={(e) =>
                    setBuyerForm((f) => ({ ...f, transmission: e.target.value }))
                  }
                  className={inputClass}
                >
                  {transmissionTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Additional notes
              </span>
              <textarea
                rows={3}
                value={buyerForm.notes}
                onChange={(e) =>
                  setBuyerForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={inputClass}
                placeholder="First owner only, max 50k km, white colour…"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#f75d34] py-3 text-sm font-bold text-white hover:bg-[#e54d24]"
            >
              Start reverse auction
            </button>
          </form>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Your auctions & dealer bids</h3>
            {myAuctions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
                Post a requirement to see dealer bids here.
              </p>
            ) : (
              <ul className="space-y-4">
                {myAuctions.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          ₹{a.budgetMinLakh}–{a.budgetMaxLakh} Lakh · {a.bodyType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {a.city} · {a.fuel} · {a.transmission}
                          {a.brand ? ` · ${a.brand}` : ""}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          Posted {fmtTime(a.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          a.status === "open"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                    {a.bids.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-500">
                        Waiting for dealer bids…
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {a.bids.map((b, i) => (
                          <li
                            key={b.id}
                            className={`rounded-xl px-3 py-2 text-sm ${
                              i === 0
                                ? "border border-emerald-200 bg-emerald-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold text-gray-900">
                                ₹{b.priceLakh} Lakh — {b.carTitle}
                              </span>
                              {i === 0 && (
                                <span className="text-[10px] font-bold uppercase text-emerald-700">
                                  Lowest bid
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {b.year} · {b.kms.toLocaleString("en-IN")} km ·{" "}
                              {b.dealerName}
                            </p>
                            {b.message && (
                              <p className="mt-1 text-xs text-gray-500">{b.message}</p>
                            )}
                            <a
                              href={`https://wa.me/91${b.dealerPhone.replace(/\D/g, "").slice(-10)}`}
                              className="mt-2 inline-block text-xs font-semibold text-emerald-700 hover:underline"
                            >
                              WhatsApp dealer →
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {a.status === "open" && (
                      <button
                        type="button"
                        onClick={() => {
                          closeAuction(a.id);
                          setToast("Auction closed.");
                          refresh();
                        }}
                        className="mt-3 text-xs font-semibold text-gray-500 hover:text-red-600"
                      >
                        Close auction
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "dealer" && (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Browse open buyer requests and submit your best competing offer.{" "}
            <Link href="/dealers" className="font-semibold text-[#f75d34]">
              List your dealership →
            </Link>
          </p>
          {openAuctions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
              No open auctions right now. Check back soon.
            </p>
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {openAuctions.map((a) => (
                <li
                  key={a.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <p className="font-bold text-gray-900">
                    ₹{a.budgetMinLakh}–{a.budgetMaxLakh} Lakh
                  </p>
                  <p className="text-sm text-gray-600">
                    {a.bodyType} · {a.fuel} · {a.transmission}
                    {a.brand ? ` · ${a.brand}` : ""} · {a.city}
                  </p>
                  {a.notes && (
                    <p className="mt-2 text-xs text-gray-500">{a.notes}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {a.bids.length} bid{a.bids.length !== 1 ? "s" : ""}
                    {lowestBid[a.id]
                      ? ` · lowest ₹${lowestBid[a.id]} L`
                      : " · be the first to bid"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setBidTarget(a.id)}
                    className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
                  >
                    Submit competing offer
                  </button>
                </li>
              ))}
            </ul>
          )}

          {bidTarget && (
            <form
              onSubmit={submitBid}
              className="space-y-4 rounded-2xl border-2 border-violet-200 bg-violet-50/40 p-5"
            >
              <h3 className="font-bold text-gray-900">Your dealer bid</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold">Dealer name *</span>
                  <input
                    required
                    value={bidForm.dealerName}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, dealerName: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold">Phone *</span>
                  <input
                    required
                    value={bidForm.dealerPhone}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, dealerPhone: e.target.value }))
                    }
                    className={inputClass}
                    maxLength={10}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs font-semibold">Car title</span>
                  <input
                    value={bidForm.carTitle}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, carTitle: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="2021 Hyundai Creta SX"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold">
                    Your offer (₹ Lakh) *
                  </span>
                  <input
                    required
                    type="number"
                    step="0.1"
                    value={bidForm.priceLakh}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, priceLakh: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold">Year</span>
                  <input
                    type="number"
                    value={bidForm.year}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, year: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold">KMs</span>
                  <input
                    type="number"
                    value={bidForm.kms}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, kms: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs font-semibold">Message</span>
                  <textarea
                    rows={2}
                    value={bidForm.message}
                    onChange={(e) =>
                      setBidForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-bold text-white"
                >
                  Place bid
                </button>
                <button
                  type="button"
                  onClick={() => setBidTarget(null)}
                  className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
