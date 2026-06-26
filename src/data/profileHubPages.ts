import type { ProfileMenuItem } from "@/data/profileMenu";

export type ProfileHubPageId =
  | "my-orders"
  | "shortlisted"
  | "my-activity"
  | "my-vehicles"
  | "my-garage"
  | "consents"
  | "profile-settings";

export const profileHubPageMeta: Record<
  ProfileHubPageId,
  { badge: string; title: string; subtitle: string; icon: ProfileMenuItem["icon"] }
> = {
  "my-orders": {
    badge: "Account",
    title: "My Orders",
    subtitle: "Car bookings, inspections and purchase requests — all in one place.",
    icon: "orders",
  },
  shortlisted: {
    badge: "Account",
    title: "Shortlisted Vehicles",
    subtitle: "Compare and contact the cars you've saved, right from here.",
    icon: "heart",
  },
  "my-activity": {
    badge: "Account",
    title: "My Activity",
    subtitle: "History of recent searches, viewed listings and inquiries.",
    icon: "activity",
  },
  "my-vehicles": {
    badge: "Account",
    title: "My Vehicles",
    subtitle: "Your owned cars and posted listings — in one dashboard.",
    icon: "car",
  },
  "my-garage": {
    badge: "Post-purchase",
    title: "OCB Digital Garage",
    subtitle: "Your post-purchase hub — RC notes, insurance renewal, service reminders and documents.",
    icon: "garage",
  },
  consents: {
    badge: "Privacy",
    title: "Manage Consents",
    subtitle: "Control marketing, WhatsApp alerts and data-sharing preferences.",
    icon: "consent",
  },
  "profile-settings": {
    badge: "Account",
    title: "Profile Settings",
    subtitle: "Update your name, email, phone and account details.",
    icon: "settings",
  },
};
