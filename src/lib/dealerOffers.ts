export type DealerOfferPlan = {
  code: string;
  name: string;
  price_inr: number;
  duration_days: number;
  listing_limit: number | null;
  perks: string[];
};

export type DealerOfferCampaign = {
  enabled: boolean;
  default_plan_code: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta_label: string;
  cta_href: string;
  max_grants: number;
};

export type DealerActiveGrant = {
  subscription_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_city: string;
  plan: string;
  plan_name: string;
  listings_count: number;
  started_at: string;
  expires_at: string;
  provider: string;
};

export type DealerOffersResponse = {
  campaign: DealerOfferCampaign;
  plans: DealerOfferPlan[];
  active_grants: DealerActiveGrant[];
  stats: {
    grants_used: number;
    max_grants: number;
    slots_remaining: number | null;
  };
};

export const defaultDealerOfferCampaign: DealerOfferCampaign = {
  enabled: true,
  default_plan_code: "dealer_trial_20",
  badge: "DEALER OFFER",
  title: "20 Din Unlimited Listing!",
  subtitle: "Dealers ke liye special launch offer",
  description:
    "Ab 20 din tak jitni chahein utni gadiyan list karein — bilkul free. Verified dealer badge, direct buyer contact.",
  cta_label: "Dealer Join Karein",
  cta_href: "/partner",
  max_grants: 100,
};

export function daysUntilExpiry(expiresAt: string): number {
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

export function formatExpiryLabel(expiresAt: string): string {
  const days = daysUntilExpiry(expiresAt);
  if (days === 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/** Push dealer campaign copy into the site promo popup. */
export function campaignToPromoPatch(campaign: DealerOfferCampaign) {
  return {
    enabled: campaign.enabled,
    badge: campaign.badge,
    title: campaign.title,
    subtitle: campaign.subtitle,
    description: campaign.description,
    ctaLabel: campaign.cta_label,
    ctaHref: campaign.cta_href,
    theme: "orange" as const,
  };
}
