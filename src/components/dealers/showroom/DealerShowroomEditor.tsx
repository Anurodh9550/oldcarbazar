"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSellerIdFromUser } from "@/context/ListingsContext";
import {
  addReview,
  addTeamMember,
  fetchMyDealerShowroom,
  getShowroomOrDefault,
  persistMyDealerShowroom,
  removeReview,
  removeTeamMember,
  SHOWROOM_CHANGED_EVENT,
} from "@/lib/dealerShowroom";
import type { DealerShowroom } from "@/types/dealerShowroom";
import { fieldClass } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ShowroomImageUpload from "@/components/dealers/showroom/ShowroomImageUpload";
import ShowroomGalleryEditor from "@/components/dealers/showroom/ShowroomGalleryEditor";

type Tab = "brand" | "about" | "gallery" | "team" | "reviews";

export default function DealerShowroomEditor() {
  const { user, isLoggedIn } = useAuth();
  const [tab, setTab] = useState<Tab>("brand");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<DealerShowroom | null>(null);

  const dealerKey = user?.id ?? (user ? getSellerIdFromUser(user) : "");

  useEffect(() => {
    if (!dealerKey || !user) return;
    let cancelled = false;
    (async () => {
      const data = await fetchMyDealerShowroom(
        dealerKey,
        user.name || "My Dealership"
      );
      if (!cancelled) setForm(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [dealerKey, user]);

  useEffect(() => {
    const onChange = () => {
      if (!dealerKey || !user) return;
      setForm(getShowroomOrDefault(dealerKey, user.name || "My Dealership"));
    };
    window.addEventListener(SHOWROOM_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(SHOWROOM_CHANGED_EVENT, onChange);
  }, [dealerKey, user]);

  if (!isLoggedIn || !user) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-sm text-gray-600">Log in to build your Showroom.</p>
        <Link href="/seller" className="mt-4 inline-block text-sm font-semibold text-[#f75d34]">
          Go to seller dashboard →
        </Link>
      </div>
    );
  }

  if (!form) return null;

  const update = (patch: Partial<DealerShowroom>) =>
    setForm((f) => (f ? { ...f, ...patch } : f));

  const handleSave = async () => {
    const saved = await persistMyDealerShowroom({
      ...form,
      dealerId: form.dealerId || dealerKey,
    });
    setForm(saved);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const previewHref = `/dealers/${form.dealerId || dealerKey}/showroom`;

  const tabs: { id: Tab; label: string }[] = [
    { id: "brand", label: "Banner & Logo" },
    { id: "about", label: "About" },
    { id: "gallery", label: "More Cars" },
    { id: "team", label: "Team" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#f75d34]">
            Showroom
          </p>
          <p className="mt-1 section-title">Build your mini website</p>
          <p className="text-body-muted">
            Banner, logo, about, team, cars & reviews — like your own dealer site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={previewHref}
            target="_blank"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-[#f75d34]"
          >
            Preview showroom
          </Link>
          <Button type="button" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "border-b-2 border-[#f75d34] text-[#f75d34]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card-surface p-6 sm:p-8">
        {tab === "brand" && (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Public dealer profile ID
              </span>
              <input
                className={fieldClass}
                value={form.dealerId}
                onChange={(e) => update({ dealerId: e.target.value.trim() })}
                placeholder="e.g. 12 — find on /dealers page URL"
              />
              <span className="mt-1 block text-xs text-gray-500">
                Your public URL is /dealers/[id]/showroom — use your account UUID from the dealers page.
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Dealership name
              </span>
              <input
                className={fieldClass}
                value={form.dealerName}
                onChange={(e) => update({ dealerName: e.target.value })}
              />
            </label>
            <ShowroomImageUpload
              label="Banner image"
              variant="banner"
              value={form.bannerUrl}
              onChange={(bannerUrl) => update({ bannerUrl })}
              hint="Wide image works best (1920×600 recommended). Upload or paste a link."
            />
            <ShowroomImageUpload
              label="Logo"
              variant="logo"
              value={form.logoUrl}
              onChange={(logoUrl) => update({ logoUrl })}
              hint="Square or round logo — shown on your public showroom."
            />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Tagline</span>
              <input
                className={fieldClass}
                value={form.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => update({ enabled: e.target.checked })}
                className="rounded border-gray-300 text-[#f75d34]"
              />
              Publish showroom (visible to buyers)
            </label>
          </div>
        )}

        {tab === "about" && (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">About us</span>
              <textarea
                className={`${fieldClass} min-h-[140px] resize-y`}
                value={form.about}
                onChange={(e) => update({ about: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Address</span>
              <input
                className={fieldClass}
                value={form.address ?? ""}
                onChange={(e) => update({ address: e.target.value })}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Phone</span>
                <input
                  className={fieldClass}
                  value={form.phone ?? user.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">WhatsApp</span>
                <input
                  className={fieldClass}
                  value={form.whatsapp ?? user.phone}
                  onChange={(e) => update({ whatsapp: e.target.value })}
                />
              </label>
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <ShowroomGalleryEditor
            gallery={form.gallery ?? []}
            onChange={(gallery) => update({ gallery })}
            onPersist={async () => {
              const saved = await persistMyDealerShowroom({
                ...form,
                dealerId: form.dealerId || dealerKey,
              });
              setForm(saved);
            }}
          />
        )}

        {tab === "team" && (
          <TeamEditor
            dealerId={form.dealerId || dealerKey}
            team={form.team}
            onChange={(team) => update({ team })}
            onPersist={async () => {
              const saved = await persistMyDealerShowroom({
                ...form,
                dealerId: form.dealerId || dealerKey,
              });
              setForm(saved);
            }}
          />
        )}

        {tab === "reviews" && (
          <ReviewsEditor
            dealerId={form.dealerId || dealerKey}
            reviews={form.reviews}
            onChange={(reviews) => update({ reviews })}
            onPersist={async () => {
              const saved = await persistMyDealerShowroom({
                ...form,
                dealerId: form.dealerId || dealerKey,
              });
              setForm(saved);
            }}
          />
        )}
      </div>
    </div>
  );
}

function TeamEditor({
  dealerId,
  team,
  onChange,
  onPersist,
}: {
  dealerId: string;
  team: DealerShowroom["team"];
  onChange: (team: DealerShowroom["team"]) => void;
  onPersist: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");

  const add = () => {
    if (!name.trim()) return;
    onPersist();
    const m = addTeamMember(dealerId, { name, role, bio });
    if (m) onChange([...team, m]);
    setName("");
    setRole("");
    setBio("");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={fieldClass}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Role (e.g. Sales Manager)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className={`${fieldClass} sm:col-span-2`}
          placeholder="Short bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add team member
      </Button>
      <ul className="divide-y divide-gray-100">
        {team.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-gray-900">{m.name}</p>
              <p className="text-sm text-[#f75d34]">{m.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                removeTeamMember(dealerId, m.id);
                onChange(team.filter((t) => t.id !== m.id));
              }}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewsEditor({
  dealerId,
  reviews,
  onChange,
  onPersist,
}: {
  dealerId: string;
  reviews: DealerShowroom["reviews"];
  onChange: (reviews: DealerShowroom["reviews"]) => void;
  onPersist: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const add = () => {
    if (!author.trim() || !text.trim()) return;
    onPersist();
    const r = addReview(dealerId, {
      author,
      text,
      rating,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
    if (r) onChange([r, ...reviews]);
    setAuthor("");
    setText("");
    setRating(5);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={fieldClass}
          placeholder="Customer name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <select
          className={fieldClass}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
        <textarea
          className={`${fieldClass} min-h-[80px] sm:col-span-2`}
          placeholder="Review text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add review
      </Button>
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{r.author}</p>
                <p className="text-amber-500 text-sm">{"★".repeat(r.rating)}</p>
                <p className="mt-1 text-sm text-gray-600">{r.text}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  removeReview(dealerId, r.id);
                  onChange(reviews.filter((x) => x.id !== r.id));
                }}
                className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
