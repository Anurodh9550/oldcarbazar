import type { Language } from "./translations";

export type ExtendedCopy = {
  common: {
    hello: string;
    logout: string;
    save: string;
    cancel: string;
    loading: string;
    profile: string;
    search: string;
    allCities: string;
    showingDealers: string;
    dealer: string;
    dealers: string;
    myAccount: string;
    account: string;
    postPurchase: string;
    privacy: string;
    loginRegister: string;
    saved: string;
    preview: string;
    dealerTools: string;
  };
  navExtra: {
    home: string;
    dealers: string;
  };
  profileMenu: {
    myListings: string;
    showroom: string;
    leads: string;
    upgradePro: string;
    billing: string;
    myOrders: string;
    shortlisted: string;
    myActivity: string;
    myVehicles: string;
    digitalGarage: string;
    consents: string;
    profileSettings: string;
  };
  profileHub: {
    myOrders: { badge: string; title: string; subtitle: string };
    shortlisted: { badge: string; title: string; subtitle: string };
    myActivity: { badge: string; title: string; subtitle: string };
    myVehicles: { badge: string; title: string; subtitle: string };
    myGarage: { badge: string; title: string; subtitle: string };
    myShowroom: { badge: string; title: string; subtitle: string };
    consents: { badge: string; title: string; subtitle: string };
    profileSettings: { badge: string; title: string; subtitle: string };
  };
  dealers: {
    pageTitle: string;
    pageSubtitle: string;
    searchPlaceholder: string;
    sortMostListings: string;
    sortNewest: string;
    sortName: string;
    activeListings: string;
    priceRange: string;
    showroom: string;
    profile: string;
    loadError: string;
    pageBadge: string;
    pageHeroTitle: string;
    pageHeroSubtitle: string;
    loadingDealers: string;
    noDealersTitle: string;
    noDealersSubtitle: string;
    acrossIndia: string;
    moreCities: string;
    proBadge: string;
    allDealers: string;
    notFoundTitle: string;
    notFoundDefault: string;
    dealerUnavailable: string;
    backToDealers: string;
    loadingDealer: string;
    proDealer: string;
    operatesInCities: string;
    joined: string;
    callDealer: string;
    totalEverListed: string;
    cities: string;
    brandsAvailable: string;
    carsFrom: string;
    carsAvailable: string;
    noActiveListings: string;
  };
  authGates: {
    garage: { title: string; description: string };
    showroom: { title: string; description: string };
    orders: { title: string; description: string };
    shortlisted: { title: string; description: string };
    activity: { title: string; description: string };
    vehicles: { title: string; description: string };
    consents: { title: string; description: string };
    settings: { title: string; description: string };
  };
  showroom: {
    carsListed: string;
    teamMembers: string;
    customerReviews: string;
    avgRating: string;
    aboutUs: string;
    ourTeam: string;
    meetTeam: string;
    inventory: string;
    allCars: string;
    allCarsSub: string;
    moreStock: string;
    moreInShowroom: string;
    moreInShowroomSub: string;
    reviews: string;
    whatCustomersSay: string;
    editorEyebrow: string;
    editorTitle: string;
    editorSub: string;
    previewShowroom: string;
    saveChanges: string;
    tabBrand: string;
    tabAbout: string;
    tabGallery: string;
    tabTeam: string;
    tabReviews: string;
    loginToBuild: string;
    goSellerDashboard: string;
    loadingShowroom: string;
    backToProfile: string;
    callNow: string;
    welcomeTitle: string;
    comingSoonTitle: string;
    comingSoonSub: string;
    viewDealerProfile: string;
  };
  footer: {
    highlight1Title: string;
    highlight1Sub: string;
    highlight2Title: string;
    highlight2Sub: string;
    highlight3Title: string;
    highlight3Sub: string;
    highlight4Title: string;
    highlight4Sub: string;
    aboutTitle: string;
    connectTitle: string;
    exploreTitle: string;
    experienceTitle: string;
    experienceDesc: string;
    followUs: string;
    copyright: string;
    about: string;
    careers: string;
    terms: string;
    privacy: string;
    policies: string;
    investors: string;
    faqs: string;
    feedback: string;
    contact: string;
    advertise: string;
    partner: string;
    admin: string;
    usedCars: string;
    browseDealers: string;
    valuation: string;
    rcGuide: string;
    insurance: string;
    reviews: string;
    news: string;
  };
};

export const extendedCopy: Record<Language, ExtendedCopy> = {
  en: {
    common: {
      hello: "Hello",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading…",
      profile: "Profile",
      search: "Search",
      allCities: "All cities",
      showingDealers: "Showing {count} dealers",
      dealer: "Dealer",
      dealers: "Dealers",
      myAccount: "My Account",
      account: "Account",
      postPurchase: "Post-purchase",
      privacy: "Privacy",
      dealerTools: "Dealer tools",
      loginRegister: "Login / Register",
      saved: "Saved ✓",
      preview: "Preview",
    },
    navExtra: { home: "Home", dealers: "DEALERS" },
    profileMenu: {
      myListings: "My Listings",
      showroom: "Showroom",
      leads: "Leads & Inquiries",
      upgradePro: "Upgrade to Pro",
      billing: "Billing & Invoices",
      myOrders: "My Orders",
      shortlisted: "Shortlisted Vehicles",
      myActivity: "My Activity",
      myVehicles: "My Vehicles",
      digitalGarage: "OCB Digital Garage",
      consents: "Manage Consents",
      profileSettings: "Profile Settings",
    },
    profileHub: {
      myOrders: {
        badge: "Account",
        title: "My Orders",
        subtitle: "Car bookings, inspections and purchase requests — all in one place.",
      },
      shortlisted: {
        badge: "Account",
        title: "Shortlisted Vehicles",
        subtitle: "Compare and contact the cars you've saved, right from here.",
      },
      myActivity: {
        badge: "Account",
        title: "My Activity",
        subtitle: "History of recent searches, viewed listings and inquiries.",
      },
      myVehicles: {
        badge: "Account",
        title: "My Vehicles",
        subtitle: "Your owned cars and posted listings — in one dashboard.",
      },
      myGarage: {
        badge: "Post-purchase",
        title: "OCB Digital Garage",
        subtitle:
          "Your cars in one place — add photos, track RC notes, insurance renewal and service reminders.",
      },
      myShowroom: {
        badge: "Dealer tools",
        title: "Showroom",
        subtitle:
          "Update banner, logo, about us, team and reviews — your mini dealer website on Old Car Bazar.",
      },
      consents: {
        badge: "Privacy",
        title: "Manage Consents",
        subtitle: "Control marketing, WhatsApp alerts and data-sharing preferences.",
      },
      profileSettings: {
        badge: "Account",
        title: "Profile Settings",
        subtitle: "Update your name, email, phone and account details.",
      },
    },
    dealers: {
      pageTitle: "Find trusted dealers",
      pageSubtitle: "Browse verified sellers with active listings in your city.",
      searchPlaceholder: "Search dealer name or city…",
      sortMostListings: "Most listings",
      sortNewest: "Newest listings",
      sortName: "Name (A–Z)",
      activeListings: "ACTIVE LISTINGS",
      priceRange: "PRICE RANGE",
      showroom: "Showroom",
      profile: "Profile",
      loadError: "Could not load dealers. Please try again.",
      pageBadge: "Dealer Directory",
      pageHeroTitle: "Trusted used-car dealers",
      pageHeroSubtitle:
        "Browse verified dealers across India. Filter by city, sort by inventory size, and contact the right dealer directly.",
      loadingDealers: "Loading dealers from database…",
      noDealersTitle: "No dealers found",
      noDealersSubtitle: "Try a different city or clear your filters.",
      acrossIndia: "Across India",
      moreCities: "+{count} more",
      proBadge: "Pro",
      allDealers: "All dealers",
      notFoundTitle: "Dealer not found",
      notFoundDefault: "We couldn't find this dealer profile.",
      dealerUnavailable: "This dealer profile is no longer available.",
      backToDealers: "Back to dealers",
      loadingDealer: "Loading dealer from database…",
      proDealer: "Pro Dealer",
      operatesInCities: "· operates in {count} cities",
      joined: "· joined {date}",
      callDealer: "Call dealer",
      totalEverListed: "Total ever listed",
      cities: "Cities",
      brandsAvailable: "Brands available:",
      carsFrom: "Cars from {name}",
      carsAvailable: "{count} car(s) currently available",
      noActiveListings: "This dealer has no active listings right now.",
    },
    authGates: {
      garage: {
        title: "Login required",
        description: "Please log in to access your garage.",
      },
      showroom: {
        title: "Login required",
        description:
          "Log in as a seller to edit your Showroom — banner, about, team and reviews.",
      },
      orders: {
        title: "Login required",
        description: "Please log in to view your orders.",
      },
      shortlisted: {
        title: "Login required",
        description: "Please log in to view your shortlist.",
      },
      activity: {
        title: "Login required",
        description: "Please log in to view your activity.",
      },
      vehicles: {
        title: "Login required",
        description: "Please log in to view your vehicles.",
      },
      consents: {
        title: "Login required",
        description: "Please log in to manage your consents.",
      },
      settings: {
        title: "Login required",
        description: "Please log in to update your profile settings.",
      },
    },
    showroom: {
      carsListed: "Cars listed",
      teamMembers: "Team members",
      customerReviews: "Customer reviews",
      avgRating: "Avg. rating",
      aboutUs: "About us",
      ourTeam: "Our team",
      meetTeam: "Meet the people behind your deal",
      inventory: "Inventory",
      allCars: "All cars",
      allCarsSub: "Browse our complete stock with live availability status.",
      moreStock: "More stock",
      moreInShowroom: "More in our showroom",
      moreInShowroomSub:
        "These cars are in our yard — contact us for details. Not yet listed on Old Car Bazar.",
      reviews: "Reviews",
      whatCustomersSay: "What customers say",
      editorEyebrow: "Showroom",
      editorTitle: "Build your mini website",
      editorSub:
        "Banner, logo, about, team, cars & reviews — like your own dealer site.",
      previewShowroom: "Preview showroom",
      saveChanges: "Save changes",
      tabBrand: "Banner & Logo",
      tabAbout: "About",
      tabGallery: "More Cars",
      tabTeam: "Team",
      tabReviews: "Reviews",
      loginToBuild: "Log in to build your Showroom.",
      goSellerDashboard: "Go to seller dashboard →",
      loadingShowroom: "Loading showroom…",
      backToProfile: "← Back to dealer profile",
      callNow: "Call now",
      welcomeTitle: "Welcome to {name}",
      comingSoonTitle: "Showroom coming soon",
      comingSoonSub: "{name} hasn't published their showroom yet.",
      viewDealerProfile: "View dealer profile",
    },
    footer: {
      highlight1Title: "India's trusted",
      highlight1Sub: "Used car marketplace",
      highlight2Title: "Smart search",
      highlight2Sub: "Find cars by city & budget",
      highlight3Title: "Best offers",
      highlight3Sub: "Direct owner listings",
      highlight4Title: "Compare",
      highlight4Sub: "Decode the right car",
      aboutTitle: "About Old Car Bazar",
      connectTitle: "Connect With Us",
      exploreTitle: "Explore",
      experienceTitle: "Experience Old Car Bazar",
      experienceDesc:
        "Buy & sell used cars with direct owner contact, free listings, and city-wise search across India.",
      followUs: "Follow us",
      copyright: "© {year} Old Car Bazar. All rights reserved.",
      about: "About",
      careers: "Careers With Us",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      policies: "Corporate Policies",
      investors: "Investors",
      faqs: "FAQs",
      feedback: "Feedback",
      contact: "Contact Us",
      advertise: "Advertise with Us",
      partner: "Become Partner Dealer",
      admin: "Admin Panel",
      usedCars: "Used Cars",
      browseDealers: "Browse Dealers",
      valuation: "Free Valuation",
      rcGuide: "RC Transfer Guide",
      insurance: "Insurance",
      reviews: "Car Reviews",
      news: "News & Updates",
    },
  },
  hi: {
    common: {
      hello: "नमस्ते",
      logout: "लॉग आउट",
      save: "सेव करें",
      cancel: "रद्द करें",
      loading: "लोड हो रहा है…",
      profile: "प्रोफ़ाइल",
      search: "खोजें",
      allCities: "सभी शहर",
      showingDealers: "{count} dealers दिखाए जा रहे हैं",
      dealer: "डीलर",
      dealers: "डीलर्स",
      myAccount: "मेरा अकाउंट",
      account: "अकाउंट",
      postPurchase: "खरीद के बाद",
      privacy: "प्राइवेसी",
      dealerTools: "डीलर टूल्स",
      loginRegister: "लॉगिन / रजिस्टर",
      saved: "सेव हो गया ✓",
      preview: "प्रीव्यू",
    },
    navExtra: { home: "होम", dealers: "डीलर्स" },
    profileMenu: {
      myListings: "मेरी लिस्टिंग",
      showroom: "शोरूम",
      leads: "Leads और पूछताछ",
      upgradePro: "Pro में अपग्रेड",
      billing: "बिलिंग और इनवॉइस",
      myOrders: "मेरे ऑर्डर",
      shortlisted: "पसंदीदा कारें",
      myActivity: "मेरी गतिविधि",
      myVehicles: "मेरी गाड़ियाँ",
      digitalGarage: "OCB Digital Garage",
      consents: "Consent प्रबंधन",
      profileSettings: "प्रोफ़ाइल सेटिंग्स",
    },
    profileHub: {
      myOrders: {
        badge: "अकाउंट",
        title: "मेरे ऑर्डर",
        subtitle: "कार बुकिंग, inspection और purchase requests — एक जगह।",
      },
      shortlisted: {
        badge: "अकाउंट",
        title: "पसंदीदा कारें",
        subtitle: "जो कारें सेव की हैं, उन्हें यहीं से compare और contact करें।",
      },
      myActivity: {
        badge: "अकाउंट",
        title: "मेरी गतिविधि",
        subtitle: "हाल की searches, देखी गई listings और inquiries का इतिहास।",
      },
      myVehicles: {
        badge: "अकाउंट",
        title: "मेरी गाड़ियाँ",
        subtitle: "आपकी कारें और posted listings — एक dashboard में।",
      },
      myGarage: {
        badge: "खरीद के बाद",
        title: "OCB Digital Garage",
        subtitle:
          "अपनी सारी कारें एक जगह — photos, RC notes, insurance और service reminders।",
      },
      myShowroom: {
        badge: "डीलर टूल्स",
        title: "शोरूम",
        subtitle:
          "Banner, logo, about, team और reviews अपडेट करें — आपकी mini dealer website।",
      },
      consents: {
        badge: "प्राइवेसी",
        title: "Consent प्रबंधन",
        subtitle: "Marketing, WhatsApp alerts और data-sharing की सेटिंग्स।",
      },
      profileSettings: {
        badge: "अकाउंट",
        title: "प्रोफ़ाइल सेटिंग्स",
        subtitle: "नाम, email, phone और account details अपडेट करें।",
      },
    },
    dealers: {
      pageTitle: "भरोसेमंद dealers खोजें",
      pageSubtitle: "अपने शहर में active listings वाले verified sellers देखें।",
      searchPlaceholder: "Dealer का नाम या शहर खोजें…",
      sortMostListings: "सबसे ज़्यादा listings",
      sortNewest: "नई listings",
      sortName: "नाम (A–Z)",
      activeListings: "ACTIVE LISTINGS",
      priceRange: "कीमत रेंज",
      showroom: "शोरूम",
      profile: "प्रोफ़ाइल",
      loadError: "Dealers लोड नहीं हो सके। फिर कोशिश करें।",
      pageBadge: "डीलर डायरेक्टरी",
      pageHeroTitle: "भरोसेमंद यूज़्ड कार डीलर्स",
      pageHeroSubtitle:
        "पूरे भारत में verified dealers देखें। शहर से filter करें, inventory के हिसाब से sort करें, और सीधे संपर्क करें।",
      loadingDealers: "डेटाबेस से dealers लोड हो रहे हैं…",
      noDealersTitle: "कोई dealer नहीं मिला",
      noDealersSubtitle: "दूसरा शहर चुनें या filters हटाएँ।",
      acrossIndia: "पूरे भारत में",
      moreCities: "+{count} और",
      proBadge: "Pro",
      allDealers: "सभी dealers",
      notFoundTitle: "Dealer नहीं मिला",
      notFoundDefault: "यह dealer profile नहीं मिली।",
      dealerUnavailable: "यह dealer profile अब उपलब्ध नहीं है।",
      backToDealers: "Dealers पर वापस",
      loadingDealer: "डेटाबेस से dealer लोड हो रहा है…",
      proDealer: "Pro Dealer",
      operatesInCities: "· {count} शहरों में",
      joined: "· {date} से जुड़े",
      callDealer: "डीलर को कॉल करें",
      totalEverListed: "कुल listings",
      cities: "शहर",
      brandsAvailable: "उपलब्ध brands:",
      carsFrom: "{name} की कारें",
      carsAvailable: "अभी {count} कार उपलब्ध",
      noActiveListings: "इस dealer की अभी कोई active listing नहीं है।",
    },
    authGates: {
      garage: {
        title: "लॉगिन ज़रूरी है",
        description: "अपना garage देखने के लिए लॉगिन करें।",
      },
      showroom: {
        title: "लॉगिन ज़रूरी है",
        description:
          "Showroom edit करने के लिए seller के रूप में लॉगिन करें — banner, about, team और reviews।",
      },
      orders: {
        title: "लॉगिन ज़रूरी है",
        description: "अपने orders देखने के लिए लॉगिन करें।",
      },
      shortlisted: {
        title: "लॉगिन ज़रूरी है",
        description: "अपनी shortlist देखने के लिए लॉगिन करें।",
      },
      activity: {
        title: "लॉगिन ज़रूरी है",
        description: "अपनी activity देखने के लिए लॉगिन करें।",
      },
      vehicles: {
        title: "लॉगिन ज़रूरी है",
        description: "अपनी गाड़ियाँ देखने के लिए लॉगिन करें।",
      },
      consents: {
        title: "लॉगिन ज़रूरी है",
        description: "consent settings के लिए लॉगिन करें।",
      },
      settings: {
        title: "लॉगिन ज़रूरी है",
        description: "प्रोफ़ाइल सेटिंग्स के लिए लॉगिन करें।",
      },
    },
    showroom: {
      carsListed: "लिस्ट की गई कारें",
      teamMembers: "टीम सदस्य",
      customerReviews: "ग्राहक reviews",
      avgRating: "औसत rating",
      aboutUs: "हमारे बारे में",
      ourTeam: "हमारी टीम",
      meetTeam: "आपकी deal के पीछे की टीम",
      inventory: "इन्वेंटरी",
      allCars: "सभी कारें",
      allCarsSub: "live availability के साथ पूरी stock देखें।",
      moreStock: "और stock",
      moreInShowroom: "शोरूम में और कारें",
      moreInShowroomSub:
        "ये कारें हमारे yard में हैं — details के लिए संपर्क करें। अभी Old Car Bazar पर listed नहीं।",
      reviews: "Reviews",
      whatCustomersSay: "ग्राहक क्या कहते हैं",
      editorEyebrow: "शोरूम",
      editorTitle: "अपनी mini website बनाएँ",
      editorSub:
        "Banner, logo, about, team, cars और reviews — अपनी dealer site जैसी।",
      previewShowroom: "शोरूम preview",
      saveChanges: "बदलाव सेव करें",
      tabBrand: "Banner और Logo",
      tabAbout: "About",
      tabGallery: "और कारें",
      tabTeam: "टीम",
      tabReviews: "Reviews",
      loginToBuild: "Showroom बनाने के लिए लॉगिन करें।",
      goSellerDashboard: "Seller dashboard पर जाएँ →",
      loadingShowroom: "शोरूम लोड हो रहा है…",
      backToProfile: "← Dealer profile पर वापस",
      callNow: "अभी कॉल करें",
      welcomeTitle: "{name} में आपका स्वागत है",
      comingSoonTitle: "शोरूम जल्द आ रहा है",
      comingSoonSub: "{name} ने अभी showroom publish नहीं किया है।",
      viewDealerProfile: "Dealer profile देखें",
    },
    footer: {
      highlight1Title: "भारत का भरोसेमंद",
      highlight1Sub: "यूज़्ड कार मार्केटप्लेस",
      highlight2Title: "Smart search",
      highlight2Sub: "शहर और बजट से कार खोजें",
      highlight3Title: "बेस्ट ऑफ़र",
      highlight3Sub: "Direct owner listings",
      highlight4Title: "Compare",
      highlight4Sub: "सही कार चुनें",
      aboutTitle: "Old Car Bazar के बारे में",
      connectTitle: "हमसे जुड़ें",
      exploreTitle: "Explore",
      experienceTitle: "Old Car Bazar अनुभव",
      experienceDesc:
        "Direct owner contact, मुफ़्त listings और पूरे भारत में शहर-wise search के साथ कार खरीदें या बेचें।",
      followUs: "हमें follow करें",
      copyright: "© {year} Old Car Bazar. सर्वाधिकार सुरक्षित।",
      about: "हमारे बारे में",
      careers: "करियर",
      terms: "नियम और शर्तें",
      privacy: "प्राइवेसी पॉलिसी",
      policies: "कॉर्पोरेट पॉलिसी",
      investors: "इन्वेस्टर्स",
      faqs: "FAQs",
      feedback: "Feedback",
      contact: "संपर्क करें",
      advertise: "हमारे साथ विज्ञापन",
      partner: "Partner Dealer बनें",
      admin: "Admin Panel",
      usedCars: "पुरानी कारें",
      browseDealers: "Dealers देखें",
      valuation: "मुफ़्त Valuation",
      rcGuide: "RC Transfer Guide",
      insurance: "Insurance",
      reviews: "Car Reviews",
      news: "News & Updates",
    },
  },
};
