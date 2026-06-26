"use client";

import { useRouter } from "next/navigation";
import { useLocation } from "@/context/LocationContext";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import {
  parseVoiceCarQuery,
  voiceParamsToSearchUrl,
} from "@/lib/parseVoiceCarQuery";

type VoiceCarSearchButtonProps = {
  className?: string;
  label?: string;
};

export default function VoiceCarSearchButton({
  className = "",
  label = "Bol kar dhoondo",
}: VoiceCarSearchButtonProps) {
  const router = useRouter();
  const { selectedCity } = useLocation();
  const { supported, listening, toggleListening } = useVoiceAssistant();

  if (!supported) return null;

  const handleMic = () => {
    toggleListening((transcript) => {
      const params = parseVoiceCarQuery(transcript, selectedCity);
      router.push(voiceParamsToSearchUrl(params));
    });
  };

  return (
    <button
      type="button"
      onClick={handleMic}
      aria-pressed={listening}
      title={listening ? "Sun raha hoon…" : "Voice se car search karein"}
      className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        listening
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-white/40 bg-white/10 text-white hover:bg-white/20"
      } ${className}`}
    >
      {listening && (
        <span className="absolute inset-0 animate-ping rounded-full bg-red-300/30" />
      )}
      <span className="relative text-base" aria-hidden>
        🎤
      </span>
      <span className="relative">{listening ? "Boliye…" : label}</span>
    </button>
  );
}
