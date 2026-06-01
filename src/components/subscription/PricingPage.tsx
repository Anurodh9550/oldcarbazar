"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { ApiError, api, type ApiPlan } from "@/lib/api";
import AuthModal from "@/components/AuthModal";

function formatPrice(plan: ApiPlan): string {
  if (plan.price_inr === 0) return "Free";
  return `₹${plan.price_inr.toLocaleString("en-IN")}`;
}

function formatDuration(plan: ApiPlan): string {
  if (plan.duration_days <= 0) return "forever";
  if (plan.duration_days >= 365) return "/year";
  if (plan.duration_days >= 28) return "/month";
  return `/${plan.duration_days} days`;
}

export default function PricingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { status, refresh } = useSubscription();
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await api.listPlans();
        if (!cancelled) setPlans(next);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load plans.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpgrade = async (plan: ApiPlan) => {
    if (plan.code === "free") return;
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    setError("");
    setSuccess("");
    setActivating(plan.code);
    try {
      await api.activateSubscription(plan.code);
      await refresh();
      setSuccess(`${plan.name} plan activated! You can now post more cars.`);
      setTimeout(() => router.push("/my-listings"), 1500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setError(
          "Payments aren't open yet. Tell our team to enable the gateway and try again."
        );
      } else {
        setError(err instanceof Error ? err.message : "Activation failed.");
      }
    } finally {
      setActivating(null);
    }
  };

  return (
    <main className="bg-[#f7f7f7]">
      <section className="bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#0f0f0f] px-4 pb-16 pt-12 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-block rounded-full border border-[#f75d34]/40 bg-[#f75d34]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#ffb59a] uppercase">
            Seller Plans
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Simple, honest pricing
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-300">
            Post up to <span className="font-semibold text-white">3 cars free</span>{" "}
            for life. Upgrade to <span className="font-semibold text-[#f75d34]">Pro</span>{" "}
            when you need more.
          </p>

          {status && (
            <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
              <span className="h-2 w-2 rounded-full bg-[#f75d34]" />
              You&apos;re on{" "}
              <span className="font-semibold text-white">{status.plan_name}</span>{" "}
              · {status.listings_used}
              {status.is_unlimited ? "" : `/${status.listings_limit}`} listings used
            </div>
          )}
        </div>
      </section>

      <section className="-mt-10 px-4 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow">
              Loading plans...
            </div>
          )}
          {!loading &&
            plans.map((plan) => {
              const isCurrent = status?.plan === plan.code;
              const isFree = plan.code === "free";
              const isPopular = plan.code === "pro";
              return (
                <article
                  key={plan.code}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition ${
                    isPopular
                      ? "border-[#f75d34] shadow-xl ring-2 ring-[#f75d34]/20"
                      : "border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#f75d34] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {formatPrice(plan)}
                    </span>
                    {plan.price_inr > 0 && (
                      <span className="text-sm text-gray-500">
                        {formatDuration(plan)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {plan.listing_limit === null
                      ? "Unlimited listings"
                      : `Up to ${plan.listing_limit} active listings`}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5 text-sm text-gray-700">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#f75d34]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                          <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrent ? (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-500"
                      >
                        Current plan
                      </button>
                    ) : isFree ? (
                      <button
                        type="button"
                        onClick={() => router.push("/post-ad")}
                        className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-[#f75d34] hover:text-[#f75d34]"
                      >
                        Start free
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpgrade(plan)}
                        disabled={activating === plan.code}
                        className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold shadow transition ${
                          isPopular
                            ? "bg-[#f75d34] text-white hover:bg-[#e54d24]"
                            : "border border-[#f75d34] text-[#f75d34] hover:bg-orange-50"
                        } ${activating === plan.code ? "opacity-60" : ""}`}
                      >
                        {activating === plan.code
                          ? "Activating..."
                          : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
        </div>

        {(error || success) && (
          <div className="mx-auto mt-6 max-w-2xl text-center">
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            )}
          </div>
        )}

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 text-sm text-gray-600 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">FAQ</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-semibold text-gray-800">
                What counts toward my limit?
              </dt>
              <dd className="mt-1">
                Active and draft listings count. Once you mark a car as{" "}
                <span className="font-medium">Sold</span> it stops counting, so
                you can immediately list another.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">
                Can I cancel anytime?
              </dt>
              <dd className="mt-1">
                Yes. After cancellation you keep Pro until the end of the paid
                period, then automatically fall back to the Free plan.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-800">
                How does payment work?
              </dt>
              <dd className="mt-1">
                We&apos;re wiring up Razorpay (UPI, cards, net banking). Until
                then, our support team can activate Pro for you manually after
                payment confirmation.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
