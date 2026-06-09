"use client";

import { useEffect, useMemo, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import {
  addUserReview,
  getCombinedRating,
  getUserReviews,
  REVIEWS_CHANGED_EVENT,
  type UserReview,
} from "@/lib/carReviews";
import { REVIEW_SAMPLES } from "@/lib/carDetail";

const SEED_AVERAGE = 4.3;
const SEED_COUNT = 424;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CarReviewsSection({ carId }: { carId: string }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setReviews(getUserReviews(carId));
    const refresh = () => setReviews(getUserReviews(carId));
    window.addEventListener(REVIEWS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, refresh);
  }, [carId]);

  const combined = useMemo(
    () => getCombinedRating(reviews, SEED_AVERAGE, SEED_COUNT),
    [reviews]
  );

  const submit = () => {
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (!text.trim()) {
      setError("Please write a short review.");
      return;
    }
    addUserReview(carId, { name, rating, title, text });
    setRating(0);
    setName("");
    setTitle("");
    setText("");
    setError("");
    setFormOpen(false);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {combined.average.toFixed(1)}
          </span>
          <div>
            <StarRating value={combined.average} size={16} />
            <p className="mt-0.5 text-caption">
              Based on {combined.count.toLocaleString("en-IN")} reviews
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
        >
          {formOpen ? "Cancel" : "★ Rate this car"}
        </button>
      </div>

      {formOpen && (
        <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <p className="text-sm font-semibold text-gray-900">Your rating</p>
          <StarRating
            value={rating}
            onChange={(v) => {
              setRating(v);
              setError("");
            }}
            size={30}
            className="mt-2"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title (optional)"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
            />
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            placeholder="Share your experience with this car…"
            rows={3}
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#f75d34]"
          />

          {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

          <button
            type="button"
            onClick={submit}
            className="mt-3 rounded-lg bg-[#f75d34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54d24]"
          >
            Submit review
          </button>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-orange-100 bg-orange-50/30 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f75d34]/10 font-bold text-[#f75d34]">
                {r.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1">
                <p className="card-title flex items-center gap-2">
                  {r.name}
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Your review
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size={13} />
                  <span className="text-caption">{timeAgo(r.createdAt)}</span>
                </div>
              </div>
            </div>
            {r.title && <p className="card-title mt-3">{r.title}</p>}
            {r.text && <p className="text-body-muted mt-1">{r.text}</p>}
          </li>
        ))}

        {REVIEW_SAMPLES.map((r) => (
          <li key={r.name} className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-[#f75d34]">
                {r.name.charAt(0)}
              </span>
              <div>
                <p className="card-title">{r.name}</p>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size={13} />
                  <span className="text-caption">{r.tag}</span>
                </div>
              </div>
            </div>
            <p className="card-title mt-3">{r.title}</p>
            <p className="text-body-muted mt-1">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
