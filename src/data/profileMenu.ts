export type ProfileMenuItem = {
  label: string;
  href: string;
  icon:
    | "orders"
    | "heart"
    | "activity"
    | "car"
    | "garage"
    | "listings"
    | "settings"
    | "consent"
    | "pro"
    | "billing";
  dividerAfter?: boolean;
};

export const profileMenuItems: ProfileMenuItem[] = [
  { label: "My Listings", href: "/my-listings", icon: "listings" },
  { label: "Upgrade to Pro", href: "/pricing", icon: "pro" },
  { label: "Billing & Invoices", href: "/my-subscriptions", icon: "billing", dividerAfter: true },
  { label: "My Orders", href: "/my-orders", icon: "orders" },
  { label: "Shortlisted Vehicles", href: "/shortlisted", icon: "heart" },
  { label: "My Activity", href: "/my-activity", icon: "activity" },
  { label: "My Vehicles", href: "/my-vehicles", icon: "car" },
  { label: "My Garage", href: "/my-garage", icon: "garage", dividerAfter: true },
  { label: "Manage Consents", href: "/consents", icon: "consent" },
  { label: "Profile Settings", href: "/profile-settings", icon: "settings" },
];
