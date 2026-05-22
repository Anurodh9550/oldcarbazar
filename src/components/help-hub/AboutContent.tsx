"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    missionTitle: "Our Mission",
    missionP1:
      "Old Car Bazar is India's trusted used car marketplace where buyers and sellers connect directly without any middleman. We believe buying or selling a car should be simple, transparent and safe.",
    missionP2:
      "Since 2024 we have been providing thousands of listings, free seller tools and city-wise search — so you can get the best deal in your city.",
    stats: [
      { n: "10,000+", l: "Car Listings" },
      { n: "12+", l: "Cities" },
      { n: "50K+", l: "Monthly Users" },
      { n: "100%", l: "Free to List" },
    ],
    whyTitle: "Why Old Car Bazar?",
    whyItems: [
      "Direct buyer-seller contact",
      "Free listing for sellers",
      "City & budget smart search",
      "Verified dealer network",
      "RC & insurance guides",
      "Dedicated seller dashboard",
    ],
  },
  hi: {
    missionTitle: "हमारा मिशन",
    missionP1:
      "Old Car Bazar भारत का भरोसेमंद यूज़्ड कार मार्केटप्लेस है जहाँ खरीदार और विक्रेता बिना किसी बिचौलिए के सीधे जुड़ते हैं। हमारा मानना है कि कार खरीदना या बेचना सरल, पारदर्शी और सुरक्षित होना चाहिए।",
    missionP2:
      "2024 से हम हज़ारों लिस्टिंग, मुफ्त सेलर टूल्स और शहर-अनुसार खोज दे रहे हैं — ताकि आपको अपने शहर में सबसे अच्छी डील मिले।",
    stats: [
      { n: "10,000+", l: "कार लिस्टिंग" },
      { n: "12+", l: "शहर" },
      { n: "50K+", l: "मासिक यूज़र्स" },
      { n: "100%", l: "मुफ्त लिस्टिंग" },
    ],
    whyTitle: "Old Car Bazar क्यों?",
    whyItems: [
      "खरीदार-विक्रेता के बीच सीधा संपर्क",
      "विक्रेताओं के लिए मुफ्त लिस्टिंग",
      "शहर और बजट के अनुसार स्मार्ट सर्च",
      "वेरिफाइड डीलर नेटवर्क",
      "RC और इंश्योरेंस गाइड",
      "खास सेलर डैशबोर्ड",
    ],
  },
};

export default function AboutContent() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <div className="prose prose-gray max-w-none">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{c.missionTitle}</h2>
          <p className="mt-3 text-body-muted">{c.missionP1}</p>
          <p className="mt-3 text-body-muted">{c.missionP2}</p>
        </div>
        <ul className="grid grid-cols-2 gap-4">
          {c.stats.map((s) => (
            <li key={s.l} className="rounded-xl bg-slate-900 p-5 text-center text-white">
              <p className="text-2xl font-bold text-[#f75d34]">{s.n}</p>
              <p className="mt-1 text-xs text-slate-300">{s.l}</p>
            </li>
          ))}
        </ul>
      </div>
      <section className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <h2 className="section-title">{c.whyTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.whyItems.map((item) => (
            <li key={item} className="flex gap-2 text-body-muted">
              <span className="text-[#f75d34]">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
