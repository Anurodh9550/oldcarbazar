import type { TruthDeclaration } from "@/data/truthDeclaration";
import { TRUTH_QUESTIONS } from "@/data/truthDeclaration";

type Props = {
  value: TruthDeclaration;
  onChange: (next: TruthDeclaration) => void;
};

export default function TruthDeclarationForm({ value, onChange }: Props) {
  const toggle = (key: keyof TruthDeclaration) => {
    onChange({ ...value, [key]: !value[key] });
  };

  const allChecked = TRUTH_QUESTIONS.every((q) => value[q.key]);

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Gaadi Ki Sachchai
        </p>
        <p className="mt-1 text-sm text-gray-700">
          Buyers ko transparent information — sab statements confirm karein.
        </p>
      </div>

      <ul className="space-y-2">
        {TRUTH_QUESTIONS.map((q) => (
          <li key={q.key}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white bg-white/80 px-3 py-2.5 text-sm shadow-sm">
              <input
                type="checkbox"
                checked={value[q.key]}
                onChange={() => toggle(q.key)}
                className="mt-0.5 accent-emerald-600"
              />
              <span>
                <span className="font-semibold text-gray-900">{q.label}</span>
                {q.hint && (
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {q.hint}
                  </span>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm ${
          allChecked
            ? "border-emerald-300 bg-white"
            : "border-gray-200 bg-gray-50 opacity-80"
        }`}
      >
        <input
          type="checkbox"
          disabled={!allChecked}
          checked={value.confirmed}
          onChange={() => toggle("confirmed")}
          className="mt-0.5 accent-emerald-600"
        />
        <span className="font-semibold text-gray-900">
          Main confirm karta/karti hoon ki upar di gayi jaankari sach hai.
        </span>
      </label>
    </div>
  );
}
