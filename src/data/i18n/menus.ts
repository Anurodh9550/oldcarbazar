import type { MenuColumn } from "@/data/navMenus";
import type { Language } from "./translations";

export function getBuyCarsMenu(city: string, lang: Language): MenuColumn[] {
  if (lang === "hi") {
    return [
      {
        title: "पुरानी कार खरीदें",
        links: [
          { label: "सभी कारें देखें", href: "/used-cars" },
          {
            label: `${city} में कारें`,
            href: `/used-cars/search?city=${encodeURIComponent(city)}`,
          },
          { label: "Assured / Verified कारें", href: "/assured" },
          { label: "नई आवक", href: "/used-cars/search?sort=newest" },
        ],
      },
      {
        title: "बजट के हिसाब से",
        links: [
          { label: "₹2 लाख से कम", href: "/used-cars/search?budget=under-2" },
          { label: "₹2 – ₹5 लाख", href: "/used-cars/search?budget=3-5" },
          { label: "₹5 – ₹10 लाख", href: "/used-cars/search?budget=5-10" },
          { label: "Luxury कारें", href: "/used-cars/search?budget=15-plus" },
        ],
      },
      {
        title: "टूल्स और ऑफ़र",
        links: [
          { label: "Reverse Auction", href: "/reverse-auction" },
          { label: "WhatsApp से बेचें", href: "/whatsapp-sell" },
          { label: "कार Compare करें", href: "/compare" },
          { label: "मल्टी-बैंक लोन", href: "/loan-marketplace" },
          { label: "Used Car Loan", href: "/used-car-loan" },
          { label: "EMI Calculator", href: "/emi-calculator" },
          { label: "लोकप्रिय शहर", href: "#cities", hasSubmenu: true },
        ],
      },
    ];
  }
  return [
    {
      title: "Buy Used Cars",
      links: [
        { label: "Explore All Cars", href: "/used-cars" },
        {
          label: `Cars in ${city}`,
          href: `/used-cars/search?city=${encodeURIComponent(city)}`,
        },
        { label: "Assured / Verified Cars", href: "/assured" },
        { label: "New Arrivals", href: "/used-cars/search?sort=newest" },
      ],
    },
    {
      title: "Shop by Budget",
      links: [
        { label: "Under ₹2 Lakh", href: "/used-cars/search?budget=under-2" },
        { label: "₹2 – ₹5 Lakh", href: "/used-cars/search?budget=3-5" },
        { label: "₹5 – ₹10 Lakh", href: "/used-cars/search?budget=5-10" },
        { label: "Luxury Cars", href: "/used-cars/search?budget=15-plus" },
      ],
    },
    {
      title: "Tools & Offers",
      links: [
        { label: "Reverse Auction", href: "/reverse-auction" },
        { label: "Sell via WhatsApp", href: "/whatsapp-sell" },
        { label: "Compare Cars", href: "/compare" },
        { label: "Multi-Bank Loan", href: "/loan-marketplace" },
        { label: "Used Car Loan", href: "/used-car-loan" },
        { label: "EMI Calculator", href: "/emi-calculator" },
        { label: "Popular Cities", href: "#cities", hasSubmenu: true },
      ],
    },
  ];
}

export function getSellCarMenu(lang: Language): MenuColumn[] {
  if (lang === "hi") {
    return [
      {
        title: "अपनी कार बेचें",
        links: [
          { label: "मुफ़्त में कार बेचें", href: "/sell-car" },
          { label: "2 मिनट में Ad", href: "/post-ad" },
          { label: "WhatsApp से बेचें", href: "/whatsapp-sell" },
          { label: "मेरी लिस्टिंग", href: "/my-listings" },
          { label: "Seller Dashboard", href: "/seller" },
        ],
      },
      {
        title: "डीलर टूल्स",
        links: [
          { label: "Showroom Builder", href: "/my-showroom" },
          { label: "Car Availability Calendar", href: "/dealer/availability" },
          { label: "Dealers खोजें", href: "/dealers" },
          { label: "Dealer / Partner Login", href: "/dealer" },
        ],
      },
      {
        title: "Valuation और मदद",
        links: [
          { label: "मुफ़्त Car Valuation", href: "/valuation" },
          { label: "बेचने का तरीका", href: "/sell-guide" },
          { label: "जल्दी बेचने के टिप्स", href: "/sell-tips" },
        ],
      },
      {
        title: "बेचने के बाद",
        links: [
          { label: "Dealers खोजें", href: "/dealers" },
          { label: "OCB Digital Garage", href: "/my-garage" },
          { label: "RC Transfer Guide", href: "/rc-guide" },
          { label: "Insurance Renewal", href: "/insurance" },
          { label: "Buyers से Chat", href: "/messages" },
        ],
      },
    ];
  }
  return [
    {
      title: "Sell Your Car",
      links: [
        { label: "Sell Car Free", href: "/sell-car" },
        { label: "Post Ad in 2 Minutes", href: "/post-ad" },
        { label: "Sell via WhatsApp", href: "/whatsapp-sell" },
        { label: "My Listings", href: "/my-listings" },
        { label: "Seller Dashboard", href: "/seller" },
      ],
    },
    {
      title: "Dealer Tools",
      links: [
        { label: "Showroom Builder", href: "/my-showroom" },
        { label: "Car Availability Calendar", href: "/dealer/availability" },
        { label: "Find Dealers", href: "/dealers" },
        { label: "Dealer / Partner Login", href: "/dealer" },
      ],
    },
    {
      title: "Valuation & Help",
      links: [
        { label: "Free Car Valuation", href: "/valuation" },
        { label: "How Selling Works", href: "/sell-guide" },
        { label: "Tips to Sell Faster", href: "/sell-tips" },
      ],
    },
    {
      title: "After You Sell",
      links: [
        { label: "Find Dealers", href: "/dealers" },
        { label: "OCB Digital Garage", href: "/my-garage" },
        { label: "RC Transfer Guide", href: "/rc-guide" },
        { label: "Insurance Renewal", href: "/insurance" },
        { label: "Chat with Buyers", href: "/messages" },
      ],
    },
  ];
}

export function getLoanToolsMenu(lang: Language): MenuColumn[] {
  if (lang === "hi") {
    return [
      {
        title: "Finance",
        links: [
          { label: "मल्टी-बैंक Loan Marketplace", href: "/loan-marketplace" },
          { label: "Used Car Loan", href: "/used-car-loan" },
          { label: "एक बैंक में Apply", href: "/car-loan" },
          { label: "EMI Calculator", href: "/emi-calculator" },
          { label: "Loan Eligibility Check", href: "/loan-eligibility" },
          { label: "ब्याज दर Compare", href: "/compare-loans" },
        ],
      },
      {
        title: "Car Tools",
        links: [
          { label: "Car Valuation", href: "/valuation" },
          { label: "कार Compare", href: "/compare" },
          { label: "Vehicle History Report", href: "/history-report" },
          { label: "Insurance Quotes", href: "/insurance" },
        ],
      },
      {
        title: "Quick Links",
        links: [
          { label: "Assured Cars", href: "/assured" },
          { label: "Dealers खोजें", href: "/dealers" },
          { label: "लोकप्रिय शहर", href: "#cities", hasSubmenu: true },
          { label: "आज के बेस्ट Deals", href: "/used-cars/search?discount=discounted" },
        ],
      },
    ];
  }
  return [
    {
      title: "Finance",
      links: [
        { label: "Multi-Bank Loan Marketplace", href: "/loan-marketplace" },
        { label: "Used Car Loan", href: "/used-car-loan" },
        { label: "Apply to One Bank", href: "/car-loan" },
        { label: "EMI Calculator", href: "/emi-calculator" },
        { label: "Loan Eligibility Check", href: "/loan-eligibility" },
        { label: "Compare Interest Rates", href: "/compare-loans" },
      ],
    },
    {
      title: "Car Tools",
      links: [
        { label: "Check Car Valuation", href: "/valuation" },
        { label: "Compare Cars", href: "/compare" },
        { label: "Vehicle History Report", href: "/history-report" },
        { label: "Insurance Quotes", href: "/insurance" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Assured Cars", href: "/assured" },
        { label: "Find Dealers", href: "/dealers" },
        { label: "Popular Cities", href: "#cities", hasSubmenu: true },
        { label: "Best Deals Today", href: "/used-cars/search?discount=discounted" },
      ],
    },
  ];
}

export function getHelpMenu(lang: Language): MenuColumn[] {
  if (lang === "hi") {
    return [
      {
        title: "Help Center",
        links: [
          { label: "कैसे खरीदें", href: "/help/buy" },
          { label: "कैसे बेचें", href: "/help/sell" },
          { label: "Safety Tips", href: "/help/safety" },
          { label: "FAQs", href: "/help/faq" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Old Car Bazar के बारे में", href: "/about" },
          { label: "संपर्क करें", href: "/contact" },
          { label: "करियर", href: "/careers" },
          { label: "Partner बनें", href: "/partner" },
        ],
      },
      {
        title: "और",
        links: [
          { label: "Car Reviews", href: "/reviews" },
          { label: "News & Updates", href: "/news" },
          { label: "Videos", href: "/videos" },
          { label: "Sitemap", href: "/sitemap" },
        ],
      },
    ];
  }
  return [
    {
      title: "Help Center",
      links: [
        { label: "How to Buy", href: "/help/buy" },
        { label: "How to Sell", href: "/help/sell" },
        { label: "Safety Tips", href: "/help/safety" },
        { label: "FAQs", href: "/help/faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Old Car Bazar", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Partner with Us", href: "/partner" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "Car Reviews", href: "/reviews" },
        { label: "News & Updates", href: "/news" },
        { label: "Videos", href: "/videos" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];
}
