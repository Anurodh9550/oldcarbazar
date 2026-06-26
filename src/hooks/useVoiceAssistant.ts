"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: {
    resultIndex: number;
    results: { length: number; [index: number]: { isFinal: boolean; 0: { transcript: string } } };
  }) => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang === "hi-IN") ??
    voices.find((v) => v.lang.startsWith("hi")) ??
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => v.lang.startsWith("en-IN")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0]
  );
}

const READ_ALOUD_KEY = "ocb-ai-read-aloud";

export function useVoiceAssistant() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [readAloud, setReadAloudState] = useState(true);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor() && "speechSynthesis" in window);
    try {
      const saved = localStorage.getItem(READ_ALOUD_KEY);
      if (saved === "0") setReadAloudState(false);
    } catch {
      /* private browsing */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const setReadAloud = useCallback((value: boolean) => {
    setReadAloudState(value);
    try {
      localStorage.setItem(READ_ALOUD_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (!value) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!readAloud || typeof window === "undefined" || !window.speechSynthesis) return;
      const clean = text.replace(/\n+/g, ". ").trim();
      if (!clean) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      const voice = pickVoice(voicesRef.current);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "hi-IN";
      }
      utterance.rate = 0.96;
      utterance.pitch = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [readAloud]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) return;

      stopSpeaking();
      stopListening();

      const recognition = new Ctor();
      recognitionRef.current = recognition;
      recognition.lang = "hi-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setInterim("");
      };

      recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const part = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += part;
          else interimText += part;
        }
        if (interimText) setInterim(interimText);
        if (finalText.trim()) {
          setInterim("");
          onResult(finalText.trim());
        }
      };

      recognition.onerror = () => {
        setListening(false);
        setInterim("");
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setListening(false);
        setInterim("");
        recognitionRef.current = null;
      };

      try {
        recognition.start();
      } catch {
        setListening(false);
        recognitionRef.current = null;
      }
    },
    [stopListening, stopSpeaking]
  );

  const toggleListening = useCallback(
    (onResult: (transcript: string) => void) => {
      if (listening) stopListening();
      else startListening(onResult);
    },
    [listening, startListening, stopListening]
  );

  useEffect(() => () => {
    stopListening();
    stopSpeaking();
  }, [stopListening, stopSpeaking]);

  return {
    supported,
    listening,
    speaking,
    readAloud,
    setReadAloud,
    interim,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
  };
}
