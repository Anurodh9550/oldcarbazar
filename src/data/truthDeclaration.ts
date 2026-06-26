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
    label: "Koi major accident nahi hua",
    hint: "Structural damage / total loss nahi",
  },
  {
    key: "no_flood",
    label: "Flood / water damage nahi hai",
  },
  {
    key: "not_commercial",
    label: "Taxi / commercial use mein nahi chali",
  },
  {
    key: "no_major_repair",
    label: "Engine ya gearbox replace nahi hua",
  },
  {
    key: "rc_available",
    label: "Original RC aur keys available hain",
  },
  {
    key: "direct_owner",
    label: "Main direct owner hoon — broker nahi",
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
