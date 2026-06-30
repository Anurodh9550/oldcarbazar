"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ListingPhotoUpload from "@/components/seller/ListingPhotoUpload";
import {
  addGarageVehicle,
  GARAGE_CHANGED_EVENT,
  getGarageReminders,
  getGarageVehicles,
  removeGarageVehicle,
  updateGarageVehicle,
} from "@/lib/digitalGarage";
import type { GarageVehicle } from "@/types/digitalGarage";
import { carBrands } from "@/data/sellCarForm";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20";

const MAX_GARAGE_PHOTOS = 10;

const emptyForm = {
  make: "",
  model: "",
  year: String(new Date().getFullYear()),
  regNumber: "",
  purchaseDate: "",
  insuranceExpiry: "",
  serviceDueDate: "",
  odometerKm: "",
  rcNotes: "",
  notes: "",
  photos: [] as string[],
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function GarageVehicleCard({
  vehicle,
  onEdit,
  onRemove,
}: {
  vehicle: GarageVehicle;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const photos = vehicle.photos ?? [];
  const [activePhoto, setActivePhoto] = useState(0);
  const cover = photos[activePhoto];

  return (
    <li className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-white/80">
            <span className="text-5xl">🚗</span>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider">
              Add photos
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-lg font-bold text-white drop-shadow">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h4>
          <p className="text-xs text-white/90">
            {vehicle.regNumber || "No RC entered"}
            {vehicle.odometerKm > 0 &&
              ` · ${vehicle.odometerKm.toLocaleString("en-IN")} km`}
          </p>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 shadow">
          Digital Garage
        </span>
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => setActivePhoto(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === activePhoto ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-gray-50 px-3 py-2 scrollbar-hide">
          {photos.map((src, i) => (
            <button
              key={`${i}-${src.slice(0, 24)}`}
              type="button"
              onClick={() => setActivePhoto(i)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === activePhoto
                  ? "border-[#f75d34] ring-2 ring-[#f75d34]/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-gray-500">Purchased</dt>
            <dd className="font-medium text-gray-900">
              {formatDate(vehicle.purchaseDate)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Insurance</dt>
            <dd className="font-medium text-gray-900">
              {formatDate(vehicle.insuranceExpiry)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Service due</dt>
            <dd className="font-medium text-gray-900">
              {formatDate(vehicle.serviceDueDate)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Photos</dt>
            <dd className="font-medium text-gray-900">{photos.length}</dd>
          </div>
        </dl>
        {vehicle.rcNotes && (
          <p className="mt-2 text-xs text-gray-600">
            <span className="font-semibold">RC:</span> {vehicle.rcNotes}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
          >
            Edit & photos
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
          <Link
            href="/rc-guide"
            className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            RC guide
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function MyGarageContent() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");

  const refresh = () => setVehicles(getGarageVehicles());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(GARAGE_CHANGED_EVENT, handler);
    return () => window.removeEventListener(GARAGE_CHANGED_EVENT, handler);
  }, []);

  const reminders = useMemo(() => getGarageReminders(vehicles), [vehicles]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
    setPhotoError("");
  };

  const startEdit = (v: GarageVehicle) => {
    setEditingId(v.id);
    setForm({
      make: v.make,
      model: v.model,
      year: String(v.year),
      regNumber: v.regNumber,
      purchaseDate: v.purchaseDate,
      insuranceExpiry: v.insuranceExpiry,
      serviceDueDate: v.serviceDueDate,
      odometerKm: v.odometerKm ? String(v.odometerKm) : "",
      rcNotes: v.rcNotes,
      notes: v.notes,
      photos: v.photos ?? [],
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.make.trim() || !form.model.trim()) {
      setError("Make and model are required.");
      return;
    }
    const payload = {
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      regNumber: form.regNumber.trim().toUpperCase(),
      purchaseDate: form.purchaseDate,
      insuranceExpiry: form.insuranceExpiry,
      serviceDueDate: form.serviceDueDate,
      odometerKm: Number(form.odometerKm) || 0,
      rcNotes: form.rcNotes.trim(),
      notes: form.notes.trim(),
      photos: form.photos,
    };
    if (editingId) {
      updateGarageVehicle(editingId, payload);
    } else {
      addGarageVehicle(payload);
    }
    resetForm();
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-orange-50/40 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          OCB Digital Garage
        </p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">
          Your cars — photos, RC & reminders
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Add car photos, track insurance renewal, service schedules and RC notes
          for every vehicle you own after buying on Old Car Bazar.
        </p>
        {user && (
          <p className="mt-2 text-xs text-gray-500">
            Signed in as <span className="font-semibold">{user.name}</span>
          </p>
        )}
      </div>

      {reminders.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="text-sm font-bold text-amber-900">Upcoming reminders</h3>
          <ul className="mt-3 space-y-2">
            {reminders.map((r) => (
              <li
                key={`${r.vehicleId}-${r.type}`}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm ${
                  r.urgent ? "bg-red-100 text-red-900" : "bg-white text-gray-800"
                }`}
              >
                <span>{r.label}</span>
                <span className="font-semibold">
                  {r.daysLeft < 0
                    ? "Overdue"
                    : r.daysLeft === 0
                      ? "Due today"
                      : `In ${r.daysLeft} days`}
                  {" · "}
                  {formatDate(r.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-gray-900">
          My vehicles ({vehicles.length})
        </h3>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-full bg-[#f75d34] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#e54d24]"
        >
          + Add vehicle
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30 p-5 shadow-sm sm:p-6"
        >
          <div>
            <h4 className="font-bold text-gray-900">
              {editingId ? "Edit vehicle" : "Add to Digital Garage"}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Upload clear photos first — they appear as a gallery on your garage card.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <ListingPhotoUpload
              photos={form.photos}
              onChange={(photos) => setForm((f) => ({ ...f, photos }))}
              onError={setPhotoError}
              optional
              maxPhotos={MAX_GARAGE_PHOTOS}
              label={`Car photos (up to ${MAX_GARAGE_PHOTOS})`}
              hint="Exterior, interior, dashboard & odometer. First photo is the cover image."
            />
            {photoError && (
              <p className="mt-2 text-xs text-red-600">{photoError}</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Make *
              </span>
              <select
                value={form.make}
                onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select</option>
                {carBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Model *
              </span>
              <input
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Creta"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Year
              </span>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Registration no.
              </span>
              <input
                value={form.regNumber}
                onChange={(e) => setForm((f) => ({ ...f, regNumber: e.target.value }))}
                className={inputClass}
                placeholder="GJ01AB1234"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Purchase date
              </span>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, purchaseDate: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Odometer (km)
              </span>
              <input
                type="number"
                value={form.odometerKm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, odometerKm: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Insurance expiry
              </span>
              <input
                type="date"
                value={form.insuranceExpiry}
                onChange={(e) =>
                  setForm((f) => ({ ...f, insuranceExpiry: e.target.value }))
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-gray-600">
                Next service due
              </span>
              <input
                type="date"
                value={form.serviceDueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serviceDueDate: e.target.value }))
                }
                className={inputClass}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-semibold text-gray-600">
              RC / document notes
            </span>
            <textarea
              rows={2}
              value={form.rcNotes}
              onChange={(e) => setForm((f) => ({ ...f, rcNotes: e.target.value }))}
              className={inputClass}
              placeholder="RC location, hypothecation status, NOC pending…"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-semibold text-gray-600">
              Notes
            </span>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className={inputClass}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
            >
              {editingId ? "Save changes" : "Save to garage"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white py-14 text-center">
          <span className="text-5xl">🏠</span>
          <p className="mt-3 font-semibold text-gray-800">Your garage is empty</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Add a vehicle with photos to build your personal car gallery — plus
            insurance and service tracking.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 inline-block rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white"
          >
            + Add first vehicle
          </button>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {vehicles.map((v) => (
            <GarageVehicleCard
              key={v.id}
              vehicle={v}
              onEdit={() => startEdit(v)}
              onRemove={() => {
                if (confirm("Remove this vehicle from your garage?")) {
                  removeGarageVehicle(v.id);
                  refresh();
                }
              }}
            />
          ))}
        </ul>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/my-showroom"
          className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 text-sm hover:border-[#f75d34]"
        >
          <span className="text-lg">🏪</span>
          <p className="mt-1 font-bold text-gray-900">Showroom</p>
          <p className="text-xs text-gray-500">Banner, about & dealer page</p>
        </Link>
        <Link
          href="/insurance"
          className="rounded-xl border border-gray-200 bg-white p-4 text-sm hover:border-[#f75d34]"
        >
          <span className="text-lg">🛡</span>
          <p className="mt-1 font-bold text-gray-900">Insurance</p>
          <p className="text-xs text-gray-500">Renew or compare quotes</p>
        </Link>
        <Link
          href="/history-report"
          className="rounded-xl border border-gray-200 bg-white p-4 text-sm hover:border-[#f75d34]"
        >
          <span className="text-lg">📋</span>
          <p className="mt-1 font-bold text-gray-900">History report</p>
          <p className="text-xs text-gray-500">RC, challan & ownership</p>
        </Link>
      </div>
    </div>
  );
}
