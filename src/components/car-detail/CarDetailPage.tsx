"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useListings } from "@/context/ListingsContext";
import {
  buildCarDetail,
  findCarById,
  getCarDetailPath,
  getSimilarCars,
  REVIEW_SAMPLES,
  type CarDetailTab,
} from "@/lib/carDetail";
import ExploreCarCard from "@/components/explore/ExploreCarCard";
import SellerDetailsModal from "@/components/car-detail/SellerDetailsModal";
import BuyerInquiryModal from "@/components/car-detail/BuyerInquiryModal";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { HeartIcon } from "@/components/icons";

const TABS: { id: CarDetailTab; label: string }[] = [
  { id: "overview", label: "OVERVIEW" },
  { id: "specs", label: "SPECS & FEATURES" },
  { id: "services", label: "ADDON SERVICES" },
  { id: "emi", label: "EMI CALC" },
  { id: "reviews", label: "REVIEWS" },
];

type CarDetailPageProps = {
  carId: string;
};

export default function CarDetailPage({ carId }: CarDetailPageProps) {
  const { allListings } = useListings();
  const [activeTab, setActiveTab] = useState<CarDetailTab>("overview");
  const [imageIndex, setImageIndex] = useState(0);
  const [loanYears, setLoanYears] = useState(3);
  const [loanLakh, setLoanLakh] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleViewSellerClick = () => {
    // First-time buyers must submit Name + Phone before seller info is revealed.
    if (!inquirySubmitted) {
      setShowInquiry(true);
      return;
    }
    setShowSeller(true);
  };

  const handleInquirySubmitted = () => {
    setInquirySubmitted(true);
    setShowInquiry(false);
    setShowSeller(true);
  };

  const listing = findCarById(carId, allListings);
  const detail = useMemo(
    () => (listing ? buildCarDetail(listing) : null),
    [listing]
  );

  const similar = useMemo(
    () => (detail ? getSimilarCars(detail, allListings) : []),
    [detail, allListings]
  );

  if (!detail) {
    return (
      <main className="mx-auto max-w-[1280px] px-4 py-16 text-center">
        <h1 className="section-title-lg">Car not found</h1>
        <p className="text-body-muted mt-2">This listing may have been removed.</p>
        <Link href="/used-cars" className="text-link mt-6 inline-block">
          ← Back to listings
        </Link>
      </main>
    );
  }

  const loanAmount = loanLakh || Math.round(detail.priceLakh * 0.9 * 100) / 100;
  const r = detail.emiRate / 12 / 100;
  const n = loanYears * 12;
  const principal = loanAmount * 100000;
  const emi =
    r === 0
      ? Math.round(principal / n)
      : Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const whatsappHref = `https://wa.me/91${detail.sellerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in ${detail.title} listed on Old Car Bazar.`)}`;

  const quickLine = `${detail.transmission} • ${detail.fuel} • ${detail.ownership} • ${detail.kms.toLocaleString("en-IN")} kms`;

  return (
    <main className="bg-[#f5f5f5] pb-16">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-3 text-caption sm:px-6">
          <Link href="/used-cars" className="hover:text-[#f75d34]">
            Used Cars
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{detail.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-200">
              <ListingImage
                src={detail.images[imageIndex]}
                alt={detail.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i === 0 ? detail.images.length - 1 : i - 1))
                }
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl shadow"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i === detail.images.length - 1 ? 0 : i + 1))
                }
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl shadow"
                aria-label="Next image"
              >
                ›
              </button>
              <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                {imageIndex + 1}/{detail.images.length}
              </span>
            </div>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {detail.images.map((src, i) => (
                <li key={src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 ${
                      i === imageIndex ? "border-[#f75d34]" : "border-transparent"
                    }`}
                  >
                    <ListingImage src={src} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{detail.title}</h1>
                  <p className="text-body-muted mt-0.5">{detail.variant}</p>
                </div>
                <button type="button" aria-label="Save" className="text-gray-400 hover:text-[#f75d34]">
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-caption mt-3">{quickLine}</p>
              <p className="mt-4 text-2xl font-bold text-gray-900">{detail.price}</p>
              <p className="text-caption mt-1">
                EMI starts @ ₹{detail.emiMonthly.toLocaleString("en-IN")} /mo
              </p>
              {detail.discountPercent && (
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
                  ↓ {detail.discountPercent}% less vs estimated new car price
                </p>
              )}
              <button
                type="button"
                onClick={handleViewSellerClick}
                className="text-btn mt-5 w-full rounded-xl bg-[#f75d34] py-3.5 text-white hover:bg-[#e54d24]"
              >
                {inquirySubmitted ? "View Seller Details" : "Get Seller Contact"}
              </button>
              <p className="text-caption mt-3 flex items-center gap-1">
                <span aria-hidden>📍</span>
                {detail.area}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <button type="button" className="hover:text-[#f75d34]">
                  Report Ad
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-green-700 hover:underline"
                >
                  <WhatsAppIcon size={18} />
                  Chat with Seller
                </a>
                <button type="button" className="hover:text-[#f75d34]">
                  Share
                </button>
                <label className="ml-auto flex items-center gap-1.5">
                  <input type="checkbox" className="accent-[#f75d34]" />
                  Compare
                </label>
              </div>
            </div>
          </aside>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 sm:px-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold tracking-wide sm:text-sm ${
                  activeTab === tab.id
                    ? "border-[#f75d34] text-[#f75d34]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-6">
            {activeTab === "overview" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="section-title">Car Overview</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {detail.overview.map((item) => (
                    <li key={item.label} className="flex gap-3 rounded-xl bg-gray-50 p-4">
                      <span className="text-xl" aria-hidden>
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-caption">{item.label}</p>
                        <p className="card-title mt-0.5">{item.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {detail.description && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="card-title">Seller&apos;s Note</h3>
                    <p className="text-body-muted mt-2">{detail.description}</p>
                  </div>
                )}
              </section>
            )}

            {activeTab === "specs" && (
              <>
                <section className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="section-title">Features</h2>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {(showAllFeatures ? detail.features : detail.features.slice(0, 6)).map(
                      (f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-600">✓</span>
                          {f}
                        </li>
                      )
                    )}
                  </ul>
                  {detail.features.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllFeatures((v) => !v)}
                      className="text-link mt-4 text-sm"
                    >
                      {showAllFeatures ? "Show less" : "View all Features"} ↓
                    </button>
                  )}
                  <p className="text-caption mt-4">
                    Comfort | Interior | Exterior | Safety | Entertainment
                  </p>
                </section>
                <section className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="section-title">Specifications</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {detail.specifications.map((s) => (
                      <li
                        key={s.label}
                        className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm"
                      >
                        <span className="text-gray-500">{s.label}</span>
                        <span className="font-semibold text-gray-900">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="section-title">Check RTO Details for This Car</h2>
                  <p className="text-body-muted mt-2">
                    RC validity, insurance status, challan & vehicle compliance — free report.
                  </p>
                  <button
                    type="button"
                    className="text-btn mt-4 rounded-xl border-2 border-[#f75d34] px-6 py-2.5 text-[#f75d34] hover:bg-orange-50"
                  >
                    Get Full RTO Report — Free
                  </button>
                </section>
              </>
            )}

            {activeTab === "services" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="section-title">
                  Avail Addon Services On {detail.brand} {detail.bodyType}
                </h2>
                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50/50 p-5">
                  <span className="rounded bg-[#f75d34] px-2 py-0.5 text-[10px] font-bold text-white">
                    EXCLUSIVE OFFER
                  </span>
                  <p className="card-title mt-3">Complete 360° Bundle</p>
                  <p className="text-body-muted mt-2">
                    Service History + Background Check + Challan Check
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="text-xl font-bold text-gray-900">₹263</span>
                    <span className="text-caption line-through">₹327</span>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      24% OFF
                    </span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      className="rounded-xl border-2 border-[#f75d34] px-5 py-2 text-sm font-semibold text-[#f75d34]"
                    >
                      More Details
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white"
                    >
                      Buy Bundle Now
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "emi" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="section-title">EMI Calculator</h2>
                <p className="text-body-muted mt-2">
                  Estimate your monthly EMI for this {detail.title}.
                </p>
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="text-label">
                      Loan amount: ₹{loanAmount.toFixed(2)} Lakh
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={Math.max(detail.priceLakh, 5)}
                      step={0.1}
                      value={loanAmount}
                      onChange={(e) => setLoanLakh(parseFloat(e.target.value))}
                      className="mt-2 w-full accent-[#f75d34]"
                    />
                  </div>
                  <div>
                    <p className="text-label mb-2">Duration (years)</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setLoanYears(y)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                            loanYears === y
                              ? "bg-[#f75d34] text-white"
                              : "border border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-caption">
                      Rate of interest @ {detail.emiRate}% for {loanYears} years
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      ₹{emi.toLocaleString("en-IN")}
                      <span className="text-base font-normal text-gray-500"> /mo</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border-2 border-[#f75d34] px-6 py-2.5 text-sm font-semibold text-[#f75d34]"
                  >
                    Interested in Loan
                  </button>
                </div>
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">4.3</span>
                  <div>
                    <p className="card-title">User Reviews & Rating</p>
                    <p className="text-caption">Based on 424 reviews (model family)</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-4">
                  {REVIEW_SAMPLES.map((r) => (
                    <li key={r.name} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-[#f75d34]">
                          {r.name.charAt(0)}
                        </span>
                        <div>
                          <p className="card-title">{r.name}</p>
                          <p className="text-caption">★ {r.rating}/5 · {r.tag}</p>
                        </div>
                      </div>
                      <p className="card-title mt-3">{r.title}</p>
                      <p className="text-body-muted mt-1">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {similar.length > 0 && (
              <section>
                <h2 className="section-title mb-4">Similar Cars</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {similar.map((car) => (
                    <li key={car.id}>
                      <ExploreCarCard car={car} layout="grid" />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      {showInquiry && (
        <BuyerInquiryModal
          listingId={detail.id}
          listingTitle={detail.title}
          onSubmitted={handleInquirySubmitted}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {showSeller && (
        <SellerDetailsModal
          detail={detail}
          recommended={similar}
          whatsappHref={whatsappHref}
          onClose={() => setShowSeller(false)}
        />
      )}
    </main>
  );
}
