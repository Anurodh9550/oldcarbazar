export type ProfileMenuItem = {
  id: keyof import("@/data/i18n/extended").ExtendedCopy["profileMenu"];
  href: string;
  icon:
    | "orders"
    | "heart"
    | "activity"
    | "car"
    | "garage"
    | "listings"
    | "leads"
    | "settings"
    | "consent"
    | "pro"
    | "billing"
    | "showroom";
  dividerAfter?: boolean;
};

export const profileMenuItems: ProfileMenuItem[] = [
  { id: "myListings", href: "/my-listings", icon: "listings" },
  { id: "showroom", href: "/my-showroom", icon: "showroom" },
  { id: "leads", href: "/leads", icon: "leads" },
  { id: "upgradePro", href: "/pricing", icon: "pro" },
  { id: "billing", href: "/my-subscriptions", icon: "billing", dividerAfter: true },
  { id: "myOrders", href: "/my-orders", icon: "orders" },
  { id: "shortlisted", href: "/shortlisted", icon: "heart" },
  { id: "myActivity", href: "/my-activity", icon: "activity" },
  { id: "myVehicles", href: "/my-vehicles", icon: "car" },
  { id: "digitalGarage", href: "/my-garage", icon: "garage", dividerAfter: true },
  { id: "consents", href: "/consents", icon: "consent" },
  { id: "profileSettings", href: "/profile-settings", icon: "settings" },
];
