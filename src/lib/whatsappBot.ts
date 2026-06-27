import type { Language } from "@/data/i18n/translations";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://oldcarbazar.com";

/** Business WhatsApp number (India). Set in env for production. */
export const WHATSAPP_BOT_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_BOT_PHONE?.replace(/\D/g, "") || "919876543210";

export type WhatsAppBotIntent = "sell" | "buy" | "loan" | "help";

type MessageInput = {
  intent: WhatsAppBotIntent;
  language: Language;
  city?: string;
};

const messages: Record<Language, Record<WhatsAppBotIntent, (city?: string) => string>> = {
  en: {
    sell: () =>
      [
        "Hi Old Car Bazar! I want to *SELL* my car.",
        "",
        "Car: (e.g. Maruti Swift VXI)",
        "Year:",
        "Kms driven:",
        "Fuel / Transmission:",
        "Asking price: ₹",
        "City:",
        "",
        "I will share photos in the next message.",
      ].join("\n"),
    buy: (city) =>
      [
        "Hi Old Car Bazar! I want to *BUY* a used car.",
        "",
        `City: ${city || "(your city)"}`,
        "Budget: ₹",
        "Brand / model:",
        "Fuel preference:",
        "",
        "Please send matching listings. Thank you!",
      ].join("\n"),
    loan: () =>
      [
        "Hi Old Car Bazar! I need help with a *USED CAR LOAN*.",
        "",
        "Car price / budget: ₹",
        "Down payment: ₹",
        "Employment: Salaried / Self-employed",
        "City:",
        "",
        "Please check eligibility with partner banks.",
      ].join("\n"),
    help: () =>
      [
        "Hi Old Car Bazar! I need *HELP*.",
        "",
        "My question:",
        "",
        `Website: ${SITE_URL}`,
      ].join("\n"),
  },
  hi: {
    sell: () =>
      [
        "नमस्ते Old Car Bazar! मैं अपनी गाड़ी *बेचना* चाहता/चाहती हूँ।",
        "",
        "गाड़ी: (जैसे Maruti Swift VXI)",
        "साल:",
        "कितने km चली:",
        "Fuel / Transmission:",
        "कीमत: ₹",
        "शहर:",
        "",
        "फोटो अगले message में भेजूंगा/भेजूंगी।",
      ].join("\n"),
    buy: (city) =>
      [
        "नमस्ते Old Car Bazar! मुझे *पुरानी कार खरीदनी* है।",
        "",
        `शहर: ${city || "(आपका शहर)"}`,
        "बजट: ₹",
        "Brand / model:",
        "Fuel:",
        "",
        "कृपया matching listings भेजें। धन्यवाद!",
      ].join("\n"),
    loan: () =>
      [
        "नमस्ते Old Car Bazar! मुझे *यूज़्ड कार लोन* में मदद चाहिए।",
        "",
        "कार की कीमत / बजट: ₹",
        "Down payment: ₹",
        "नौकरी: Salaried / Self-employed",
        "शहर:",
        "",
        "कृपया partner banks पर eligibility check करें।",
      ].join("\n"),
    help: () =>
      [
        "नमस्ते Old Car Bazar! मुझे *मदद* चाहिए।",
        "",
        "मेरा सवाल:",
        "",
        `Website: ${SITE_URL}`,
      ].join("\n"),
  },
};

export function buildWhatsAppBotMessage({
  intent,
  language,
  city,
}: MessageInput): string {
  return messages[language][intent](city);
}

export function getWhatsAppBotUrl(input: MessageInput): string {
  const text = encodeURIComponent(buildWhatsAppBotMessage(input));
  return `https://wa.me/${WHATSAPP_BOT_PHONE}?text=${text}`;
}

export function openWhatsAppBot(input: MessageInput) {
  window.open(getWhatsAppBotUrl(input), "_blank", "noopener,noreferrer");
}
