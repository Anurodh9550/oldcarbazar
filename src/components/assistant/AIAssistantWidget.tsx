"use client";

import { FormEvent, useRef, useState } from "react";
import { api } from "@/lib/api";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const QUICK_QUESTIONS = [
  "5 lakh me best used car kaunsi?",
  "Apni car kaise sell karun?",
  "EMI kaise calculate hoti hai?",
  "RC transfer process kya hai?",
];

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Namaste! Main Old Car Bazar AI assistant hoon. Buy, sell, EMI, loan, RC transfer ya listing se related kuch bhi poochiye.",
};

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text: question }]);
    setLoading(true);
    try {
      const data = await api.askAssistant(question);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: data.reply || "Sorry, mujhe clear answer nahi mila.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: "Assistant se connect nahi ho pa raha. Thodi der baad try karein.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[520px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-[#ff8a5c] via-[#f75d34] to-[#d8431d] px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">Old Car Bazar AI</p>
                <p className="text-xs text-white/85">Buy, sell, loan aur support help</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25"
              >
                Close
              </button>
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
              </div>
            ))}
            {loading && (
              <div className="inline-flex rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                Typing...
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void ask(q)}
                  className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#f75d34]"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Apna question likhiye..."
                className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/15"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
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
