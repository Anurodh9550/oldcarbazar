"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useChromeCopy, useLanguage } from "@/context/LanguageContext";
import { ApiError, api, type ApiDealerDetail } from "@/lib/api";
import {
  fetchDealerShowroom,
  getShowroomOrDefault,
  hasPublishedShowroom,
} from "@/lib/dealerShowroom";
import { fetchDealerAvailability } from "@/lib/dealerCarAvailability";
import VirtualShowroomView from "@/components/dealers/showroom/VirtualShowroomView";
import PageLoader from "@/components/ui/PageLoader";
import type { DealerShowroom } from "@/types/dealerShowroom";

export default function DealerShowroomPage({ dealerId }: { dealerId: string }) {
  const { t } = useLanguage();
  const copy = useChromeCopy();
  const [dealer, setDealer] = useState<ApiDealerDetail | null>(null);
  const [showroom, setShowroom] = useState<DealerShowroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [dealerData, showroomData] = await Promise.all([
          api.getDealer(dealerId),
          fetchDealerShowroom(dealerId),
          fetchDealerAvailability(dealerId),
        ]);
        if (!cancelled) {
          setDealer(dealerData);
          setShowroom(
            showroomData ??
              getShowroomOrDefault(dealerId, dealerData.name ?? "Dealer Showroom")
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError && err.status === 404
              ? copy.dealers.notFoundTitle
              : copy.dealers.loadError
          );
          setShowroom(getShowroomOrDefault(dealerId, "Dealer Showroom"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dealerId, copy.dealers.notFoundTitle, copy.dealers.loadError]);

  if (loading) {
    return (
      <main className="bg-[#f7f7f7] px-4 py-16">
        <PageLoader message={copy.showroom.loadingShowroom} />
      </main>
    );
  }

  if (error && !dealer) {
    return (
      <main className="bg-[#f7f7f7] px-4 py-16 text-center">
        <p className="text-sm text-gray-500">{error}</p>
        <Link href="/dealers" className="mt-4 inline-block text-sm font-semibold text-[#f75d34]">
          ← {copy.dealers.allDealers}
        </Link>
      </main>
    );
  }

  const resolved =
    showroom ?? getShowroomOrDefault(dealerId, dealer?.name ?? "Dealer Showroom");

  if (!hasPublishedShowroom(resolved)) {
    return (
      <main className="bg-[#f7f7f7] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
          <span className="text-4xl">🏪</span>
          <h2 className="mt-3 text-lg font-bold text-gray-900">
            {copy.showroom.comingSoonTitle}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t(copy.showroom.comingSoonSub, { name: dealer?.name ?? "" })}
          </p>
          {dealer && (
            <Link
              href={`/dealers/${dealer.id}`}
              className="mt-6 inline-block rounded-full bg-[#f75d34] px-6 py-2 text-sm font-semibold text-white"
            >
              {copy.showroom.viewDealerProfile}
            </Link>
          )}
        </div>
      </main>
    );
  }

  return <VirtualShowroomView showroom={resolved} dealer={dealer} />;
}
