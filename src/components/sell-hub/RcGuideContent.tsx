import Link from "next/link";
import { rcTransferSteps } from "@/data/sellHubPages";

export default function RcGuideContent() {
  return (
    <div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>Important:</strong> RC transfer within 14 days of sale is mandatory under
        Motor Vehicles Act. Both buyer and seller must complete RTO formalities.
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {rcTransferSteps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
          >
            <span className="text-2xl font-bold text-[#f75d34]">0{i + 1}</span>
            <h3 className="mt-3 font-bold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-body-muted">{step.desc}</p>
          </li>
        ))}
      </ul>
      <section className="mt-10">
        <h3 className="font-bold text-gray-900">Documents Required</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            "Original RC (Registration Certificate)",
            "Form 29 & 30 (signed)",
            "Insurance copy",
            "PUC certificate",
            "Seller & buyer ID proof",
            "Address proof",
            "NOC (if loan cleared)",
          ].map((doc) => (
            <li key={doc} className="flex gap-2 text-body-muted">
              <span className="text-[#f75d34]">•</span>
              {doc}
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8 text-center">
        <Link
          href="/dealers"
          className="text-sm font-semibold text-[#f75d34] hover:underline"
        >
          Find dealers who assist with RC transfer →
        </Link>
      </div>
    </div>
  );
}
