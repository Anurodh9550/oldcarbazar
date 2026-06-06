import Constants from "expo-constants";

const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const fromExtra = (
  Constants.expoConfig?.extra as { apiUrl?: string } | undefined
)?.apiUrl?.replace(/\/$/, "");

/** Django REST API base — same backend as the Next.js website. */
export const API_BASE =
  fromEnv || fromExtra || "https://backend-oldcarbazar.onrender.com/api/v1";
