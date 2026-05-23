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
    subtitle: "Car bookings, inspections, and purchase requests — sab ek jagah.",
    icon: "orders",
  },
  shortlisted: {
    badge: "Account",
    title: "Shortlisted Vehicles",
    subtitle: "Jo cars aapne save ki hain, unhe yahan se compare aur contact karo.",
    icon: "heart",
  },
  "my-activity": {
    badge: "Account",
    title: "My Activity",
    subtitle: "Recent searches, viewed listings, aur inquiries ka history.",
    icon: "activity",
  },
  "my-vehicles": {
    badge: "Account",
    title: "My Vehicles",
    subtitle: "Aapki owned cars aur posted listings — ek dashboard.",
    icon: "car",
  },
  "my-garage": {
    badge: "Account",
    title: "My Garage",
    subtitle: "Apni cars ka digital garage — service reminders aur documents.",
    icon: "garage",
  },
  consents: {
    badge: "Privacy",
    title: "Manage Consents",
    subtitle: "Marketing, WhatsApp alerts, aur data sharing preferences control karo.",
    icon: "consent",
  },
  "profile-settings": {
    badge: "Account",
    title: "Profile Settings",
    subtitle: "Name, email, phone aur account details update karo.",
    icon: "settings",
  },
};
