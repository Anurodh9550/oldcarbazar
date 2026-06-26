export type TruthDeclaration = {
  no_accident: boolean;
  no_flood: boolean;
  not_commercial: boolean;
  no_major_repair: boolean;
  rc_available: boolean;
  direct_owner: boolean;
  confirmed: boolean;
};

export const TRUTH_QUESTIONS: {
  key: keyof Omit<TruthDeclaration, "confirmed">;
  label: string;
  hint?: string;
}[] = [
  {
    key: "no_accident",
    label: "No major accident",
    hint: "No structural damage or total loss",
  },
  {
    key: "no_flood",
    label: "No flood or water damage",
  },
  {
    key: "not_commercial",
    label: "Not used as taxi or for commercial purposes",
  },
  {
    key: "no_major_repair",
    label: "Engine or gearbox has not been replaced",
  },
  {
    key: "rc_available",
    label: "Original RC and keys are available",
  },
  {
    key: "direct_owner",
    label: "I am the direct owner — not a broker",
  },
];

export const initialTruthDeclaration: TruthDeclaration = {
  no_accident: false,
  no_flood: false,
  not_commercial: false,
  no_major_repair: false,
  rc_available: false,
  direct_owner: false,
  confirmed: false,
};

export function isTruthDeclarationComplete(decl: TruthDeclaration): boolean {
  return TRUTH_QUESTIONS.every((q) => Boolean(decl[q.key])) && decl.confirmed;
}
