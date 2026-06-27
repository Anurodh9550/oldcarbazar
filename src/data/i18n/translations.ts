import type { FeatureIconName } from "@/components/ui/FeatureIcon";

export type Language = "en" | "hi";

type QuickAction = {
  title: string;
  desc: string;
  href: string;
  icon: FeatureIconName;
};

type WhyItem = {
  title: string;
  desc: string;
  icon: FeatureIconName;
};

type StepItem = {
  step: string;
  title: string;
  desc: string;
};

export type SiteCopy = {
  nav: {
    buy: string;
    buyShort: string;
    sell: string;
    sellShort: string;
    loan: string;
    loanShort: string;
    help: string;
    searchPlaceholder: string;
    searchPlaceholderMobile: string;
    sellCar: string;
    sellShortMobile: string;
    login: string;
    savedCars: string;
    searchCars: string;
  };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    lead: string;
    yourCity: string;
    browseCars: string;
    searchPlaceholder: string;
    anyBudget: string;
    searchCars: string;
    searchCarsSr: string;
    budgetSr: string;
    popular: string;
  };
  budgetOptions: { label: string; value: string }[];
  quickLinks: { label: string; query: string }[];
  trustStrip: { value: string; label: string }[];
  quickActions: QuickAction[];
  whyChoose: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: WhyItem[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buyersTitle: string;
    sellersTitle: string;
    buySteps: StepItem[];
    sellSteps: StepItem[];
  };
  sellBanner: {
    title: string;
    subtitle: string;
    sellFree: string;
    valuation: string;
  };
  listings: {
    eyebrow: string;
    title: string;
  };
  whatsapp: {
    widgetLabel: string;
    widgetTitle: string;
    pageBadge: string;
    pageTitle: string;
    pageSubtitle: string;
    sellTitle: string;
    sellDesc: string;
    sellBtn: string;
    buyTitle: string;
    buyDesc: string;
    buyBtn: string;
    loanTitle: string;
    loanDesc: string;
    loanBtn: string;
    helpTitle: string;
    helpDesc: string;
    helpBtn: string;
    howTitle: string;
    steps: string[];
    note: string;
    navLabel: string;
  };
};

const budgetValues = ["", "under-2", "3-5", "5-10", "10-15"] as const;

export const siteCopy: Record<Language, SiteCopy> = {
  en: {
    nav: {
      buy: "BUY USED CARS",
      buyShort: "BUY",
      sell: "SELL CAR",
      sellShort: "SELL",
      loan: "LOAN & TOOLS",
      loanShort: "LOAN",
      help: "HELP",
      searchPlaceholder: "Search used cars — Swift, Creta, Maruti...",
      searchPlaceholderMobile: "Search used cars...",
      sellCar: "Sell Car",
      sellShortMobile: "Sell",
      login: "Login",
      savedCars: "Saved cars",
      searchCars: "Search cars",
    },
    hero: {
      eyebrow: "India's direct-owner used car marketplace",
      titleBefore: "Find your perfect",
      titleHighlight: "used car",
      titleAfter: "today",
      lead: "Search thousands of verified listings, compare prices, and contact sellers directly in {city}.",
      yourCity: "your city",
      browseCars: "Browse used cars",
      searchPlaceholder: "Search Swift, Creta, Harrier…",
      anyBudget: "Any Budget",
      searchCars: "Search cars",
      searchCarsSr: "Search cars",
      budgetSr: "Budget",
      popular: "Popular",
    },
    budgetOptions: [
      { label: "Any Budget", value: budgetValues[0] },
      { label: "Under ₹2 Lakh", value: budgetValues[1] },
      { label: "₹2 - ₹5 Lakh", value: budgetValues[2] },
      { label: "₹5 - ₹10 Lakh", value: budgetValues[3] },
      { label: "Above ₹10 Lakh", value: budgetValues[4] },
    ],
    quickLinks: [
      { label: "Swift", query: "q=swift" },
      { label: "Creta", query: "q=creta" },
      { label: "Thar", query: "q=thar" },
      { label: "City", query: "q=city" },
    ],
    trustStrip: [
      { value: "10K+", label: "Live listings" },
      { value: "Direct", label: "Owner contact" },
      { value: "30+", label: "Loan partners" },
      { value: "4.8★", label: "Seller rating" },
    ],
    quickActions: [
      {
        title: "Buy Used Cars",
        desc: "Browse verified listings",
        href: "/used-cars",
        icon: "car",
      },
      {
        title: "Sell Your Car",
        desc: "Post your ad in 2 minutes",
        href: "/sell-car",
        icon: "sell",
      },
      {
        title: "Sell on WhatsApp",
        desc: "List your car via chat",
        href: "/whatsapp-sell",
        icon: "user",
      },
      {
        title: "Multi-Bank Loan",
        desc: "One form, many banks",
        href: "/loan-marketplace",
        icon: "bank",
      },
    ],
    whyChoose: {
      eyebrow: "Why Old Car Bazar",
      title: "Built for trust, speed and transparency",
      subtitle:
        "Everything you need to buy or sell a used car — without the hassle of brokers or hidden fees.",
      items: [
        {
          title: "Verified Listings",
          desc: "Every car is reviewed before it goes live on the marketplace.",
          icon: "shield",
        },
        {
          title: "Direct Owner Deals",
          desc: "Speak to sellers directly — no hidden broker commissions.",
          icon: "user",
        },
        {
          title: "Free to Sell",
          desc: "List your car at zero cost and reach buyers across India.",
          icon: "free",
        },
        {
          title: "City-wise Search",
          desc: "Find cars in Ahmedabad, Mumbai, Delhi and 12+ major cities.",
          icon: "map",
        },
      ],
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Buy or sell in three simple steps",
      subtitle:
        "Whether you're looking for your next car or selling one you own, Old Car Bazar keeps the process straightforward.",
      buyersTitle: "For Buyers",
      sellersTitle: "For Sellers",
      buySteps: [
        {
          step: "1",
          title: "Search & Filter",
          desc: "Find cars by city, budget, brand or fuel type.",
        },
        {
          step: "2",
          title: "Compare & Chat",
          desc: "Compare models and chat with sellers on WhatsApp.",
        },
        {
          step: "3",
          title: "Inspect & Buy",
          desc: "Meet seller, test drive and close the deal.",
        },
      ],
      sellSteps: [
        {
          step: "1",
          title: "Post Your Ad",
          desc: "Add photos, price and car details in minutes.",
        },
        {
          step: "2",
          title: "Get Enquiries",
          desc: "Buyers contact you directly via chat or call.",
        },
        {
          step: "3",
          title: "Sell & Transfer",
          desc: "Finalize deal and complete RC transfer.",
        },
      ],
    },
    sellBanner: {
      title: "Want to sell your old car?",
      subtitle:
        "Post a free ad, get instant valuation, and connect with genuine buyers in your city.",
      sellFree: "Sell Car Free",
      valuation: "Get Valuation",
    },
    listings: {
      eyebrow: "Featured Listings",
      title: "{count}+ used cars for sale from ₹45,000 in {city}",
    },
    whatsapp: {
      widgetLabel: "WhatsApp",
      widgetTitle: "Chat on WhatsApp",
      pageBadge: "WhatsApp Concierge",
      pageTitle: "Buy or sell cars on WhatsApp",
      pageSubtitle:
        "No app needed — message us in Hindi or English. Our team helps you list, search, or apply for a loan.",
      sellTitle: "Sell your car",
      sellDesc: "Share photos, model, year, kms and your asking price. We help publish your ad.",
      sellBtn: "Start selling on WhatsApp",
      buyTitle: "Find a used car",
      buyDesc: "Tell us your city, budget and preferred brand. We send matching listings.",
      buyBtn: "Search via WhatsApp",
      loanTitle: "Car loan help",
      loanDesc: "One message to check eligibility across partner banks.",
      loanBtn: "Ask about loans",
      helpTitle: "Talk to support",
      helpDesc: "Questions about listings, RC transfer, or safety? Chat with our team.",
      helpBtn: "Message support",
      howTitle: "How it works",
      steps: [
        "Tap a button above — WhatsApp opens with a ready message.",
        "Send car photos and details (for sellers) or your budget and city (for buyers).",
        "Our team replies within business hours and guides you step by step.",
      ],
      note: "Tip: Type SELL, BUY, or LOAN anytime to restart.",
      navLabel: "Sell via WhatsApp",
    },
  },
  hi: {
    nav: {
      buy: "पुरानी कार खरीदें",
      buyShort: "खरीदें",
      sell: "कार बेचें",
      sellShort: "बेचें",
      loan: "लोन और टूल्स",
      loanShort: "लोन",
      help: "मदद",
      searchPlaceholder: "कार खोजें — Swift, Creta, Maruti...",
      searchPlaceholderMobile: "पुरानी कार खोजें...",
      sellCar: "कार बेचें",
      sellShortMobile: "बेचें",
      login: "लॉगिन",
      savedCars: "पसंदीदा कारें",
      searchCars: "कार खोजें",
    },
    hero: {
      eyebrow: "भारत का डायरेक्ट ओनर यूज़्ड कार मार्केटप्लेस",
      titleBefore: "आज ही अपनी",
      titleHighlight: "पसंदीदा कार",
      titleAfter: "खोजें",
      lead: "हज़ारों verified लिस्टिंग देखें, कीमत compare करें और {city} में sellers से सीधे बात करें।",
      yourCity: "अपने शहर",
      browseCars: "पुरानी कारें देखें",
      searchPlaceholder: "Swift, Creta, Harrier खोजें…",
      anyBudget: "कोई भी बजट",
      searchCars: "कार खोजें",
      searchCarsSr: "कार खोजें",
      budgetSr: "बजट",
      popular: "लोकप्रिय",
    },
    budgetOptions: [
      { label: "कोई भी बजट", value: budgetValues[0] },
      { label: "₹2 लाख से कम", value: budgetValues[1] },
      { label: "₹2 - ₹5 लाख", value: budgetValues[2] },
      { label: "₹5 - ₹10 लाख", value: budgetValues[3] },
      { label: "₹10 लाख से ऊपर", value: budgetValues[4] },
    ],
    quickLinks: [
      { label: "Swift", query: "q=swift" },
      { label: "Creta", query: "q=creta" },
      { label: "Thar", query: "q=thar" },
      { label: "City", query: "q=city" },
    ],
    trustStrip: [
      { value: "10K+", label: "लाइव लिस्टिंग" },
      { value: "Direct", label: "ओनर से सीधा संपर्क" },
      { value: "30+", label: "लोन पार्टनर" },
      { value: "4.8★", label: "सेलर रेटिंग" },
    ],
    quickActions: [
      {
        title: "पुरानी कार खरीदें",
        desc: "Verified लिस्टिंग देखें",
        href: "/used-cars",
        icon: "car",
      },
      {
        title: "अपनी कार बेचें",
        desc: "2 मिनट में ad पोस्ट करें",
        href: "/sell-car",
        icon: "sell",
      },
      {
        title: "WhatsApp पर बेचें",
        desc: "चैट से लिस्टिंग बनाएं",
        href: "/whatsapp-sell",
        icon: "user",
      },
      {
        title: "मल्टी-बैंक लोन",
        desc: "एक फॉर्म, कई बैंक",
        href: "/loan-marketplace",
        icon: "bank",
      },
    ],
    whyChoose: {
      eyebrow: "Old Car Bazar क्यों",
      title: "भरोसे, स्पीड और पारदर्शिता के लिए बना",
      subtitle:
        "पुरानी कार खरीदने या बेचने की पूरी सुविधा — बिना दलाल और छुपे चार्ज के।",
      items: [
        {
          title: "Verified लिस्टिंग",
          desc: "हर कार लाइव होने से पहले review होती है।",
          icon: "shield",
        },
        {
          title: "डायरेक्ट ओनर डील",
          desc: "Seller से सीधे बात करें — कोई broker commission नहीं।",
          icon: "user",
        },
        {
          title: "मुफ़्त में बेचें",
          desc: "बिना पैसे के ad लगाएं और पूरे भारत में buyers तक पहुँचें।",
          icon: "free",
        },
        {
          title: "शहर के हिसाब से खोज",
          desc: "Ahmedabad, Mumbai, Delhi और 12+ शहरों में कारें खोजें।",
          icon: "map",
        },
      ],
    },
    howItWorks: {
      eyebrow: "कैसे काम करता है",
      title: "तीन आसान स्टेप में खरीदें या बेचें",
      subtitle:
        "चाहे नई कार खोज रहे हों या अपनी कार बेचना हो — Old Car Bazar प्रोसेस आसान रखता है।",
      buyersTitle: "खरीदारों के लिए",
      sellersTitle: "विक्रेताओं के लिए",
      buySteps: [
        {
          step: "1",
          title: "खोजें और फ़िल्टर करें",
          desc: "शहर, बजट, ब्रांड या fuel type से कार खोजें।",
        },
        {
          step: "2",
          title: "Compare और Chat",
          desc: "मॉडल compare करें और WhatsApp पर seller से बात करें।",
        },
        {
          step: "3",
          title: "देखें और खरीदें",
          desc: "Seller से मिलें, test drive लें और deal पक्की करें।",
        },
      ],
      sellSteps: [
        {
          step: "1",
          title: "Ad पोस्ट करें",
          desc: "फोटो, कीमत और car details कुछ मिनट में जोड़ें।",
        },
        {
          step: "2",
          title: "Enquiry पाएं",
          desc: "Buyers सीधे chat या call पर संपर्क करेंगे।",
        },
        {
          step: "3",
          title: "बेचें और Transfer",
          desc: "Deal finalize करें और RC transfer पूरा करें।",
        },
      ],
    },
    sellBanner: {
      title: "अपनी पुरानी कार बेचना चाहते हैं?",
      subtitle:
        "मुफ़्त ad लगाएं, तुरंत valuation पाएं और अपने शहर के genuine buyers से जुड़ें।",
      sellFree: "मुफ़्त में कार बेचें",
      valuation: "Valuation लें",
    },
    listings: {
      eyebrow: "Featured लिस्टिंग",
      title: "{city} में ₹45,000 से {count}+ पुरानी कारें बिक्री के लिए",
    },
    whatsapp: {
      widgetLabel: "WhatsApp",
      widgetTitle: "WhatsApp पर बात करें",
      pageBadge: "WhatsApp कंसीयर्ज",
      pageTitle: "WhatsApp पर कार खरीदें या बेचें",
      pageSubtitle:
        "ऐप की ज़रूरत नहीं — हिंदी या English में message करें। हमारी टीम listing, search और loan में मदद करती है।",
      sellTitle: "अपनी कार बेचें",
      sellDesc:
        "फोटो, मॉडल, साल, kms और asking price भेजें। हम आपकी listing publish करने में मदद करेंगे।",
      sellBtn: "WhatsApp पर बेचना शुरू करें",
      buyTitle: "पुरानी कार खोजें",
      buyDesc:
        "अपना शहर, बजट और पसंदीदा brand बताएं। हम matching listings भेजेंगे।",
      buyBtn: "WhatsApp से खोजें",
      loanTitle: "कार लोन मदद",
      loanDesc: "एक message में partner banks पर eligibility check करें।",
      loanBtn: "लोन के बारे में पूछें",
      helpTitle: "सपोर्ट से बात करें",
      helpDesc: "Listing, RC transfer या safety के सवाल? हमारी टीम से chat करें।",
      helpBtn: "सपोर्ट को message करें",
      howTitle: "कैसे काम करता है",
      steps: [
        "ऊपर कोई बटन दबाएं — WhatsApp ready message के साथ खुलेगा।",
        "Car photos और details (seller) या बजट और शहर (buyer) भेजें।",
        "हमारी टीम business hours में जवाब देती है और step-by-step guide करती है।",
      ],
      note: "टिप: कभी भी SELL, BUY या LOAN लिखकर दोबारा शुरू करें।",
      navLabel: "WhatsApp से बेचें",
    },
  },
};

export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? "")
  );
}
