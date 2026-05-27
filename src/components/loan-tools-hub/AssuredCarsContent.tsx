"use client";

import Image from "next/image";
import Link from "next/link";
import { sampleAssuredCars } from "@/data/loanToolsPages";
import { useLoanToolsContent } from "@/hooks/useLoanToolsContent";

export default function AssuredCarsContent() {
  const { assuredFeatures } = useLoanToolsContent();
  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title-lg">Why Choose Assured?</h2>
            <p className="mt-1 text-body-muted">
              Premium hand-picked used cars with thorough inspection &amp;
              warranty
            </p>
          </div>
          <Link
            href="/used-cars"
            className="text-sm font-semibold text-[#f75d34] hover:underline"
          >
            View all cars →
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assuredFeatures.map((f) => (
            <li
              key={f.title}
              className="rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50/40 to-white p-5"
            >
              <span className="text-2xl" aria-hidden>
                {f.icon}
              </span>
              <p className="mt-2 font-semibold text-gray-900">{f.title}</p>
              <p className="mt-1 text-body-muted">{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-title-lg">Featured Assured Cars</h2>
        <p className="mt-1 text-body-muted">
          Inspected, warranty-backed, ready for handover
        </p>
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sampleAssuredCars.map((car) => (
            <li
              key={car.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <Image
                  src={car.image}
                  alt={car.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#f75d34] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  ✓ Assured
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{car.title}</h3>
                <p className="mt-0.5 text-caption">{car.specs}</p>
                <p className="mt-3 text-lg font-bold text-[#f75d34]">{car.price}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                    {car.inspection}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                    {car.warranty} warranty
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-caption">📍 {car.city}</span>
                  <Link
                    href="/used-cars"
                    className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] hover:bg-orange-100"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 rounded-2xl bg-[#0f172a] p-6 text-white sm:grid-cols-3 sm:p-8">
        <div className="sm:col-span-2">
          <p className="eyebrow-dark">How It Works</p>
          <h3 className="mt-3 text-xl font-bold sm:text-2xl">
            From shortlist to handover in 3 steps
          </h3>
          <ol className="mt-5 space-y-3">
            {[
              { n: "1", t: "Browse & shortlist", d: "Pick from inspected, warranty-backed cars." },
              { n: "2", t: "Book a test drive", d: "Free home test drive in your city." },
              { n: "3", t: "Pay & drive home", d: "Transparent paperwork, RC transfer included." },
            ].map((s) => (
              <li key={s.n} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f75d34] text-xs font-bold">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold">{s.t}</p>
                  <p className="text-sm text-slate-300">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col justify-center rounded-xl bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Need help?
          </p>
          <p className="mt-2 text-lg font-bold">Talk to our expert</p>
          <p className="mt-1 text-sm text-slate-300">
            Mon–Sun, 9 AM – 9 PM
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full bg-[#f75d34] px-4 py-2 text-center text-sm font-semibold hover:bg-[#e54d24]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
