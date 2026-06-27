"use client";

import { useLanguage } from "@/context/LanguageContext";

type LanguageToggleProps = {
  className?: string;
  compact?: boolean;
};

export default function LanguageToggle({
  className = "",
  compact = false,
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`flex shrink-0 items-center rounded-full border border-gray-200 bg-gray-50 p-0.5 text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-full transition ${
          compact ? "px-2 py-0.5" : "px-2.5 py-1"
        } ${
          language === "en"
            ? "bg-[#f75d34] text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`rounded-full transition ${
          compact ? "px-2 py-0.5" : "px-2.5 py-1"
        } ${
          language === "hi"
            ? "bg-[#f75d34] text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        हिं
      </button>
    </div>
  );
}
