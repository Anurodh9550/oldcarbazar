"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useChromeCopy, useLanguage } from "@/context/LanguageContext";
import type { ApiDealerDetail } from "@/lib/api";
import { apiListingToCarListing } from "@/lib/api";
import { enrichCar } from "@/lib/carMeta";
import { getListingAvailability } from "@/lib/dealerCarAvailability";
import type { DealerShowroom } from "@/types/dealerShowroom";
import { AVAILABILITY_STATUS_META } from "@/types/dealerAvailability";
import ExploreCarCard from "@/components/explore/ExploreCarCard";
import SectionHeader from "@/components/ui/SectionHeader";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(Math.min(5, Math.max(0, rating)))}
      <span className="text-gray-300">{"★".repeat(5 - Math.min(5, Math.max(0, rating)))}</span>
    </span>
  );
}

type VirtualShowroomViewProps = {
  showroom: DealerShowroom;
  dealer?: ApiDealerDetail | null;
};

export default function VirtualShowroomView({
  showroom,
  dealer,
}: VirtualShowroomViewProps) {
  const { t } = useLanguage();
  const copy = useChromeCopy();
  const enrichedListings = useMemo(() => {
    if (!dealer) return [];
    return dealer.listings.map((apiL) => enrichCar(apiListingToCarListing(apiL)));
  }, [dealer]);

  const phone = showroom.phone || dealer?.phone || "";
  const whatsappHref = phone
    ? `https://wa.me/91${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi ${showroom.dealerName}, I visited your Showroom on Old Car Bazar.`
      )}`
    : "#";

  const galleryWhatsApp = (title: string) =>
    phone
      ? `https://wa.me/91${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Hi ${showroom.dealerName}, I'm interested in ${title} from your Showroom.`
        )}`
      : "#";

  const avgRating =
    showroom.reviews.length > 0
      ? (
          showroom.reviews.reduce((s, r) => s + r.rating, 0) /
          showroom.reviews.length
        ).toFixed(1)
      : null;

  return (
    <main className="bg-[#f7f7f7]">
      {/* Banner + Logo hero */}
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[340px]">
        <Image
          src={showroom.bannerUrl}
          alt={`${showroom.dealerName} showroom`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-[#f75d34]/30" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-8 sm:px-8 lg:px-12">
          <Link
            href={dealer ? `/dealers/${dealer.id}` : "/dealers"}
            className="inline-flex w-fit items-center gap-1 text-xs text-gray-300 hover:text-white"
          >
            {copy.showroom.backToProfile}
          </Link>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white shadow-xl sm:h-28 sm:w-28">
              {showroom.logoUrl || dealer?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={showroom.logoUrl || dealer?.avatar_url}
                  alt={showroom.dealerName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f75d34] to-[#e54d24] text-2xl font-bold text-white">
                  {initials(showroom.dealerName)}
                </div>
              )}
            </div>
            <div className="flex-1 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">
                {copy.showroom.editorEyebrow}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                {showroom.dealerName}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-gray-200 sm:text-base">
                {showroom.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {phone && (
                  <a
                    href={`tel:+91${phone.replace(/\D/g, "")}`}
                    className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
                  >
                    {copy.showroom.callNow}
                  </a>
                )}
                {phone && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-8 lg:px-12">
          <Stat label={copy.showroom.carsListed} value={enrichedListings.length} />
          <Stat label={copy.showroom.teamMembers} value={showroom.team.length} />
          <Stat
            label={copy.showroom.customerReviews}
            value={showroom.reviews.length}
          />
          {avgRating && <Stat label={copy.showroom.avgRating} value={`${avgRating} ★`} />}
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={copy.showroom.aboutUs}
            title={t(copy.showroom.welcomeTitle, { name: showroom.dealerName })}
            subtitle={showroom.about}
          />
          {showroom.address && (
            <p className="mt-4 flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#f75d34]">📍</span>
              {showroom.address}
            </p>
          )}
        </div>
      </section>

      {/* Team */}
      {showroom.team.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow={copy.showroom.ourTeam} title={copy.showroom.meetTeam} />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showroom.team.map((member) => (
                <li
                  key={member.id}
                  className="card-surface flex gap-4 p-5"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {member.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50 text-lg font-bold text-[#f75d34]">
                        {initials(member.name)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{member.name}</p>
                    <p className="text-sm font-medium text-[#f75d34]">{member.role}</p>
                    {member.bio && (
                      <p className="mt-1 text-sm text-gray-600">{member.bio}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* All Cars */}
      <section className="px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={copy.showroom.inventory}
            title={copy.showroom.allCars}
            subtitle={copy.showroom.allCarsSub}
          />
          {enrichedListings.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center">
              <p className="text-sm text-gray-500">{copy.dealers.noActiveListings}</p>
            </div>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrichedListings.map((car) => {
                const avail = dealer
                  ? getListingAvailability(dealer.id, car.id)
                  : null;
                const meta = avail
                  ? AVAILABILITY_STATUS_META[avail.status]
                  : AVAILABILITY_STATUS_META.available;
                return (
                  <li key={car.id} className="relative">
                    {avail && (
                      <span
                        className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${meta.bg} ${meta.color} ${meta.ring}`}
                      >
                        {meta.label}
                      </span>
                    )}
                    <ExploreCarCard car={car} layout="grid" showEmi />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Unlisted cars / gallery */}
      {(showroom.gallery?.length ?? 0) > 0 && (
        <section className="bg-white px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              eyebrow={copy.showroom.moreStock}
              title={copy.showroom.moreInShowroom}
              subtitle={copy.showroom.moreInShowroomSub}
            />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showroom.gallery.map((item) => (
                <li
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {item.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                        🚗
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Not listed
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.priceLabel && (
                      <p className="mt-1 text-sm font-semibold text-[#f75d34]">
                        {item.priceLabel}
                      </p>
                    )}
                    {item.note && (
                      <p className="mt-2 text-sm text-gray-600">{item.note}</p>
                    )}
                    {phone && (
                      <a
                        href={galleryWhatsApp(item.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-semibold text-[#f75d34] hover:underline"
                      >
                        Ask on WhatsApp →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Reviews */}
      {showroom.reviews.length > 0 && (
        <section className="bg-white px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow={copy.showroom.reviews} title={copy.showroom.whatCustomersSay} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {showroom.reviews.map((review) => (
                <li key={review.id} className="card-surface p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {review.text}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">{review.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-r from-[#f75d34] to-[#e54d24] px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-xl font-bold sm:text-2xl">Ready to find your next car?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-orange-100">
            Visit us or chat on WhatsApp — we respond quickly during business hours.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {phone && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#f75d34] hover:bg-orange-50"
              >
                Chat on WhatsApp
              </a>
            )}
            <Link
              href={dealer ? `/dealers/${dealer.id}` : "/dealers"}
              className="rounded-full border-2 border-white px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10"
            >
              {copy.dealers.profile}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
    </div>
  );
}
