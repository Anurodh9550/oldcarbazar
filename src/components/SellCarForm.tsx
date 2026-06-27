"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { ApiError, type SubscriptionStatus } from "@/lib/api";
import UpgradeRequiredModal from "@/components/subscription/UpgradeRequiredModal";
import { cities } from "@/data/locations";
import {
  carBrands,
  carYears,
  fuelTypes,
  initialSellForm,
  insuranceOptions,
  ownerOptions,
  registrationMonths,
  seatOptions,
  sellBodyTypes,
  sellColors,
  sellFeatureOptions,
  sellSteps,
  transmissionTypes,
  type SellCarFormData,
} from "@/data/sellCarForm";
import { fieldClass } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ListingPhotoUpload from "@/components/seller/ListingPhotoUpload";
import ListingVideoUpload from "@/components/seller/ListingVideoUpload";
import TruthDeclarationForm from "@/components/seller/TruthDeclarationForm";
import { isTruthDeclarationComplete } from "@/data/truthDeclaration";
import LocationModal from "@/components/LocationModal";
import Spinner from "@/components/ui/Spinner";
import { validatePhotoCount } from "@/lib/listingPhotos";
import { PinIcon } from "@/components/icons";

const TOTAL_STEPS = sellSteps.length;

const inputClass = fieldClass;

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

type SellCarFormProps = {
  defaultContact?: {
    sellerName: string;
    phone: string;
    email: string;
  };
  embedded?: boolean;
  mode?: "create" | "edit";
  /** Required when `mode === "edit"`. */
  listingId?: string;
  /** Pre-fills the form (used by the edit flow). */
  initialData?: SellCarFormData;
  /** Existing photo URLs (used by the edit flow). */
  initialPhotos?: string[];
  /** Optional override for where to navigate after a successful submit. */
  successRedirect?: string;
};

export default function SellCarForm({
  defaultContact,
  embedded,
  mode = "create",
  listingId,
  initialData,
  initialPhotos,
  successRedirect,
}: SellCarFormProps) {
  const router = useRouter();
  const { user, isLoggedIn, promoteToSeller } = useAuth();
  const { addListing, updateListing } = useListings();
  const { status: subscriptionStatus, refresh: refreshSubscription } =
    useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradePayload, setUpgradePayload] = useState<SubscriptionStatus | null>(
    null
  );
  const isEdit = mode === "edit";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SellCarFormData>(() => ({
    ...initialSellForm,
    sellerName: defaultContact?.sellerName ?? "",
    phone: defaultContact?.phone ?? "",
    email: defaultContact?.email ?? "",
    ...(initialData ?? {}),
  }));
  const [photos, setPhotos] = useState<string[]>(() => initialPhotos ?? []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const update = (field: keyof SellCarFormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  };

  const toggleFeature = (feature: string) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(feature)
        ? f.features.filter((x) => x !== feature)
        : [...f.features, feature],
    }));
    setError("");
  };

  const validateStep = (s: number): string => {
    if (s === 1) {
      if (!form.brand || !form.model || !form.year)
        return "Brand, model and year are required.";
      if (!form.bodyType) return "Select body type (buyers filter by this).";
      if (!form.color) return "Select car color.";
      if (!form.fuel || !form.transmission)
        return "Fuel type and transmission are required.";
      if (!form.kms || Number(form.kms) < 100)
        return "Enter valid kilometers driven.";
      if (!form.sellerName.trim()) return "Your name is required.";
      if (!form.phone || form.phone.length < 10)
        return "Enter valid 10-digit mobile number.";
      return "";
    }
    if (s === 2) {
      if (!form.price || Number(form.price) <= 0)
        return "Enter expected price in Lakhs.";
      if (!form.city) return "Select your city.";
      if (!form.insurance)
        return "Select insurance status (shown in Overview).";
      if (form.description.trim().length < 20)
        return "Write at least 20 characters in description (Seller's Note).";
      const photoErr = validatePhotoCount(photos.length);
      if (photoErr) return photoErr;
      return "";
    }
    return "";
  };

  const next = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (submitting) return;
    for (let s = 1; s <= TOTAL_STEPS - 1; s++) {
      const err = validateStep(s);
      if (err) {
        setError(err);
        setStep(s);
        return;
      }
    }

    if (!isLoggedIn) {
      setError(
        isEdit
          ? "Please log in again to save your changes."
          : "Please log in again to publish your listing."
      );
      return;
    }

    if (isEdit && !listingId) {
      setError("Missing listing id — refresh and try again.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (isEdit && listingId) {
        await updateListing(listingId, form, photos);
      } else {
        await addListing(form, photos);
        if (user) {
          promoteToSeller((user.email || user.phone).trim().toLowerCase());
        } else {
          promoteToSeller((form.email || form.phone).trim().toLowerCase());
        }
      }
      setSuccess(true);
      setTimeout(
        () => router.push(successRedirect ?? "/my-listings"),
        isEdit ? 1200 : 2000
      );
    } catch (err) {
      // Quota exhausted → backend returns 402 with a `subscription`
      // payload. Pop the upgrade modal and refresh the cached quota
      // so the rest of the UI reflects the limit immediately.
      if (
        err instanceof ApiError &&
        err.status === 402 &&
        typeof err.data === "object" &&
        err.data !== null
      ) {
        const data = err.data as {
          code?: string;
          subscription?: SubscriptionStatus;
        };
        if (data.code === "subscription_required") {
          setUpgradePayload(data.subscription ?? subscriptionStatus);
          setUpgradeOpen(true);
          refreshSubscription();
          setSubmitting(false);
          return;
        }
      }
      const message =
        err instanceof Error
          ? err.message
          : isEdit
            ? "Could not save changes. Please try again."
            : "Could not publish listing. Please try again.";
      setError(
        message.includes("Authentication") || message.includes("credentials")
          ? "Session expired. Log out, log in again, then try again."
          : message
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center"
      >
        <p className="text-4xl">✓</p>
        <h2 className="mt-3 text-xl font-bold text-gray-900">
          {isEdit ? "Changes Saved!" : "Listing Published!"}
        </h2>
        <p className="mt-2 text-gray-600">
          {isEdit
            ? "Your listing has been updated. Redirecting to your listings…"
            : "Your car is now live on Old Car Bazar. Redirecting to your listings…"}
        </p>
        <Link
          href="/my-listings"
          className="mt-4 inline-block text-sm font-semibold text-[#f75d34] hover:underline"
        >
          Go to My Listings now
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={
        embedded ? "" : "rounded-2xl border border-gray-200 bg-white shadow-lg"
      }
    >
      <UpgradeRequiredModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        status={upgradePayload}
      />
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:gap-2">
          {sellSteps.map((s) => (
            <div
              key={s.id}
              className={`flex min-w-[96px] flex-1 flex-col items-center rounded-lg px-2 py-2 text-center sm:min-w-0 ${
                step === s.id
                  ? "bg-[#f75d34]/10 text-[#f75d34]"
                  : step > s.id
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              <span className="text-xs font-bold">{s.id}</span>
              <span className="hidden text-[11px] font-semibold sm:block">
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-sm font-medium text-gray-700 sm:hidden">
          Step {step}: {sellSteps[step - 1].title}
        </p>
        <p className="mt-1 text-center text-caption text-gray-500">
          {sellSteps[step - 1].desc}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < TOTAL_STEPS) next();
          else submit();
        }}
        className="p-4 sm:p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <p className="rounded-lg bg-[#f75d34]/5 px-3 py-2 text-caption text-gray-600">
                  Your car&apos;s specs and contact info — buyers will see these on the Overview tab.
                </p>

                <div>
                  <h3 className="mb-3 text-sm font-bold text-gray-900">Car Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Brand *</span>
                      <select
                        required
                        value={form.brand}
                        onChange={(e) => update("brand", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select brand</option>
                        {carBrands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Model *</span>
                      <input
                        required
                        value={form.model}
                        onChange={(e) => update("model", e.target.value)}
                        placeholder="e.g. Swift, Creta"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Year *</span>
                      <select
                        required
                        value={form.year}
                        onChange={(e) => update("year", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select year</option>
                        {carYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Variant</span>
                      <input
                        value={form.variant}
                        onChange={(e) => update("variant", e.target.value)}
                        placeholder="e.g. VDI, ZX"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Body Type *</span>
                      <select
                        required
                        value={form.bodyType}
                        onChange={(e) => update("bodyType", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select body type</option>
                        {sellBodyTypes.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Color *</span>
                      <select
                        required
                        value={form.color}
                        onChange={(e) => update("color", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select color</option>
                        {sellColors.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Fuel *</span>
                      <select
                        required
                        value={form.fuel}
                        onChange={(e) => update("fuel", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select</option>
                        {fuelTypes.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Transmission *</span>
                      <select
                        required
                        value={form.transmission}
                        onChange={(e) => update("transmission", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select</option>
                        {transmissionTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>KMs Driven *</span>
                      <input
                        required
                        type="number"
                        value={form.kms}
                        onChange={(e) => update("kms", e.target.value)}
                        placeholder="e.g. 45000"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>No. of Owners *</span>
                      <select
                        value={form.owners}
                        onChange={(e) => update("owners", e.target.value)}
                        className={inputClass}
                      >
                        {ownerOptions.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Seats *</span>
                      <select
                        value={form.seats}
                        onChange={(e) => update("seats", e.target.value)}
                        className={inputClass}
                      >
                        {seatOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Registration Month</span>
                      <select
                        value={form.registrationMonth}
                        onChange={(e) =>
                          update("registrationMonth", e.target.value)
                        }
                        className={inputClass}
                      >
                        {registrationMonths.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Engine (cc) — optional</span>
                      <input
                        value={form.engineCc}
                        onChange={(e) => update("engineCc", e.target.value)}
                        placeholder="e.g. 1199 cc"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Mileage — optional</span>
                      <input
                        value={form.mileage}
                        onChange={(e) => update("mileage", e.target.value)}
                        placeholder="e.g. 18.5 kmpl"
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-gray-900">
                    Your Contact
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>Your Name *</span>
                      <input
                        required
                        value={form.sellerName}
                        onChange={(e) => update("sellerName", e.target.value)}
                        placeholder="Full name"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Mobile Number *</span>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) =>
                          update(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        placeholder="10-digit number"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Email (optional)</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </label>
                    <label className="flex items-center gap-2 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.checked)}
                        className="accent-[#f75d34]"
                      />
                      <WhatsAppIcon size={20} />
                      <span className="text-sm text-gray-700">
                        Buyers can contact me on WhatsApp
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <p className="rounded-lg bg-[#f75d34]/5 px-3 py-2 text-caption text-gray-600">
                  Price, location, photos & features — everything a buyer sees in search and on the detail page.
                </p>

                <div>
                  <h3 className="mb-3 text-sm font-bold text-gray-900">
                    Price & Location
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>
                        Expected Price (in Lakhs) *
                      </span>
                      <input
                        required
                        type="number"
                        step="0.1"
                        value={form.price}
                        onChange={(e) => update("price", e.target.value)}
                        placeholder="e.g. 5.5"
                        className={inputClass}
                      />
                      <p className="mt-1 text-caption">
                        Example: 5.5 = ₹5.5 Lakh
                      </p>
                    </label>
                    <label className="block">
                      <span className={labelClass}>City (RTO) *</span>
                      <button
                        type="button"
                        onClick={() => setCityModalOpen(true)}
                        className={`${inputClass} flex items-center justify-between text-left ${
                          form.city ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <PinIcon className="h-4 w-4 shrink-0 text-[#f75d34]" />
                          {form.city
                            ? cities.find((c) => c.name === form.city)
                              ? `${form.city}, ${cities.find((c) => c.name === form.city)!.state}`
                              : form.city
                            : "Select city or detect location"}
                        </span>
                        <span className="text-xs font-semibold text-[#f75d34]">
                          {form.city ? "Change" : "Choose"}
                        </span>
                      </button>
                      <p className="mt-1 text-caption">
                        Search your city or detect it via GPS.
                      </p>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>Area / Locality</span>
                      <input
                        value={form.area}
                        onChange={(e) => update("area", e.target.value)}
                        placeholder="e.g. Satellite, Andheri West"
                        className={inputClass}
                      />
                      <p className="mt-1 text-caption">
                        Buyers will see this area on the listing card.
                      </p>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>Registration No.</span>
                      <input
                        value={form.regNumber}
                        onChange={(e) =>
                          update("regNumber", e.target.value.toUpperCase())
                        }
                        placeholder="e.g. GJ01AB1234"
                        className={inputClass}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className={labelClass}>Insurance *</span>
                      <select
                        required
                        value={form.insurance}
                        onChange={(e) => update("insurance", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select insurance status</option>
                        {insuranceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-gray-900">
                    Photos
                  </h3>
                  <ListingPhotoUpload
                    photos={photos}
                    onChange={(nextPhotos) => {
                      setPhotos(nextPhotos);
                      setError("");
                    }}
                    onError={(msg) => setError(msg ?? "")}
                  />
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-gray-900">
                    Car Features (Specs tab)
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {sellFeatureOptions.map((feat) => (
                      <label
                        key={feat}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          form.features.includes(feat)
                            ? "border-[#f75d34] bg-[#f75d34]/5 text-gray-900"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.features.includes(feat)}
                          onChange={() => toggleFeature(feat)}
                          className="accent-[#f75d34]"
                        />
                        {feat}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-gray-900">
                      Seller&apos;s Note / Description *
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Condition, service history, accidents, new tyres, reason for selling — shown in the buyer's Overview."
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  This step is <span className="font-semibold">optional</span>.
                  You can continue without the declaration or video — add them
                  later from My Listings.
                </p>
                <TruthDeclarationForm
                  value={form.truthDeclaration}
                  onChange={(truthDeclaration) => {
                    setForm((f) => ({ ...f, truthDeclaration }));
                    setError("");
                  }}
                />
                <ListingVideoUpload
                  videoUrl={form.videoUrl}
                  onChange={(videoUrl) => update("videoUrl", videoUrl)}
                  onError={(msg) => (msg ? setError(msg) : setError(""))}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 rounded-xl bg-gray-50 p-4 text-sm">
                <h3 className="font-bold text-gray-900">Review your listing</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p>
                    <span className="text-gray-500">Car:</span> {form.year}{" "}
                    {form.brand} {form.model} {form.variant}
                  </p>
                  <p>
                    <span className="text-gray-500">Body:</span> {form.bodyType}{" "}
                    •{" "}
                    {sellColors.find((c) => c.id === form.color)?.label}
                  </p>
                  <p>
                    <span className="text-gray-500">Price:</span> ₹{form.price}{" "}
                    Lakh
                  </p>
                  <p>
                    <span className="text-gray-500">KMs:</span> {form.kms} •{" "}
                    {form.owners}
                  </p>
                  <p>
                    <span className="text-gray-500">City:</span> {form.city}
                    {form.area ? `, ${form.area}` : ""}
                  </p>
                  <p>
                    <span className="text-gray-500">Fuel:</span> {form.fuel} •{" "}
                    {form.transmission} •{" "}
                    {seatOptions.find((s) => s.value === form.seats)?.label}
                  </p>
                  <p>
                    <span className="text-gray-500">Insurance:</span>{" "}
                    {insuranceOptions.find((i) => i.value === form.insurance)
                      ?.label ?? "—"}
                  </p>
                  <p>
                    <span className="text-gray-500">Features:</span>{" "}
                    {form.features.length || "Default"} selected
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Contact:</span>{" "}
                    {form.sellerName} — {form.phone}
                    {form.whatsapp ? " (WhatsApp)" : ""}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Photos:</span>{" "}
                    {photos.length} uploaded
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Honest Car Declaration:</span>{" "}
                    {isTruthDeclarationComplete(form.truthDeclaration)
                      ? "✓ Confirmed"
                      : "Skipped (optional)"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500">Video proof:</span>{" "}
                    {form.videoUrl ? "✓ Uploaded (optional)" : "Not added"}
                  </p>
                  {photos[0] && (
                    <div className="sm:col-span-2 flex gap-2 overflow-x-auto pb-1">
                      {photos.slice(0, 4).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="h-16 w-24 shrink-0 rounded-lg object-cover"
                        />
                      ))}
                      {photos.length > 4 && (
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs font-bold text-gray-600">
                          +{photos.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={back}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" disabled={submitting} className="min-w-[140px]">
            {submitting && <Spinner size="sm" tone="white" />}
            {submitting
              ? isEdit
                ? "Saving…"
                : "Publishing…"
              : step < TOTAL_STEPS
                ? "Continue"
                : isEdit
                  ? "Save Changes"
                  : "Publish Listing"}
          </Button>
        </div>
      </form>

      <LocationModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={(city) => {
          update("city", city);
        }}
        currentValue={form.city}
        mode="all-india"
        title="Where is your car?"
        subtitle="Any Indian city — search or detect via GPS."
      />
    </motion.div>
  );
}
