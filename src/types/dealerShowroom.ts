export type ShowroomTeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio?: string;
};

export type ShowroomReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type DealerShowroom = {
  dealerId: string;
  dealerName: string;
  enabled: boolean;
  bannerUrl: string;
  logoUrl: string;
  tagline: string;
  about: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  team: ShowroomTeamMember[];
  reviews: ShowroomReview[];
  updatedAt: number;
};

export const DEFAULT_SHOWROOM = (
  dealerId: string,
  dealerName: string
): DealerShowroom => ({
  dealerId,
  dealerName,
  enabled: true,
  bannerUrl:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=600&fit=crop",
  logoUrl: "",
  tagline: "Your trusted used car partner",
  about:
    "We offer verified pre-owned cars with transparent pricing, easy finance, and after-sales support.",
  team: [],
  reviews: [],
  updatedAt: Date.now(),
});
