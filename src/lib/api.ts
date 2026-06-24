"use client";

import type { CarListing } from "@/data/cars";
import type { SellCarFormData } from "@/data/sellCarForm";
import type {
  ListingModeration,
  ListingStatus,
  UserCarListing,
} from "@/types/listing";
import type {
  AdminActivity,
  AdminActivityType,
  AdminRole,
  AdminUser,
  Inquiry,
  InquiryStatus,
} from "@/types/admin";
import type { LoanToolsContent } from "@/data/loanToolsAdmin";
import type {
  Offer,
  OfferStatus,
  TestDriveBooking,
  TestDriveStatus,
} from "@/types/engagement";
import type {
  CreateLoanInquiryPayload,
  LoanEmploymentType,
  LoanInquiry,
  LoanInquiryStatus,
} from "@/types/loanInquiry";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v1";

const ACCESS_TOKEN_KEY = "oldCarBazar_access_token";
const REFRESH_TOKEN_KEY = "oldCarBazar_refresh_token";
const ADMIN_ACCESS_TOKEN_KEY = "oldCarBazar_admin_access_token";
const ADMIN_REFRESH_TOKEN_KEY = "oldCarBazar_admin_refresh_token";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  avatar_url?: string;
  role: "buyer" | "seller" | "both";
  status: "active" | "blocked";
  login_count?: number;
  last_login_at?: string | null;
  date_joined?: string;
};

type AuthResponse = {
  access: string;
  refresh: string;
  user: ApiUser;
};

type AdminAuthResponse = {
  access: string;
  refresh: string;
  admin: ApiAdmin;
};

type ApiAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar_url?: string;
  last_login_at?: string | null;
  created_at?: string;
};

type ApiActivity = {
  id: string;
  type: AdminActivityType;
  message: string;
  target?: string;
  actor_admin_name?: string | null;
  created_at: string;
};

type ApiInquiry = {
  id: string;
  listing: string;
  listing_title: string;
  listing_price: string;
  buyer?: string | null;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string | null;
  seller?: string | null;
  seller_name: string;
  message: string;
  channel: "whatsapp" | "call" | "form" | "chat";
  status: InquiryStatus;
  city?: string;
  created_at: string;
  updated_at: string;
};

export type SellerLeadType =
  | "view"
  | "inquiry"
  | "whatsapp"
  | "call"
  | "offer"
  | "test_drive";

export type SellerLead = {
  id: string;
  type: SellerLeadType;
  listing_id: string;
  listing_title: string;
  listing_price: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  amount: number | null;
  status: string;
  city: string;
  created_at: string;
};

export type SellerLeadListing = {
  listing_id: string;
  listing_title: string;
  listing_price: string;
  views: number;
  inquiries: number;
  offers: number;
  test_drives: number;
  total: number;
};

export type SellerLeadsResponse = {
  summary: {
    views: number;
    inquiries: number;
    offers: number;
    test_drives: number;
    total: number;
    new_inquiries: number;
  };
  per_listing: SellerLeadListing[];
  leads: SellerLead[];
};

type ApiSettings = {
  auto_approve_listings: boolean;
  maintenance_mode: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  whatsapp_enabled: boolean;
  max_photos_per_listing: number;
  min_listing_price: number;
  max_listing_price: number;
  blocked_keywords: string[];
  support_email: string;
  support_phone: string;
  brand_color: string;
  loan_tools_content?: Partial<LoanToolsContent> | null;
  ads?: unknown[];
};

type ApiPhoto = {
  id: string;
  url: string;
  position: number;
  is_cover: boolean;
};

export type ApiListing = {
  id: string;
  seller_id?: string | null;
  seller_name: string;
  seller_phone: string;
  seller_email?: string | null;
  title: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price_label: string;
  price_inr: string;
  kms: number;
  fuel: string;
  transmission: string;
  owners: string;
  ownership?: string;
  body_type?: string;
  color?: string;
  seats?: number;
  engine_cc?: string;
  mileage?: string;
  registration_month?: string;
  reg_number?: string;
  insurance?: string;
  location: string;
  area?: string;
  description?: string;
  features?: string[];
  cover_image?: string;
  photos?: ApiPhoto[];
  status: ListingStatus;
  moderation: ListingModeration;
  rejected_reason?: string;
  featured?: boolean;
  flagged?: boolean;
  flag_reason?: string;
  whatsapp?: boolean;
  views?: number;
  inquiries_count?: number;
  boosted_until?: string | null;
  is_boosted?: boolean;
  created_at?: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiPlan = {
  code: string;
  name: string;
  price_inr: number;
  duration_days: number;
  listing_limit: number | null;
  perks: string[];
};

export type SubscriptionStatus = {
  plan: string;
  plan_name: string;
  listings_used: number;
  listings_limit: number | null;
  is_unlimited: boolean;
  can_publish: boolean;
  started_at: string | null;
  expires_at: string | null;
  free_listing_limit: number;
};

export type ApiSubscriptionRecord = {
  id: string;
  plan: string;
  amount_inr: number;
  status: "active" | "expired" | "cancelled" | "pending";
  started_at: string;
  expires_at: string;
  provider: string;
  provider_payment_id: string;
  created_at: string;
  updated_at: string;
};

export type InvoicePayload = {
  subscription_id: string;
  invoice_number: string;
  receipt: string;
  issued_at: string;
  plan_code: string;
  plan_name: string;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  currency: string;
  status: "active" | "expired" | "cancelled" | "pending";
  started_at: string;
  expires_at: string;
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    gstin: string;
  };
  seller: {
    name: string;
    address: string;
    email: string;
    website: string;
    gstin: string;
  };
};

export type RazorpayCheckoutOrder = {
  key_id: string;
  order_id: string;
  amount: number;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  seller_gstin: string;
  customer_gstin: string;
  currency: string;
  plan: ApiPlan;
  name: string;
  email: string | null;
  contact: string;
};

export type RazorpayVerifyPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type BoostPackage = {
  code: string;
  name: string;
  price_inr: number;
  duration_days: number;
  perks: string[];
};

export type BoostCheckoutOrder = {
  key_id: string;
  order_id: string;
  amount: number;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  seller_gstin: string;
  customer_gstin: string;
  currency: string;
  package: BoostPackage;
  listing_id: string;
  name: string;
  email: string | null;
  contact: string;
};

export type BoostInvoicePayload = {
  boost_order_id: string;
  invoice_number: string;
  receipt: string;
  issued_at: string;
  package: string;
  package_name: string;
  duration_days: number;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  currency: string;
  status: "created" | "paid" | "failed";
  boosted_until: string | null;
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  listing_id: string;
  listing_title: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    gstin: string;
  };
  seller: {
    name: string;
    address: string;
    email: string;
    website: string;
    gstin: string;
  };
};

export type AdminSubscriptionPayment = {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  plan: string;
  plan_name: string;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  seller_gstin: string;
  customer_gstin: string;
  status: "active" | "expired" | "cancelled" | "pending";
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  receipt: string;
  invoice_number: string;
  started_at: string;
  expires_at: string;
  created_at: string;
};

export type AdminBoostPayment = {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  listing_id: string;
  listing_title: string;
  package: string;
  duration_days: number;
  amount_inr: number;
  base_inr: number;
  gst_inr: number;
  gst_rate: number;
  seller_gstin: string;
  customer_gstin: string;
  status: "created" | "paid" | "failed";
  razorpay_order_id: string;
  razorpay_payment_id: string;
  receipt: string;
  invoice_number: string;
  boosted_until: string | null;
  created_at: string;
};

export type AdminPaymentsResponse = {
  subscriptions: AdminSubscriptionPayment[];
  boosts: AdminBoostPayment[];
  summary: {
    subscriptions_count: number;
    subscriptions_revenue: number;
    boosts_count: number;
    boosts_revenue: number;
    total_revenue: number;
  };
};

export type AdminDealerOfferCampaign = {
  enabled: boolean;
  default_plan_code: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta_label: string;
  cta_href: string;
  max_grants: number;
};

export type AdminDealerOffersResponse = {
  campaign: AdminDealerOfferCampaign;
  plans: ApiPlan[];
  active_grants: {
    subscription_id: string;
    user_id: string;
    user_name: string;
    user_phone: string;
    user_email: string;
    user_city: string;
    plan: string;
    plan_name: string;
    listings_count: number;
    started_at: string;
    expires_at: string;
    provider: string;
  }[];
  stats: {
    grants_used: number;
    max_grants: number;
    slots_remaining: number | null;
  };
};

export type AdminGrantSubscriptionResult = {
  subscription_id: string;
  plan: string;
  plan_name: string;
  expires_at: string;
};

export type ApiDealerCard = {
  id: string;
  name: string;
  primary_city: string;
  cities: string[];
  avatar_url: string;
  phone: string;
  active_listings_count: number;
  min_price_inr: string | null;
  max_price_inr: string | null;
  brands: string[];
  is_pro: boolean;
  last_listed_at: string | null;
  member_since: string;
};

export type ApiDealerDetail = ApiDealerCard & {
  listings: ApiListing[];
  total_listings_count: number;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** JWT must look like header.payload.signature (not "undefined" from a bad save). */
function isJwtShape(token: string) {
  const parts = token.split(".");
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token: string, skewMs = 30_000) {
  const exp = getTokenExpiryMs(token);
  // If we cannot read exp, still send the token — forcing refresh often
  // blacklists a valid refresh token and leaves DELETE without a header.
  if (!exp) return false;
  return Date.now() >= exp - skewMs;
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)?.trim();
  if (!token || !isJwtShape(token)) return null;
  return token;
}

/** True when a non-empty user JWT is stored (seller/buyer session). */
export function hasAccessToken() {
  return Boolean(getAccessToken());
}

/** Refresh the access token when it is missing or expired. */
export async function ensureValidAccessToken(): Promise<boolean> {
  const token = getAccessToken();
  if (token && !isAccessTokenExpired(token)) return true;
  const next = await refreshAccessToken();
  return Boolean(next);
}

function notifyAuthChanged() {
  if (isBrowser()) {
    window.dispatchEvent(new Event("ocb-auth-changed"));
  }
}

export function saveTokens(access: string, refresh: string) {
  if (!isBrowser()) {
    throw new Error("Cannot save session outside the browser.");
  }
  const cleanAccess = access?.trim().replace(/^"|"$/g, "");
  const cleanRefresh = refresh?.trim().replace(/^"|"$/g, "");
  if (!isJwtShape(cleanAccess) || !cleanRefresh) {
    throw new Error("Login response did not include valid session tokens.");
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, cleanAccess);
  localStorage.setItem(REFRESH_TOKEN_KEY, cleanRefresh);
  notifyAuthChanged();
}

export function clearTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Also flush any cached user/listing copies so the UI cannot keep showing a
  // logged-in header (and stale listings) after the JWT is gone.
  localStorage.removeItem("oldCarBazar_user");
  localStorage.removeItem("oldCarBazar_user_listings");
  notifyAuthChanged();
}

export function getAdminAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function saveAdminTokens(access: string, refresh: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, access);
  localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refresh);
}

export function clearAdminTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
}

function getRefreshToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null
        ? Object.values(data as Record<string, unknown>).flat().join(" ")
        : String(data || "Request failed");
    throw new ApiError(res.status, message || "Request failed", data);
  }

  return data as T;
}

function sessionExpiredError(data: unknown) {
  return new ApiError(
    401,
    "Your session has expired. Please log in again.",
    data
  );
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    if (isBrowser()) {
      window.dispatchEvent(new Event("ocb-auth-expired"));
    }
    return null;
  }
  const data = (await res.json()) as { access?: string; refresh?: string };
  if (!data.access) return null;

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  // ROTATE_REFRESH_TOKENS blacklists the old refresh — must persist the new one.
  if (data.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  }
  notifyAuthChanged();
  return data.access;
}

/** Routes that must work without a stored JWT (login, register, public GETs). */
function isPublicApiPath(path: string, method: string) {
  const p = path.split("?")[0];
  const m = method.toUpperCase();
  if (
    p.startsWith("/auth/login") ||
    p.startsWith("/auth/register") ||
    p.startsWith("/auth/otp/")
  ) {
    return true;
  }
  if (m === "GET" || m === "HEAD") {
    if (p === "/listings/" || p.startsWith("/listings/?")) return true;
    // Seller-only routes must stay authenticated (were wrongly matched as
    // public detail URLs because "mine" fit /listings/[id]/).
    if (p === "/listings/mine/" || p.startsWith("/listings/mine/")) return false;
    if (p.startsWith("/listings/media-config")) return true;
    // Public car detail pages use UUID primary keys.
    if (
      /^\/listings\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/$/i.test(
        p
      )
    ) {
      return true;
    }
    if (p.startsWith("/loan-tools/content")) return true;
  }
  // Public POST endpoints — anyone may submit, login enriches the FK only.
  if (m === "POST") {
    if (p === "/inquiries/") return true;
    if (p === "/test-drives/") return true;
    if (p === "/offers/") return true;
    if (p === "/loan-inquiries/") return true;
  }
  return false;
}

function logApiFailure(method: string, path: string, err: unknown) {
  if (typeof console === "undefined") return;
  if (err instanceof ApiError) {
    console.error(
      `[OCB API] ${method} ${path} → ${err.status} ${err.message}`,
      err.data
    );
  } else {
    console.error(`[OCB API] ${method} ${path} → network error`, err);
  }
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
  requireAuth = false
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const publicRoute = isPublicApiPath(path, method);
  const needsAuth = requireAuth && !publicRoute;

  // Refresh *before* protected calls when the access token is expired.
  let token = !publicRoute ? getAccessToken() : null;
  if (token && isAccessTokenExpired(token) && retry && needsAuth) {
    token = (await refreshAccessToken()) ?? null;
  }

  if (!token && retry && needsAuth) {
    // Some sessions may lose the access token while still having a valid refresh
    // token (tab restore/localStorage race). Try refresh once before logout.
    token = (await refreshAccessToken()) ?? null;
  }

  if (needsAuth && !token) {
    clearTokens();
    if (isBrowser()) {
      window.dispatchEvent(new Event("ocb-auth-expired"));
    }
    const err = sessionExpiredError(null);
    logApiFailure(method, path, err);
    throw err;
  }

  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  // Never attach a stale Bearer token to login/register — that caused 401 loops.
  if (token && !publicRoute) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: init.method,
      body: init.body,
      signal: init.signal,
      cache: init.cache,
      credentials: init.credentials,
      redirect: init.redirect,
      referrer: init.referrer,
      referrerPolicy: init.referrerPolicy,
      integrity: init.integrity,
      keepalive: init.keepalive,
      mode: init.mode,
      headers,
    });
  } catch (networkErr) {
    // Browser CORS rejection, DNS failure, offline, etc. — surface a clear
    // message so the seller knows the request never reached our backend.
    logApiFailure(method, path, networkErr);
    throw new ApiError(
      0,
      "Could not reach the server. Check your internet connection and try again.",
      networkErr
    );
  }

  if (res.status === 401 && !publicRoute) {
    // Wrong password on /auth/login returns 400, not 401 — so 401 here means
    // the stored JWT is dead. Try refresh once, then force re-login.
    if (retry && needsAuth) {
      const nextToken = await refreshAccessToken();
      if (nextToken) {
        return apiFetch<T>(path, init, false, requireAuth);
      }
    }
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : null;
    clearTokens();
    if (isBrowser()) {
      window.dispatchEvent(new Event("ocb-auth-expired"));
    }
    const err = sessionExpiredError(data);
    logApiFailure(method, path, err);
    throw err;
  }

  if (res.status === 401 && publicRoute) {
    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : null;
    const err = new ApiError(
      401,
      typeof data === "object" && data !== null && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : "Request failed.",
      data
    );
    logApiFailure(method, path, err);
    throw err;
  }

  try {
    return await parseResponse<T>(res);
  } catch (err) {
    logApiFailure(method, path, err);
    throw err;
  }
}

async function adminApiFetch<T>(
  path: string,
  init: RequestInit = {},
  requireToken = true
): Promise<T> {
  const token = getAdminAccessToken();
  if (requireToken && !token) {
    clearAdminTokens();
    throw new ApiError(
      401,
      "Admin session has expired. Please log in again.",
      null
    );
  }
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
    });
  } catch (networkErr) {
    logApiFailure((init.method ?? "GET").toUpperCase(), path, networkErr);
    throw new ApiError(
      0,
      "Could not reach the server. Check your internet connection and try again.",
      networkErr
    );
  }

  if (res.status === 401 && requireToken) {
    clearAdminTokens();
  }

  try {
    return await parseResponse<T>(res);
  } catch (err) {
    logApiFailure((init.method ?? "GET").toUpperCase(), path, err);
    throw err;
  }
}

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

export function apiUserToUser(user: ApiUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    phone: user.phone,
  };
}

export function apiUserToRegisteredUser(user: ApiUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    phone: user.phone,
    role: user.role,
    status: user.status,
    city: user.city,
    createdAt: user.date_joined ? new Date(user.date_joined).getTime() : Date.now(),
    lastLoginAt: user.last_login_at
      ? new Date(user.last_login_at).getTime()
      : undefined,
    loginCount: user.login_count ?? 1,
  };
}

function apiAdminToAdmin(admin: ApiAdmin): AdminUser {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar_url,
    createdAt: admin.created_at ? new Date(admin.created_at).getTime() : Date.now(),
    lastLoginAt: admin.last_login_at
      ? new Date(admin.last_login_at).getTime()
      : undefined,
  };
}

function apiActivityToActivity(item: ApiActivity): AdminActivity {
  return {
    id: item.id,
    type: item.type,
    message: item.message,
    actor: item.actor_admin_name ?? "admin",
    target: item.target,
    createdAt: new Date(item.created_at).getTime(),
  };
}

export function apiInquiryToInquiry(item: ApiInquiry): Inquiry {
  return {
    id: item.id,
    listingId: item.listing,
    listingTitle: item.listing_title,
    buyerName: item.buyer_name,
    buyerPhone: item.buyer_phone,
    buyerEmail: item.buyer_email ?? undefined,
    sellerId: item.seller ?? "",
    sellerName: item.seller_name,
    message: item.message,
    channel: item.channel,
    status: item.status,
    createdAt: new Date(item.created_at).getTime(),
    city: item.city,
    price: item.listing_price,
  };
}

export function apiListingToCarListing(item: ApiListing): UserCarListing {
  const photoUrls = (item.photos ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((photo) => photo.url)
    .filter(Boolean);
  const cover = item.cover_image || photoUrls[0] || "";
  const sellerId = item.seller_id || item.seller_email || item.seller_phone || "";

  const priceMatch = /([0-9]+(?:\.[0-9]+)?)/.exec(item.price_label ?? "");
  const priceInrNumber = Number(item.price_inr);
  let priceLakh: string | undefined;
  if (priceMatch) {
    priceLakh = priceMatch[1];
  } else if (Number.isFinite(priceInrNumber) && priceInrNumber > 0) {
    priceLakh = (priceInrNumber / 100000).toString();
  }

  return {
    id: item.id,
    sellerId,
    sellerName: item.seller_name,
    phone: item.seller_phone,
    email: item.seller_email || undefined,
    title: item.title,
    specs: `${Number(item.kms).toLocaleString("en-IN")} kms • ${item.fuel} • ${item.transmission}`,
    price: item.price_label,
    location: item.location,
    badge: item.featured ? "FEATURED" : "DIRECT OWNER",
    image: cover,
    images: photoUrls.length > 0 ? photoUrls : cover ? [cover] : undefined,
    bodyType: item.body_type,
    color: item.color,
    area: item.area,
    regNumber: item.reg_number,
    ownership: item.ownership,
    registrationMonth: item.registration_month,
    insurance: item.insurance,
    seats: item.seats,
    engineCc: item.engine_cc,
    mileage: item.mileage,
    features: item.features,
    whatsapp: item.whatsapp,
    description: item.description,
    status: item.status,
    moderation: item.moderation,
    rejectedReason: item.rejected_reason,
    featured: item.featured,
    flagged: item.flagged,
    flagReason: item.flag_reason,
    brand: item.brand,
    model: item.model,
    variant: item.variant,
    year: item.year,
    kms: item.kms,
    fuel: item.fuel,
    transmission: item.transmission,
    owners: item.owners,
    priceLakh,
    city: item.location,
    createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
    views: item.views ?? 0,
    inquiries: item.inquiries_count ?? 0,
    boostedUntil: item.boosted_until ?? null,
    isBoosted:
      item.is_boosted ??
      (item.boosted_until
        ? new Date(item.boosted_until).getTime() > Date.now()
        : false),
  };
}

function formToApiPayload(form: SellCarFormData, photos: string[]) {
  return {
    brand: form.brand,
    model: form.model,
    variant: form.variant,
    year: Number(form.year),
    body_type: form.bodyType,
    color: form.color,
    fuel: form.fuel,
    transmission: form.transmission,
    kms: Number(form.kms),
    owners: form.owners,
    seats: Number(form.seats),
    registration_month: form.registrationMonth,
    engine_cc: form.engineCc,
    mileage: form.mileage,
    insurance: form.insurance,
    price: form.price,
    city: form.city,
    area: form.area,
    reg_number: form.regNumber,
    description: form.description,
    features: form.features,
    seller_name: form.sellerName,
    phone: form.phone,
    email: form.email,
    whatsapp: form.whatsapp,
    photos,
  };
}

async function dataUrlToFile(dataUrl: string, name: string) {
  const blob = await fetch(dataUrl).then((res) => res.blob());
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

export const api = {
  baseUrl: API_BASE,

  async register(payload: {
    name: string;
    email?: string;
    phone: string;
    password: string;
    city?: string;
  }) {
    // Strip empty email — backend treats missing email as NULL (allowed).
    const body: Record<string, string> = {
      name: payload.name,
      phone: payload.phone,
      password: payload.password,
    };
    if (payload.email && payload.email.trim()) body.email = payload.email.trim();
    if (payload.city && payload.city.trim()) body.city = payload.city.trim();

    clearTokens();
    const data = await apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    saveTokens(data.access, data.refresh);
    return data;
  },

  async login(identifier: string, password: string) {
    clearTokens();
    const data = await apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    saveTokens(data.access, data.refresh);
    return data;
  },

  async me() {
    return apiFetch<ApiUser>("/auth/me/", {}, true, true);
  },

  async listListings() {
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/?limit=100"
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async myListings() {
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/mine/?limit=100",
      {},
      true,
      true
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async createListing(form: SellCarFormData, photos: string[]) {
    const data = await apiFetch<ApiListing>("/listings/", {
      method: "POST",
      body: JSON.stringify(formToApiPayload(form, photos)),
    });
    return apiListingToCarListing(data);
  },

  async updateListing(id: string, form: SellCarFormData, photos: string[]) {
    const data = await apiFetch<ApiListing>(
      `/listings/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(formToApiPayload(form, photos)),
      },
      true,
      true
    );
    return apiListingToCarListing(data);
  },

  async updateListingStatus(id: string, status: ListingStatus) {
    const data = await apiFetch<ApiListing>(
      `/listings/${id}/status/`,
      {
        method: "POST",
        body: JSON.stringify({ status }),
      },
      true,
      true
    );
    return apiListingToCarListing(data);
  },

  async deleteListing(id: string) {
    await apiFetch<unknown>(
      `/listings/${id}/`,
      { method: "DELETE" },
      true,
      true
    );
  },

  async uploadMedia(file: File, folder = "old-car-bazar/listings") {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    return apiFetch<{
      secure_url: string;
      url: string;
      public_id: string;
      resource_type: string;
    }>("/listings/upload-media/", {
      method: "POST",
      body: form,
    });
  },

  async uploadListingPhotos(photos: string[]) {
    const urls: string[] = [];
    const failures: string[] = [];

    for (const [index, photo] of photos.entries()) {
      if (!photo.startsWith("data:")) {
        urls.push(photo);
        continue;
      }
      try {
        const file = await dataUrlToFile(photo, `listing-photo-${index + 1}.jpg`);
        const uploaded = await this.uploadMedia(file);
        urls.push(uploaded.secure_url || uploaded.url);
      } catch (err) {
        // Don't kill the whole submission — collect failures and continue.
        failures.push(err instanceof Error ? err.message : String(err));
        console.error(`Photo ${index + 1} upload failed:`, err);
      }
    }

    if (urls.length === 0 && photos.length > 0) {
      const first = failures[0] || "unknown error";
      throw new ApiError(
        502,
        `Photo upload failed (${first}). Please try smaller files (under 10 MB) or contact support.`,
        { failures }
      );
    }

    return urls;
  },

  async adminLogin(email: string, password: string) {
    clearAdminTokens();
    const data = await adminApiFetch<AdminAuthResponse>(
      "/admin-panel/login/",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false
    );
    if (!data.access || !data.refresh) {
      throw new ApiError(
        502,
        "Login succeeded but the server did not return session tokens.",
        data
      );
    }
    saveAdminTokens(data.access, data.refresh);
    return apiAdminToAdmin(data.admin);
  },

  async adminMe() {
    const data = await adminApiFetch<ApiAdmin>("/admin-panel/me/");
    return apiAdminToAdmin(data);
  },

  async adminSettings() {
    const data = await adminApiFetch<ApiSettings>("/admin-panel/settings/");
    return {
      autoApproveListings: data.auto_approve_listings,
      maintenanceMode: data.maintenance_mode,
      emailNotifications: data.email_notifications,
      smsNotifications: data.sms_notifications,
      whatsappEnabled: data.whatsapp_enabled,
      maxPhotosPerListing: data.max_photos_per_listing,
      minListingPrice: data.min_listing_price,
      maxListingPrice: data.max_listing_price,
      blockedKeywords: data.blocked_keywords,
      supportEmail: data.support_email,
      supportPhone: data.support_phone,
      brandColor: data.brand_color,
      loanToolsContent: data.loan_tools_content ?? null,
    };
  },

  async fetchLoanToolsContent() {
    const data = await apiFetch<{ content: Partial<LoanToolsContent> | null }>(
      "/loan-tools/content/"
    );
    return data.content;
  },

  /** Public — enabled ad banners stored on the backend (shared with the app). */
  async fetchAds() {
    const data = await apiFetch<{ ads: unknown[] }>("/ads/");
    return Array.isArray(data.ads) ? data.ads : [];
  },

  async askAssistant(message: string) {
    const data = await apiFetch<{ reply: string; configured?: boolean }>("/assistant/", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    return data;
  },

  /** Read every ad (incl. disabled) for the admin editor, via app settings. */
  async fetchAllAdsForAdmin() {
    const data = await adminApiFetch<ApiSettings>("/admin-panel/settings/");
    return Array.isArray(data.ads) ? data.ads : [];
  },

  /** Persist the full ad list to the backend so the website + app both see it. */
  async updateAds(ads: unknown[]) {
    await adminApiFetch<ApiSettings>("/admin-panel/settings/", {
      method: "PATCH",
      body: JSON.stringify({ ads }),
    });
  },

  async updateLoanToolsContent(content: LoanToolsContent) {
    await adminApiFetch<ApiSettings>("/admin-panel/settings/", {
      method: "PATCH",
      body: JSON.stringify({ loan_tools_content: content }),
    });
  },

  async updateAdminSettings(patch: Record<string, unknown>) {
    const data = await adminApiFetch<ApiSettings>("/admin-panel/settings/", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return data;
  },

  async adminActivity() {
    const data = await adminApiFetch<ApiActivity[] | Paginated<ApiActivity>>(
      "/admin-panel/activity/?limit=100"
    );
    return unwrapList(data).map(apiActivityToActivity);
  },

  async adminUsers() {
    const data = await adminApiFetch<ApiUser[] | Paginated<ApiUser>>(
      "/admin-panel/users/?limit=200"
    );
    return unwrapList(data).map(apiUserToRegisteredUser);
  },

  async adminBlockUser(id: string, blocked: boolean) {
    const data = await adminApiFetch<ApiUser>(`/admin-panel/users/${id}/block/`, {
      method: "POST",
      body: JSON.stringify({ blocked }),
    });
    return apiUserToRegisteredUser(data);
  },

  async adminDealerOffers() {
    return adminApiFetch<AdminDealerOffersResponse>("/admin-panel/dealer-offers/");
  },

  async adminUpdateDealerOfferCampaign(campaign: AdminDealerOfferCampaign) {
    const data = await adminApiFetch<{ campaign: AdminDealerOfferCampaign }>(
      "/admin-panel/dealer-offers/",
      {
        method: "PUT",
        body: JSON.stringify(campaign),
      }
    );
    return data.campaign;
  },

  async adminGrantSubscription(userId: string, plan: string, notes?: string) {
    return adminApiFetch<AdminGrantSubscriptionResult>(
      `/admin-panel/users/${userId}/grant-subscription/`,
      {
        method: "POST",
        body: JSON.stringify({ plan, notes: notes ?? "" }),
      }
    );
  },

  async adminRevokeDealerOffer(subscriptionId: string) {
    return adminApiFetch<{ ok: boolean; subscription_id: string; user_id: string }>(
      `/admin-panel/dealer-offers/${subscriptionId}/revoke/`,
      { method: "POST", body: JSON.stringify({}) }
    );
  },

  async adminListings() {
    const data = await adminApiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/?moderation=all&limit=200"
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async adminModerateListing(
    id: string,
    moderation: ListingModeration,
    reason = ""
  ) {
    const data = await adminApiFetch<ApiListing>(`/listings/${id}/moderate/`, {
      method: "POST",
      body: JSON.stringify({ status: moderation, reason }),
    });
    return apiListingToCarListing(data);
  },

  async adminFeatureListing(id: string, featured: boolean) {
    const data = await adminApiFetch<ApiListing>(`/listings/${id}/feature/`, {
      method: "POST",
      body: JSON.stringify({ featured }),
    });
    return apiListingToCarListing(data);
  },

  async adminFlagListing(id: string, reason: string) {
    const data = await adminApiFetch<ApiListing>(`/listings/${id}/flag/`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return apiListingToCarListing(data);
  },

  async adminClearFlag(id: string) {
    const data = await adminApiFetch<ApiListing>(`/listings/${id}/clear-flag/`, {
      method: "POST",
    });
    return apiListingToCarListing(data);
  },

  async adminDeleteListing(id: string) {
    await adminApiFetch<unknown>(`/listings/${id}/`, { method: "DELETE" });
  },

  async adminPayments() {
    return adminApiFetch<AdminPaymentsResponse>("/admin-panel/payments/");
  },

  // ---------------- Inquiries (buyer ↔ seller leads) ---------------- //

  async createInquiry(payload: {
    listing: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email?: string;
    message?: string;
    channel?: "whatsapp" | "call" | "form" | "chat";
  }) {
    const body: Record<string, string> = {
      listing: payload.listing,
      buyer_name: payload.buyer_name.trim(),
      buyer_phone: payload.buyer_phone,
      channel: payload.channel ?? "form",
    };
    if (payload.buyer_email && payload.buyer_email.trim()) {
      body.buyer_email = payload.buyer_email.trim();
    }
    if (payload.message && payload.message.trim()) {
      body.message = payload.message.trim();
    }
    return apiFetch<ApiInquiry>("/inquiries/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async myInquiries() {
    const data = await apiFetch<ApiInquiry[] | Paginated<ApiInquiry>>(
      "/inquiries/mine/?limit=100"
    );
    return unwrapList(data).map(apiInquiryToInquiry);
  },

  // Unified dealer/seller leads feed (views + inquiries + offers + test drives).
  async sellerLeads() {
    return apiFetch<SellerLeadsResponse>("/leads/mine/");
  },

  async adminInquiries() {
    const data = await adminApiFetch<ApiInquiry[] | Paginated<ApiInquiry>>(
      "/inquiries/?limit=200"
    );
    return unwrapList(data).map(apiInquiryToInquiry);
  },

  async adminUpdateInquiryStatus(id: string, status: InquiryStatus) {
    const data = await adminApiFetch<ApiInquiry>(`/inquiries/${id}/status/`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
    return apiInquiryToInquiry(data);
  },

  async adminDeleteInquiry(id: string) {
    await adminApiFetch<unknown>(`/inquiries/${id}/`, { method: "DELETE" });
  },

  // ---------------- Loan inquiries (used-car loan leads) ---------------- //

  async createLoanInquiry(payload: CreateLoanInquiryPayload) {
    const body: Record<string, string | number> = {
      bank_name: payload.bank_name,
      loan_partner: payload.loan_partner,
      full_name: payload.full_name.trim(),
      mobile: payload.mobile,
      email: payload.email.trim(),
      city: payload.city.trim(),
      monthly_income: payload.monthly_income,
      employment_type: payload.employment_type,
    };
    if (payload.car_budget && payload.car_budget.trim()) {
      body.car_budget = payload.car_budget.trim();
    }
    if (payload.message && payload.message.trim()) {
      body.message = payload.message.trim();
    }
    const data = await apiFetch<ApiLoanInquiry>("/loan-inquiries/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return apiLoanInquiryToLoanInquiry(data);
  },

  async adminLoanInquiries() {
    const data = await adminApiFetch<ApiLoanInquiry[] | Paginated<ApiLoanInquiry>>(
      "/loan-inquiries/?limit=500"
    );
    return unwrapList(data).map(apiLoanInquiryToLoanInquiry);
  },

  async adminUpdateLoanInquiryStatus(id: string, status: LoanInquiryStatus) {
    const data = await adminApiFetch<ApiLoanInquiry>(
      `/loan-inquiries/${id}/status/`,
      {
        method: "POST",
        body: JSON.stringify({ status }),
      }
    );
    return apiLoanInquiryToLoanInquiry(data);
  },

  async adminDeleteLoanInquiry(id: string) {
    await adminApiFetch<unknown>(`/loan-inquiries/${id}/`, { method: "DELETE" });
  },

  // ---------------- Test drive bookings ---------------- //

  async createTestDrive(payload: {
    listing: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email?: string;
    scheduled_at: string;
    location_note?: string;
    message?: string;
  }) {
    const body: Record<string, string> = {
      listing: payload.listing,
      buyer_name: payload.buyer_name.trim(),
      buyer_phone: payload.buyer_phone,
      scheduled_at: payload.scheduled_at,
    };
    if (payload.buyer_email?.trim()) body.buyer_email = payload.buyer_email.trim();
    if (payload.location_note?.trim()) body.location_note = payload.location_note.trim();
    if (payload.message?.trim()) body.message = payload.message.trim();
    const data = await apiFetch<ApiTestDrive>("/test-drives/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return apiTestDriveToTestDrive(data);
  },

  async myTestDrives() {
    const data = await apiFetch<ApiTestDrive[] | Paginated<ApiTestDrive>>(
      "/test-drives/mine/?limit=100"
    );
    return unwrapList(data).map(apiTestDriveToTestDrive);
  },

  async updateTestDriveStatus(
    id: string,
    status: TestDriveStatus,
    sellerResponse?: string
  ) {
    const body: Record<string, string> = { status };
    if (sellerResponse) body.seller_response = sellerResponse;
    const data = await apiFetch<ApiTestDrive>(`/test-drives/${id}/status/`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return apiTestDriveToTestDrive(data);
  },

  // ---------------- Offers ---------------- //

  async createOffer(payload: {
    listing: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email?: string;
    amount: number;
    message?: string;
  }) {
    const body: Record<string, string | number> = {
      listing: payload.listing,
      buyer_name: payload.buyer_name.trim(),
      buyer_phone: payload.buyer_phone,
      amount: payload.amount,
    };
    if (payload.buyer_email?.trim()) body.buyer_email = payload.buyer_email.trim();
    if (payload.message?.trim()) body.message = payload.message.trim();
    const data = await apiFetch<ApiOffer>("/offers/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return apiOfferToOffer(data);
  },

  async myOffers() {
    const data = await apiFetch<ApiOffer[] | Paginated<ApiOffer>>(
      "/offers/mine/?limit=100"
    );
    return unwrapList(data).map(apiOfferToOffer);
  },

  async respondToOffer(
    id: string,
    payload: {
      status: "accepted" | "rejected" | "countered";
      counter_amount?: number;
      seller_response?: string;
    }
  ) {
    const body: Record<string, string | number> = { status: payload.status };
    if (payload.counter_amount !== undefined) {
      body.counter_amount = payload.counter_amount;
    }
    if (payload.seller_response) body.seller_response = payload.seller_response;
    const data = await apiFetch<ApiOffer>(`/offers/${id}/respond/`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return apiOfferToOffer(data);
  },

  async withdrawOffer(id: string) {
    const data = await apiFetch<ApiOffer>(`/offers/${id}/withdraw/`, {
      method: "POST",
    });
    return apiOfferToOffer(data);
  },

  // ---------------- Subscriptions ---------------- //

  async listPlans() {
    const data = await apiFetch<{ plans: ApiPlan[] }>("/subscriptions/plans/");
    return data.plans;
  },

  async subscriptionStatus() {
    return apiFetch<SubscriptionStatus>("/subscriptions/status/");
  },

  async createRazorpayOrder(plan: string, customerGstin?: string) {
    return apiFetch<RazorpayCheckoutOrder>("/subscriptions/create-order/", {
      method: "POST",
      body: JSON.stringify({ plan, customer_gstin: customerGstin ?? "" }),
    });
  },

  async verifyRazorpayPayment(payload: RazorpayVerifyPayload) {
    return apiFetch<ApiSubscriptionRecord>("/subscriptions/verify-payment/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async activateSubscription(plan: string, providerPaymentId?: string) {
    const body: Record<string, string> = { plan };
    if (providerPaymentId) body.provider_payment_id = providerPaymentId;
    return apiFetch<ApiSubscriptionRecord>("/subscriptions/activate/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async mySubscriptions() {
    const data = await apiFetch<{
      subscriptions: ApiSubscriptionRecord[];
      invoices: InvoicePayload[];
      boost_invoices: BoostInvoicePayload[];
    }>("/subscriptions/mine/");
    return data;
  },

  async getInvoice(subscriptionId: string) {
    return apiFetch<InvoicePayload>(
      `/subscriptions/${subscriptionId}/invoice/`
    );
  },

  // ---------------- Listing boost ---------------- //

  async listBoostPackages() {
    const data = await apiFetch<{ packages: BoostPackage[] }>(
      "/listings/boost-packages/"
    );
    return data.packages;
  },

  async createBoostOrder(
    listingId: string,
    pkg: string,
    customerGstin?: string
  ) {
    return apiFetch<BoostCheckoutOrder>(
      `/listings/${listingId}/create-boost-order/`,
      {
        method: "POST",
        body: JSON.stringify({ package: pkg, customer_gstin: customerGstin ?? "" }),
      }
    );
  },

  async verifyBoostPayment(listingId: string, payload: RazorpayVerifyPayload) {
    const data = await apiFetch<ApiListing>(
      `/listings/${listingId}/verify-boost-payment/`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return apiListingToCarListing(data);
  },

  // ---------------- Dealers ---------------- //

  async listDealers(params?: {
    q?: string;
    city?: string;
    sort?: "listings" | "newest" | "name";
    limit?: number;
    offset?: number;
  }) {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.city) search.set("city", params.city);
    if (params?.sort) search.set("sort", params.sort);
    search.set("limit", String(params?.limit ?? 48));
    if (params?.offset) search.set("offset", String(params.offset));
    const data = await apiFetch<
      ApiDealerCard[] | Paginated<ApiDealerCard>
    >(`/dealers/?${search.toString()}`);
    return unwrapList(data);
  },

  async getDealer(id: string) {
    return apiFetch<ApiDealerDetail>(`/dealers/${id}/`);
  },
};

// --------------------------------------------------------------------------- //
// Engagement API shapes (snake_case from Django) and converters
// --------------------------------------------------------------------------- //

type ApiTestDrive = {
  id: string;
  listing: string;
  listing_title: string;
  buyer: string | null;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string | null;
  seller: string | null;
  scheduled_at: string;
  location_note: string;
  message: string;
  status: TestDriveStatus;
  seller_response: string;
  created_at: string;
  updated_at: string;
};

type ApiOffer = {
  id: string;
  listing: string;
  listing_title: string;
  listing_price_inr: string | null;
  buyer: string | null;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string | null;
  seller: string | null;
  amount: string;
  counter_amount: string | null;
  message: string;
  seller_response: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
};

type ApiLoanInquiry = {
  id: string;
  bank_name: string;
  loan_partner: string;
  full_name: string;
  mobile: string;
  email: string;
  city: string;
  monthly_income: number;
  employment_type: LoanEmploymentType;
  employment_type_label: string;
  car_budget: string;
  message: string;
  status: LoanInquiryStatus;
  status_label: string;
  created_at: string;
  updated_at: string;
};

function apiLoanInquiryToLoanInquiry(data: ApiLoanInquiry): LoanInquiry {
  return {
    id: data.id,
    bankName: data.bank_name,
    loanPartner: data.loan_partner,
    fullName: data.full_name,
    mobile: data.mobile,
    email: data.email,
    city: data.city,
    monthlyIncome: Number(data.monthly_income) || 0,
    employmentType: data.employment_type,
    employmentTypeLabel: data.employment_type_label,
    carBudget: data.car_budget,
    message: data.message,
    status: data.status,
    statusLabel: data.status_label,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
  };
}

function apiTestDriveToTestDrive(data: ApiTestDrive): TestDriveBooking {
  return {
    id: data.id,
    listingId: data.listing,
    listingTitle: data.listing_title,
    buyerId: data.buyer,
    buyerName: data.buyer_name,
    buyerPhone: data.buyer_phone,
    buyerEmail: data.buyer_email,
    sellerId: data.seller,
    scheduledAt: data.scheduled_at,
    locationNote: data.location_note,
    message: data.message,
    status: data.status,
    sellerResponse: data.seller_response,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function apiOfferToOffer(data: ApiOffer): Offer {
  return {
    id: data.id,
    listingId: data.listing,
    listingTitle: data.listing_title,
    listingPriceInr: data.listing_price_inr,
    buyerId: data.buyer,
    buyerName: data.buyer_name,
    buyerPhone: data.buyer_phone,
    buyerEmail: data.buyer_email,
    sellerId: data.seller,
    amount: data.amount,
    counterAmount: data.counter_amount,
    message: data.message,
    sellerResponse: data.seller_response,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export type { CarListing };
