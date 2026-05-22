"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  en: {
    intro:
      "Old Car Bazar's corporate policies — transparent, fair and compliant. They are reviewed regularly.",
    grievance: "Grievance Officer:",
    policies: [
      { title: "Anti-Fraud Policy", body: "Zero tolerance against fake listings, scam buyers or identity misuse. Action within 24 hours on reported suspicious activity." },
      { title: "Content Policy", body: "Only genuine car listings are allowed. Obscene, hateful or copyrighted content will be removed." },
      { title: "Refund Policy", body: "Refunds on paid services are eligible if requested within 7 days — subject to terms." },
      { title: "Dealer Code of Conduct", body: "Partner dealers must maintain transparency, fair pricing and prompt responses. Violations may result in dealership suspension." },
      { title: "Grievance Redressal", body: "Complaints are responded to within 48 working hours — a dedicated grievance officer is available for escalation." },
      { title: "Compliance", body: "We operate as per the IT Act 2000, the Consumer Protection Act 2019 and other applicable Indian laws." },
    ],
  },
  hi: {
    intro:
      "Old Car Bazar की कॉर्पोरेट नीतियाँ — पारदर्शी, निष्पक्ष और अनुपालन के अनुसार। इनकी नियमित समीक्षा की जाती है।",
    grievance: "शिकायत अधिकारी:",
    policies: [
      { title: "एंटी-फ्रॉड नीति", body: "फर्जी लिस्टिंग, धोखेबाज़ खरीदार या पहचान के दुरुपयोग के विरुद्ध शून्य सहनशीलता। संदिग्ध गतिविधि की रिपोर्ट पर 24 घंटे में कार्रवाई।" },
      { title: "कंटेंट नीति", body: "केवल असली कार लिस्टिंग की अनुमति है। अश्लील, घृणित या कॉपीराइट कंटेंट हटाया जाएगा।" },
      { title: "रिफंड नीति", body: "पेड सेवाओं पर 7 दिनों के भीतर अनुरोध करने पर रिफंड पात्र — नियमों के अधीन।" },
      { title: "डीलर आचार संहिता", body: "पार्टनर डीलरों को पारदर्शिता, उचित कीमत और त्वरित प्रतिक्रिया बनाए रखनी चाहिए। उल्लंघन पर डीलरशिप सस्पेंड हो सकती है।" },
      { title: "शिकायत निवारण", body: "शिकायतों का जवाब 48 कार्य घंटों में — एस्केलेशन के लिए समर्पित शिकायत अधिकारी उपलब्ध।" },
      { title: "अनुपालन", body: "हम IT अधिनियम 2000, उपभोक्ता संरक्षण अधिनियम 2019 और लागू भारतीय कानूनों के अनुसार संचालन करते हैं।" },
    ],
  },
};

export default function PoliciesContent() {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <div className="space-y-6">
      <p className="text-body-muted">{c.intro}</p>
      {c.policies.map((p) => (
        <section key={p.title} className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">{p.title}</h2>
          <p className="mt-2 text-body-muted">{p.body}</p>
        </section>
      ))}
      <p className="rounded-xl bg-orange-50 p-4 text-sm text-gray-700">
        {c.grievance} <span className="font-semibold">grievance@oldcarbazar.in</span>
      </p>
    </div>
  );
}
