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
    | "leads"
    | "settings"
    | "consent"
    | "pro"
    | "billing"
    | "showroom";
  dividerAfter?: boolean;
};

export const profileMenuItems: ProfileMenuItem[] = [
  { label: "My Listings", href: "/my-listings", icon: "listings" },
  {
    label: "Virtual Showroom",
    href: "/my-showroom",
    icon: "showroom",
  },
  { label: "Leads & Inquiries", href: "/leads", icon: "leads" },
  { label: "Upgrade to Pro", href: "/pricing", icon: "pro" },
  { label: "Billing & Invoices", href: "/my-subscriptions", icon: "billing", dividerAfter: true },
  { label: "My Orders", href: "/my-orders", icon: "orders" },
  { label: "Shortlisted Vehicles", href: "/shortlisted", icon: "heart" },
  { label: "My Activity", href: "/my-activity", icon: "activity" },
  { label: "My Vehicles", href: "/my-vehicles", icon: "car" },
  { label: "OCB Digital Garage", href: "/my-garage", icon: "garage", dividerAfter: true },
  { label: "Manage Consents", href: "/consents", icon: "consent" },
  { label: "Profile Settings", href: "/profile-settings", icon: "settings" },
];
