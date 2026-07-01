"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useChromeCopy } from "@/context/LanguageContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { api } from "@/lib/api";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const QUICK_QUESTIONS = [
  "Best used car under ₹5 lakh?",
  "How do I sell my car?",
  "How is EMI calculated?",
  "What is the RC transfer process?",
];

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm the Old Car Bazar AI assistant. Ask me about buying, selling, EMI, loans, RC transfer, or your listings. You can type or use the mic.",
};

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
    </svg>
  );
}

function SpeakerIcon({ className, off }: { className?: string; off?: boolean }) {
  if (off) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export default function AIAssistantWidget() {
  const pathname = usePathname();
  const copy = useChromeCopy();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<(text: string) => Promise<void>>(async () => {});

  const {
    supported: voiceSupported,
    listening,
    speaking,
    readAloud,
    setReadAloud,
    interim,
    speak,
    stopSpeaking,
    stopListening,
    toggleListening,
  } = useVoiceAssistant();

  const ask = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || loading) return;

      stopListening();
      stopSpeaking();
      setInput("");
      setMessages((prev) => [...prev, { id: makeId(), role: "user", text: question }]);
      setLoading(true);

      try {
        const data = await api.askAssistant(question);
        const reply = data.reply || "Sorry, I couldn't find a clear answer.";
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: "assistant", text: reply },
        ]);
        speak(reply);
      } catch {
        const err =
          "Could not reach the assistant. Please try again in a moment.";
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: "assistant", text: err },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [loading, speak, stopListening, stopSpeaking]
  );

  askRef.current = ask;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, interim]);

  useEffect(() => {
    if (!open) {
      stopListening();
      stopSpeaking();
    }
  }, [open, stopListening, stopSpeaking]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  const handleMic = () => {
    if (!voiceSupported) return;
    toggleListening((transcript) => {
      setInput(transcript);
      void askRef.current(transcript);
    });
  };

  const displayInput = listening && interim ? interim : input;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {pathname !== "/whatsapp-sell" && !pathname?.startsWith("/admin") && (
        <Link
          href="/whatsapp-sell"
          className="flex items-center gap-2 rounded-full border border-emerald-500 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
        >
          <WhatsAppIcon size={18} />
          <span className="max-w-[9rem] truncate sm:max-w-none">{copy.whatsapp.navLabel}</span>
        </Link>
      )}

      {open && (
        <div className="mb-3 flex h-[520px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-[#ff8a5c] via-[#f75d34] to-[#d8431d] px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">Old Car Bazar AI</p>
                <p className="text-xs text-white/85">
                  {listening
                    ? "Listening… speak now"
                    : speaking
                      ? "Playing reply…"
                      : "Type or tap the mic"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={() => setReadAloud(!readAloud)}
                    title={readAloud ? "Turn off voice reply" : "Turn on voice reply"}
                    aria-pressed={readAloud}
                    className={`rounded-full p-2 transition ${
                      readAloud
                        ? "bg-white/20 hover:bg-white/30"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <SpeakerIcon className="h-4 w-4" off={!readAloud} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-5 ${
                  message.role === "user"
                    ? "ml-auto bg-[#f75d34] text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.text}
                {message.role === "assistant" && voiceSupported && (
                  <button
                    type="button"
                    onClick={() =>
                      speaking ? stopSpeaking() : speak(message.text)
                    }
                    className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#f75d34] hover:underline"
                  >
                    <SpeakerIcon className="h-3.5 w-3.5" />
                    {speaking ? "Stop" : "Listen"}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                Typing...
              </div>
            )}
            {listening && interim && (
              <div className="ml-auto max-w-[88%] rounded-2xl border border-dashed border-[#f75d34]/40 bg-orange-50 px-3 py-2 text-sm italic text-[#f75d34]">
                {interim}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            {!voiceSupported && (
              <p className="mb-2 text-center text-[11px] text-slate-400">
                Voice input works best in Chrome or Edge.
              </p>
            )}
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void ask(q)}
                  disabled={loading || listening}
                  className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34] disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={handleMic}
                  disabled={loading}
                  title={listening ? "Stop recording" : "Ask with your voice"}
                  aria-pressed={listening}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-50 ${
                    listening
                      ? "bg-red-500 text-white shadow-lg shadow-red-200"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#f75d34] hover:text-[#f75d34]"
                  }`}
                >
                  {listening && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" />
                  )}
                  <MicIcon className="relative h-5 w-5" />
                </button>
              )}
              <input
                ref={inputRef}
                value={displayInput}
                onChange={(event) => setInput(event.target.value)}
                readOnly={listening}
                placeholder={
                  listening ? "Speak now…" : "Ask a question or use the mic"
                }
                className={`min-w-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f75d34]/15 ${
                  listening
                    ? "border-[#f75d34] bg-orange-50/50 focus:border-[#f75d34]"
                    : "border-slate-200 focus:border-[#f75d34]"
                }`}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || listening}
                className="rounded-full bg-[#f75d34] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#f75d34] px-5 py-3 text-sm font-extrabold text-white shadow-xl transition hover:bg-[#e54d24]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">AI</span>
        Help Assistant
      </button>
    </div>
  );
}
