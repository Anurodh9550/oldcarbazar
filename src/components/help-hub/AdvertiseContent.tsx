export default function AdvertiseContent() {
  const plans = [
    {
      tier: "Starter",
      price: "₹4,999",
      period: "/month",
      perks: ["Featured listings (5)", "City-level targeting", "Basic analytics"],
    },
    {
      tier: "Growth",
      price: "₹14,999",
      period: "/month",
      perks: [
        "Featured listings (25)",
        "Banner placements",
        "Brand-level targeting",
        "Priority support",
      ],
      highlight: true,
    },
    {
      tier: "Enterprise",
      price: "Custom",
      period: "",
      perks: [
        "Unlimited listings",
        "Homepage takeover",
        "Custom integrations",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold">Reach 50,000+ Used Car Buyers Every Month</h2>
        <p className="mt-2 text-sm text-slate-300">
          Targeted advertising for dealers, OEMs, insurance partners and service brands. Pay only for
          quality leads — with city, budget and brand level targeting.
        </p>
        <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
          {["Featured Listings", "Homepage Banners", "Sponsored Search"].map((f) => (
            <li key={f} className="rounded-xl bg-white/5 p-3 text-center font-semibold">
              {f}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="section-title">Ad Plans</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.tier}
              className={`rounded-2xl border p-6 ${
                p.highlight
                  ? "border-[#f75d34] bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {p.highlight ? (
                <p className="text-xs font-bold uppercase tracking-wide text-[#f75d34]">
                  Most Popular
                </p>
              ) : null}
              <h4 className="mt-1 text-lg font-bold text-gray-900">{p.tier}</h4>
              <p className="mt-2">
                <span className="text-2xl font-bold text-gray-900">{p.price}</span>
                <span className="text-sm text-body-muted">{p.period}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-[#f75d34]">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-gray-100 bg-white p-6">
        <h3 className="text-lg font-bold text-gray-900">Get Started</h3>
        <p className="mt-2 text-body-muted">
          Our ads team will share a personalised plan and estimated reach with you. Reach out:
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Email: <span className="font-semibold">ads@oldcarbazar.in</span> · Phone:{" "}
          <span className="font-semibold">+91 98765 43210</span>
        </p>
      </section>
    </div>
  );
}
