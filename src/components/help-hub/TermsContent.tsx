"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    intro:
      "Last updated: May 2026. These terms form a legal agreement between you and Old Car Bazar.",
    footer: "Questions?",
    footerLink: "Contact us",
    footerSuffix: "for clarification.",
    sections: [
      { title: "Acceptance of Terms", body: "By using Old Car Bazar you accept these Terms & Conditions. If you do not agree, please do not use the platform." },
      { title: "Listing & Content", body: "Sellers are responsible for providing accurate car details, photos and pricing. Misleading or fake listings may be removed." },
      { title: "Buyer Responsibilities", body: "Buyers must inspect the car and verify documents before purchase. The platform is only a medium for connection." },
      { title: "Prohibited Activities", body: "Fraud, fake ads, spam, abusive content or any illegal activity will lead to account suspension." },
      { title: "Liability", body: "Old Car Bazar is not directly involved in buyer-seller transactions. Disputes must be resolved between the parties." },
      { title: "Changes to Terms", body: "We may update these terms at any time. Users will be notified of major changes." },
    ],
  },
  hi: {
    intro:
      "अंतिम अपडेट: मई 2026। ये शर्तें आपके और Old Car Bazar के बीच एक कानूनी समझौता हैं।",
    footer: "कोई सवाल है?",
    footerLink: "हमसे संपर्क करें",
    footerSuffix: "स्पष्टीकरण के लिए।",
    sections: [
      { title: "शर्तों की स्वीकृति", body: "Old Car Bazar का उपयोग करके आप इन नियम और शर्तों को स्वीकार करते हैं। यदि आप सहमत नहीं हैं, तो कृपया प्लेटफ़ॉर्म का उपयोग न करें।" },
      { title: "लिस्टिंग और कंटेंट", body: "सटीक कार डिटेल्स, फोटो और कीमत देने की ज़िम्मेदारी विक्रेता की है। भ्रामक या फर्जी लिस्टिंग हटाई जा सकती हैं।" },
      { title: "खरीदार की ज़िम्मेदारी", body: "कार खरीदने से पहले स्वयं निरीक्षण करना और दस्तावेज़ों की जाँच करना खरीदार की ज़िम्मेदारी है। प्लेटफ़ॉर्म केवल एक माध्यम है।" },
      { title: "निषिद्ध गतिविधियाँ", body: "धोखाधड़ी, फर्जी विज्ञापन, स्पैम, अपमानजनक कंटेंट या किसी भी अवैध गतिविधि पर अकाउंट सस्पेंड किया जा सकता है।" },
      { title: "दायित्व", body: "Old Car Bazar खरीदार-विक्रेता लेन-देन में सीधे शामिल नहीं होता। विवाद पार्टियों के बीच सुलझाने होते हैं।" },
      { title: "नियमों में बदलाव", body: "हम कभी भी नियम अपडेट कर सकते हैं। बड़े बदलावों के बारे में यूज़र्स को सूचित किया जाएगा।" },
    ],
  },
};

export default function TermsContent() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <div className="space-y-6">
      <p className="text-body-muted">{c.intro}</p>
      {c.sections.map((s) => (
        <section key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">{s.title}</h2>
          <p className="mt-2 text-body-muted">{s.body}</p>
        </section>
      ))}
      <p className="rounded-xl bg-orange-50 p-4 text-sm text-gray-700">
        {c.footer}{" "}
        <a href="/contact" className="font-semibold text-[#f75d34]">
          {c.footerLink}
        </a>{" "}
        {c.footerSuffix}
      </p>
    </div>
  );
}
