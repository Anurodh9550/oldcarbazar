"use client";

import { useLanguage, useSiteCopy } from "@/context/LanguageContext";
import { useLocation } from "@/context/LocationContext";
import { openWhatsAppBot } from "@/lib/whatsappBot";
import WhatsAppIcon from "@/components/WhatsAppIcon";

type ActionCardProps = {
  title: string;
  desc: string;
  btn: string;
  onClick: () => void;
  accent?: "green" | "orange";
};

function ActionCard({ title, desc, btn, onClick, accent = "green" }: ActionCardProps) {
  const btnClass =
    accent === "green"
      ? "bg-emerald-600 hover:bg-emerald-500"
      : "bg-[#f75d34] hover:bg-[#e54d24]";

  return (
    <div className="card-surface flex h-full flex-col p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{desc}</p>
      <button
        type="button"
        onClick={onClick}
        className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${btnClass}`}
      >
        <WhatsAppIcon size={20} variant="light" aria-hidden />
        {btn}
      </button>
    </div>
  );
}

export default function WhatsAppSellContent() {
  const copy = useSiteCopy();
  const { language } = useLanguage();
  const { selectedCity } = useLocation();
  const wa = copy.whatsapp;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <ActionCard
          title={wa.sellTitle}
          desc={wa.sellDesc}
          btn={wa.sellBtn}
          onClick={() => openWhatsAppBot({ intent: "sell", language })}
        />
        <ActionCard
          title={wa.buyTitle}
          desc={wa.buyDesc}
          btn={wa.buyBtn}
          accent="orange"
          onClick={() =>
            openWhatsAppBot({ intent: "buy", language, city: selectedCity })
          }
        />
        <ActionCard
          title={wa.loanTitle}
          desc={wa.loanDesc}
          btn={wa.loanBtn}
          onClick={() => openWhatsAppBot({ intent: "loan", language })}
        />
        <ActionCard
          title={wa.helpTitle}
          desc={wa.helpDesc}
          btn={wa.helpBtn}
          onClick={() => openWhatsAppBot({ intent: "help", language })}
        />
      </div>

      <section className="card-surface mt-8 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">{wa.howTitle}</h2>
        <ol className="mt-4 space-y-3">
          {wa.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-gray-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {wa.note}
        </p>
      </section>
    </div>
  );
}
