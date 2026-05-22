"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    intro:
      "At Old Car Bazar we welcome passionate people who want to make the used car industry simple and transparent. If you want growth, impact and a fast-paced startup culture — this is the right place.",
    apply: "Apply Now",
    notFound: "Didn't find an open role?",
    mailSuffix: "Send your resume to",
    openings: [
      { title: "Senior Frontend Engineer", location: "Ahmedabad / Remote", type: "Full-time", dept: "Engineering" },
      { title: "Product Manager — Marketplace", location: "Ahmedabad", type: "Full-time", dept: "Product" },
      { title: "Customer Support Executive", location: "Ahmedabad", type: "Full-time", dept: "Operations" },
      { title: "Digital Marketing Specialist", location: "Remote", type: "Full-time", dept: "Marketing" },
    ],
  },
  hi: {
    intro:
      "Old Car Bazar पर हम उन जोशीले लोगों का स्वागत करते हैं जो यूज़्ड कार इंडस्ट्री को आसान और पारदर्शी बनाना चाहते हैं। अगर आप ग्रोथ, इम्पैक्ट और तेज़ रफ्तार स्टार्टअप कल्चर चाहते हैं — तो यह सही जगह है।",
    apply: "अभी आवेदन करें",
    notFound: "कोई खुला रोल नहीं मिला?",
    mailSuffix: "अपना रिज़्यूमे यहाँ भेजें",
    openings: [
      { title: "सीनियर फ्रंटएंड इंजीनियर", location: "अहमदाबाद / रिमोट", type: "फुल-टाइम", dept: "इंजीनियरिंग" },
      { title: "प्रोडक्ट मैनेजर — मार्केटप्लेस", location: "अहमदाबाद", type: "फुल-टाइम", dept: "प्रोडक्ट" },
      { title: "कस्टमर सपोर्ट एक्ज़ीक्यूटिव", location: "अहमदाबाद", type: "फुल-टाइम", dept: "ऑपरेशंस" },
      { title: "डिजिटल मार्केटिंग स्पेशलिस्ट", location: "रिमोट", type: "फुल-टाइम", dept: "मार्केटिंग" },
    ],
  },
};

export default function CareersContent() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <div>
      <p className="text-body-muted">{c.intro}</p>
      <ul className="mt-8 space-y-4">
        {c.openings.map((job) => (
          <li
            key={job.title}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between hover:border-[#f75d34]/30 hover:shadow-md"
          >
            <div>
              <span className="text-xs font-bold uppercase text-[#f75d34]">{job.dept}</span>
              <h3 className="mt-1 font-bold text-gray-900">{job.title}</h3>
              <p className="mt-1 text-caption sm:text-sm">
                {job.location} · {job.type}
              </p>
            </div>
            <a
              href="mailto:careers@oldcarbazar.com"
              className="shrink-0 rounded-full border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white"
            >
              {c.apply}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-caption sm:text-sm">
        {c.notFound} {c.mailSuffix}{" "}
        <a href="mailto:careers@oldcarbazar.com" className="font-semibold text-[#f75d34]">
          careers@oldcarbazar.com
        </a>
        .
      </p>
    </div>
  );
}
