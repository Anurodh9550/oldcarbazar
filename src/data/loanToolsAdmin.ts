import {
  loanBanks as defaultLoanBanks,
  loanBenefits as defaultLoanBenefits,
  loanDocs as defaultLoanDocs,
  assuredFeatures as defaultAssuredFeatures,
  loanToolsPageMeta as defaultPageMeta,
  type LoanBank,
  type LoanToolsPageId,
} from "@/data/loanToolsPages";

/**
 * Editable copy for the public Loan & Tools hub. Stored in localStorage so an
 * admin can tweak titles, taglines, badges and content blocks without a redeploy.
 *
 * This intentionally lives outside `AdminSettings` (which roundtrips to the
 * backend) — Loan & Tools copy has no DB column on the backend yet.
 */

export type LoanToolsHeroMeta = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
};

export type FeatureBlock = {
  icon: string;
  title: string;
  desc: string;
};

export type LoanToolsContent = {
  /** Public hub-level badge / hero card used on `/used-car-loan` family. */
  heroes: Record<LoanToolsPageId, LoanToolsHeroMeta>;
  banks: LoanBank[];
  benefits: FeatureBlock[];
  docs: string[];
  assuredFeatures: FeatureBlock[];
};

export const defaultLoanToolsContent: LoanToolsContent = {
  heroes: { ...defaultPageMeta },
  banks: defaultLoanBanks.map((b) => ({ ...b })),
  benefits: defaultLoanBenefits.map((b) => ({ ...b })),
  docs: [...defaultLoanDocs],
  assuredFeatures: defaultAssuredFeatures.map((b) => ({ ...b })),
};

export function cloneLoanToolsContent(
  src: LoanToolsContent = defaultLoanToolsContent
): LoanToolsContent {
  return {
    heroes: Object.fromEntries(
      (Object.entries(src.heroes) as [LoanToolsPageId, LoanToolsHeroMeta][]).map(
        ([k, v]) => [k, { ...v }]
      )
    ) as Record<LoanToolsPageId, LoanToolsHeroMeta>,
    banks: src.banks.map((b) => ({ ...b })),
    benefits: src.benefits.map((b) => ({ ...b })),
    docs: [...src.docs],
    assuredFeatures: src.assuredFeatures.map((b) => ({ ...b })),
  };
}

/**
 * Backfills any missing keys from the defaults so older stored JSON (saved
 * before a field was added) doesn't crash the UI after a deploy.
 */
export function mergeLoanToolsContent(
  saved: Partial<LoanToolsContent> | undefined
): LoanToolsContent {
  const base = cloneLoanToolsContent(defaultLoanToolsContent);
  if (!saved) return base;

  const heroes = { ...base.heroes };
  if (saved.heroes) {
    for (const id of Object.keys(heroes) as LoanToolsPageId[]) {
      const incoming = saved.heroes[id];
      if (incoming) {
        heroes[id] = { ...heroes[id], ...incoming };
      }
    }
  }

  return {
    heroes,
    banks: Array.isArray(saved.banks) && saved.banks.length > 0
      ? saved.banks.map((b) => ({ ...b }))
      : base.banks,
    benefits:
      Array.isArray(saved.benefits) && saved.benefits.length > 0
        ? saved.benefits.map((b) => ({ ...b }))
        : base.benefits,
    docs:
      Array.isArray(saved.docs) && saved.docs.length > 0
        ? [...saved.docs]
        : base.docs,
    assuredFeatures:
      Array.isArray(saved.assuredFeatures) && saved.assuredFeatures.length > 0
        ? saved.assuredFeatures.map((b) => ({ ...b }))
        : base.assuredFeatures,
  };
}
