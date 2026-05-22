"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    heroTitle: "Building India's Trusted Used Car Marketplace",
    heroSubtitle:
      "Backed by strong fundamentals — high engagement, low CAC and a growing dealer network.",
    irLabel: "Investor relations:",
    stats: [
      { n: "10K+", l: "Active Listings" },
      { n: "50K+", l: "Monthly Buyers" },
      { n: "30+", l: "Cities" },
      { n: "₹50Cr+", l: "GMV (Annualised)" },
    ],
    highlights: [
      { title: "Mission", body: "To become India's largest direct-owner used car marketplace — connecting buyers and sellers without any middleman." },
      { title: "Market Opportunity", body: "India's used car market is projected to cross $70B by 2027. Online penetration is only 18% — massive growth headroom." },
      { title: "Revenue Model", body: "Premium listings, dealer subscriptions, partner integrations (insurance, RC services) and targeted ads." },
      { title: "Leadership", body: "Experienced team from automotive, marketplace and fintech backgrounds — passionate about transparent transactions." },
    ],
  },
  hi: {
    heroTitle: "भारत का भरोसेमंद यूज़्ड कार मार्केटप्लेस बना रहे हैं",
    heroSubtitle:
      "मज़बूत बुनियाद के साथ — हाई एंगेजमेंट, कम CAC और बढ़ता डीलर नेटवर्क।",
    irLabel: "इन्वेस्टर रिलेशंस:",
    stats: [
      { n: "10K+", l: "सक्रिय लिस्टिंग" },
      { n: "50K+", l: "मासिक खरीदार" },
      { n: "30+", l: "शहर" },
      { n: "₹50 करोड़+", l: "GMV (वार्षिक)" },
    ],
    highlights: [
      { title: "मिशन", body: "भारत का सबसे बड़ा डायरेक्ट-ओनर यूज़्ड कार मार्केटप्लेस बनना — बिना किसी बिचौलिए के खरीदार और विक्रेता को जोड़ना।" },
      { title: "बाज़ार का अवसर", body: "भारत का यूज़्ड कार बाज़ार 2027 तक $70B+ अनुमानित है। ऑनलाइन पहुँच केवल 18% — विशाल ग्रोथ संभावना।" },
      { title: "रेवेन्यू मॉडल", body: "प्रीमियम लिस्टिंग, डीलर सब्सक्रिप्शन, पार्टनर इंटीग्रेशन (इंश्योरेंस, RC सेवाएँ) और टार्गेटेड विज्ञापन।" },
      { title: "नेतृत्व", body: "ऑटोमोटिव, मार्केटप्लेस और फिनटेक बैकग्राउंड वाली अनुभवी टीम — पारदर्शी लेन-देन के लिए जुनूनी।" },
    ],
  },
};

export default function InvestorsContent() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold">{c.heroTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{c.heroSubtitle}</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.stats.map((s) => (
            <li key={s.l} className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-xl font-bold text-[#f75d34]">{s.n}</p>
              <p className="mt-1 text-xs text-slate-300">{s.l}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        {c.highlights.map((h) => (
          <section key={h.title} className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">{h.title}</h3>
            <p className="mt-2 text-body-muted">{h.body}</p>
          </section>
        ))}
      </div>
      <p className="rounded-xl bg-orange-50 p-4 text-sm text-gray-700">
        {c.irLabel} <span className="font-semibold text-[#f75d34]">investors@oldcarbazar.in</span>
      </p>
    </div>
  );
}
