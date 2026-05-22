"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    intro:
      "Last updated: May 2026. Your privacy matters to us. This policy explains how we handle your personal information.",
    footer: "Privacy concern? Email",
    sections: [
      { title: "Information We Collect", body: "Name, email, phone number, city and car listing details — only what you provide. We also collect cookies and device info for analytics." },
      { title: "How We Use Data", body: "Your info is used to show listings, connect buyers & sellers, provide support and improve the platform." },
      { title: "Sharing With Third Parties", body: "We do not sell your data. We share it only with service providers (hosting, SMS, analytics) under strict confidentiality." },
      { title: "Cookies & Tracking", body: "We use cookies for a better experience. You can manage them via your browser settings." },
      { title: "Data Security", body: "We use industry-standard encryption and secure servers. Still, the internet is not 100% safe — please use strong passwords." },
      { title: "Your Rights", body: "You can request access, update or deletion of your data. Reach us via the contact form or email." },
    ],
  },
  hi: {
    intro:
      "अंतिम अपडेट: मई 2026। आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि हम आपकी व्यक्तिगत जानकारी को कैसे संभालते हैं।",
    footer: "गोपनीयता से जुड़ी कोई चिंता? ईमेल करें",
    sections: [
      { title: "हम कौन-सी जानकारी एकत्र करते हैं", body: "नाम, ईमेल, फ़ोन नंबर, शहर और कार लिस्टिंग की जानकारी — केवल वही जो आप स्वयं देते हैं। एनालिटिक्स के लिए कुकीज़ और डिवाइस जानकारी भी एकत्र करते हैं।" },
      { title: "हम डेटा का उपयोग कैसे करते हैं", body: "आपकी जानकारी का उपयोग लिस्टिंग दिखाने, खरीदार-विक्रेता को जोड़ने, सहायता देने और प्लेटफ़ॉर्म सुधारने के लिए होता है।" },
      { title: "तीसरे पक्ष के साथ साझा करना", body: "हम आपका डेटा नहीं बेचते। केवल सेवा प्रदाताओं (होस्टिंग, SMS, एनालिटिक्स) के साथ कड़ी गोपनीयता के तहत साझा करते हैं।" },
      { title: "कुकीज़ और ट्रैकिंग", body: "बेहतर अनुभव के लिए कुकीज़ का उपयोग होता है। ब्राउज़र सेटिंग्स से आप इन्हें मैनेज कर सकते हैं।" },
      { title: "डेटा सुरक्षा", body: "हम इंडस्ट्री-स्टैंडर्ड एन्क्रिप्शन और सुरक्षित सर्वर का उपयोग करते हैं। फिर भी इंटरनेट 100% सुरक्षित नहीं — मज़बूत पासवर्ड का उपयोग करें।" },
      { title: "आपके अधिकार", body: "आप अपने डेटा को एक्सेस, अपडेट या डिलीट करने का अनुरोध कर सकते हैं। संपर्क फ़ॉर्म या ईमेल के ज़रिये हमसे जुड़ें।" },
    ],
  },
};

export default function PrivacyContent() {
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
        {c.footer} <span className="font-semibold text-[#f75d34]">privacy@oldcarbazar.in</span>
      </p>
    </div>
  );
}
