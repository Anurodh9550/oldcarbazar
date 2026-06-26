"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import {
  loanToolsNavGroups,
  type LoanToolsPageId,
} from "@/data/loanToolsPages";
import {
  type FeatureBlock,
  type LoanToolsContent as LoanToolsContentType,
  type LoanToolsHeroMeta,
} from "@/data/loanToolsAdmin";
import { ArrowUpRightIcon } from "./icons";

const TABS = [
  { id: "options" as const, label: "Options by Features" },
  { id: "banks" as const, label: "Bank Offers" },
  { id: "benefits" as const, label: "Loan Benefits" },
  { id: "docs" as const, label: "Required Documents" },
  { id: "assured" as const, label: "Assured Features" },
];

type TabId = (typeof TABS)[number]["id"];

const groupHrefs: Record<LoanToolsPageId, string> = {
  "used-car-loan": "/used-car-loan",
  "loan-marketplace": "/loan-marketplace",
  "emi-calculator": "/emi-calculator",
  "loan-eligibility": "/loan-eligibility",
  "compare-loans": "/compare-loans",
  "cost-of-ownership": "/cost-of-ownership",
  compare: "/compare",
  "history-report": "/history-report",
  assured: "/assured",
};

function buildOptionsByFeatures(content: LoanToolsContentType) {
  return loanToolsNavGroups.flatMap((group) =>
    group.links.map((link) => ({
      id: link.id,
      icon: link.icon,
      group: group.title,
      label: link.label,
      hero: content.heroes[link.id],
      href: groupHrefs[link.id],
    }))
  );
}

export default function LoanToolsContent() {
  const {
    loanToolsContent,
    updateLoanToolsContent,
    resetLoanToolsContent,
    logActivity,
  } = useAdmin();

  // Local draft state — admin edits stay in form until they hit "Save".
  const [draft, setDraft] = useState<LoanToolsContentType>(loanToolsContent);
  const [activeTab, setActiveTab] = useState<TabId>("options");
  const [saved, setSaved] = useState(false);

  // Re-sync draft if the underlying content changes (e.g. reset elsewhere or
  // localStorage hydration finishes after first render).
  useEffect(() => {
    setDraft(loanToolsContent);
  }, [loanToolsContent]);

  const options = useMemo(() => buildOptionsByFeatures(draft), [draft]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(loanToolsContent),
    [draft, loanToolsContent]
  );

  const handleSave = () => {
    updateLoanToolsContent(draft);
    logActivity(
      "settings-updated",
      "Loan & Tools content updated (Options by Features)"
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetLoanToolsContent();
    logActivity("settings-updated", "Loan & Tools content reset to defaults");
  };

  const updateHero = (id: LoanToolsPageId, patch: Partial<LoanToolsHeroMeta>) =>
    setDraft((prev) => ({
      ...prev,
      heroes: { ...prev.heroes, [id]: { ...prev.heroes[id], ...patch } },
    }));

  const updateBank = (
    idx: number,
    patch: Partial<LoanToolsContentType["banks"][number]>
  ) =>
    setDraft((prev) => ({
      ...prev,
      banks: prev.banks.map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    }));

  const removeBank = (idx: number) =>
    setDraft((prev) => ({
      ...prev,
      banks: prev.banks.filter((_, i) => i !== idx),
    }));

  const addBank = () =>
    setDraft((prev) => ({
      ...prev,
      banks: [
        ...prev.banks,
        {
          name: "New Bank",
          rate: "10.00% – 14.00%",
          processing: "Up to 1%",
          tenure: "12 – 84 months",
        },
      ],
    }));

  const updateFeatureList = (
    key: "benefits" | "assuredFeatures",
    idx: number,
    patch: Partial<FeatureBlock>
  ) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    }));

  const removeFeatureItem = (
    key: "benefits" | "assuredFeatures",
    idx: number
  ) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));

  const addFeatureItem = (key: "benefits" | "assuredFeatures") =>
    setDraft((prev) => ({
      ...prev,
      [key]: [
        ...prev[key],
        { icon: "✨", title: "New highlight", desc: "Describe the feature" },
      ],
    }));

  const updateDoc = (idx: number, value: string) =>
    setDraft((prev) => ({
      ...prev,
      docs: prev.docs.map((d, i) => (i === idx ? value : d)),
    }));

  const removeDoc = (idx: number) =>
    setDraft((prev) => ({
      ...prev,
      docs: prev.docs.filter((_, i) => i !== idx),
    }));

  const addDoc = () =>
    setDraft((prev) => ({ ...prev, docs: [...prev.docs, "New document"] }));

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="dark-surface border-b border-slate-100 bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-6 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
            Public site
          </p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
            Loan &amp; Tools — Option by Features
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Manage everything that powers the Loan &amp; Car-Tools hub: feature
            titles, hero copy, bank offers, eligibility benefits, document
            checklist and assured-car highlights. Changes go live on the
            storefront immediately.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="/used-car-loan"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Open public hub <ArrowUpRightIcon className="h-3 w-3" />
            </a>
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-semibold text-orange-200 ring-1 ring-orange-300/30">
              {options.length} active features
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              activeTab === t.id
                ? "bg-[#f75d34] text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "options" && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Options by Features
              </h3>
              <p className="mt-1 max-w-2xl text-xs text-slate-500">
                Each card below corresponds to a public-site feature. Edit the
                badge, title, subtitle and description that visitors see at the
                top of every Loan &amp; Tools page.
              </p>
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-2">
            {options.map((opt) => (
              <article
                key={opt.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg ring-1 ring-slate-200">
                      {opt.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                        {opt.group}
                      </p>
                      <p className="truncate text-sm font-bold text-slate-900">
                        {opt.label}
                      </p>
                    </div>
                  </div>
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-[#f75d34]"
                    title="Preview"
                  >
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                </header>
                <div className="space-y-3 p-4">
                  <TextField
                    label="Badge"
                    value={opt.hero.badge}
                    onChange={(v) => updateHero(opt.id, { badge: v })}
                  />
                  <TextField
                    label="Title"
                    value={opt.hero.title}
                    onChange={(v) => updateHero(opt.id, { title: v })}
                  />
                  <TextareaField
                    label="Subtitle"
                    value={opt.hero.subtitle}
                    rows={2}
                    onChange={(v) => updateHero(opt.id, { subtitle: v })}
                  />
                  <TextareaField
                    label="SEO description"
                    value={opt.hero.description}
                    rows={2}
                    onChange={(v) => updateHero(opt.id, { description: v })}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "banks" && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bank &amp; NBFC Offers
              </h3>
              <p className="mt-1 max-w-2xl text-xs text-slate-500">
                Shown on the Used Car Loan and Compare Rates pages. Keep rates
                current to avoid mis-selling.
              </p>
            </div>
            <button
              type="button"
              onClick={addBank}
              className="rounded-xl border border-dashed border-[#f75d34] px-4 py-2 text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
            >
              + Add lender
            </button>
          </header>
          <div className="space-y-3">
            {draft.banks.map((bank, idx) => (
              <div
                key={`${bank.name}-${idx}`}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.4fr_1.2fr_1fr_1fr_1.4fr_auto]"
              >
                <TextField
                  label="Lender"
                  value={bank.name}
                  onChange={(v) => updateBank(idx, { name: v })}
                />
                <TextField
                  label="Interest rate"
                  value={bank.rate}
                  onChange={(v) => updateBank(idx, { rate: v })}
                />
                <TextField
                  label="Processing fee"
                  value={bank.processing}
                  onChange={(v) => updateBank(idx, { processing: v })}
                />
                <TextField
                  label="Tenure"
                  value={bank.tenure}
                  onChange={(v) => updateBank(idx, { tenure: v })}
                />
                <TextField
                  label="Highlight (optional)"
                  value={bank.highlight ?? ""}
                  onChange={(v) =>
                    updateBank(idx, { highlight: v.trim() ? v : undefined })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeBank(idx)}
                  className="self-end rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            {draft.banks.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No lenders yet — click <strong>Add lender</strong>.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === "benefits" && (
        <FeatureEditor
          title="Loan Benefits"
          subtitle="Bullet highlights shown on the Used Car Loan landing page."
          items={draft.benefits}
          onAdd={() => addFeatureItem("benefits")}
          onUpdate={(idx, patch) => updateFeatureList("benefits", idx, patch)}
          onRemove={(idx) => removeFeatureItem("benefits", idx)}
        />
      )}

      {activeTab === "assured" && (
        <FeatureEditor
          title="Assured Cars — Feature blocks"
          subtitle="The promise grid on the /assured page."
          items={draft.assuredFeatures}
          onAdd={() => addFeatureItem("assuredFeatures")}
          onUpdate={(idx, patch) =>
            updateFeatureList("assuredFeatures", idx, patch)
          }
          onRemove={(idx) => removeFeatureItem("assuredFeatures", idx)}
        />
      )}

      {activeTab === "docs" && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Required Documents
              </h3>
              <p className="mt-1 max-w-2xl text-xs text-slate-500">
                The doc checklist shown to buyers applying for a used-car loan.
              </p>
            </div>
            <button
              type="button"
              onClick={addDoc}
              className="rounded-xl border border-dashed border-[#f75d34] px-4 py-2 text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
            >
              + Add document
            </button>
          </header>
          <ul className="space-y-2">
            {draft.docs.map((doc, idx) => (
              <li
                key={`doc-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => updateDoc(idx, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                />
                <button
                  type="button"
                  onClick={() => removeDoc(idx)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {draft.docs.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              No documents listed.
            </p>
          )}
        </section>
      )}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!isDirty}
          className="rounded-xl bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e54d24] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save changes
        </motion.button>
        <button
          type="button"
          onClick={() => setDraft(loanToolsContent)}
          disabled={!isDirty}
          className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-amber-200 px-6 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
        >
          Reset to defaults
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold text-emerald-600"
          >
            ✓ Saved — live on storefront
          </motion.span>
        )}
        {isDirty && !saved && (
          <span className="text-xs font-semibold text-amber-600">
            Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
}

function FeatureEditor({
  title,
  subtitle,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  subtitle: string;
  items: FeatureBlock[];
  onAdd: () => void;
  onUpdate: (idx: number, patch: Partial<FeatureBlock>) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl border border-dashed border-[#f75d34] px-4 py-2 text-sm font-semibold text-[#f75d34] hover:bg-orange-50"
        >
          + Add item
        </button>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, idx) => (
          <div
            key={`feat-${idx}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="grid grid-cols-[80px_1fr_auto] gap-3">
              <TextField
                label="Icon"
                value={item.icon}
                onChange={(v) => onUpdate(idx, { icon: v })}
              />
              <TextField
                label="Title"
                value={item.title}
                onChange={(v) => onUpdate(idx, { title: v })}
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="self-end rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <TextareaField
              label="Description"
              value={item.desc}
              rows={2}
              onChange={(v) => onUpdate(idx, { desc: v })}
            />
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
          No items yet — add your first highlight.
        </p>
      )}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-600">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  rows = 3,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mt-3 block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-600">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
      />
    </label>
  );
}
