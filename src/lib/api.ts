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
  created_at?: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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

export function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveTokens(access: string, refresh: string) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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
  const data = await res.json();
  if (data.access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    return data.access as string;
  }
  return null;
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401 && retry) {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return apiFetch<T>(path, init, false);
    }
    if (isBrowser()) {
      window.dispatchEvent(new Event("ocb-auth-expired"));
    }
  }

  return parseResponse<T>(res);
}

async function adminApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminAccessToken();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearAdminTokens();
  }

  return parseResponse<T>(res);
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
    createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
    views: item.views ?? 0,
    inquiries: item.inquiries_count ?? 0,
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

    const data = await apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    saveTokens(data.access, data.refresh);
    return data;
  },

  async login(identifier: string, password: string) {
    const data = await apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    saveTokens(data.access, data.refresh);
    return data;
  },

  async me() {
    return apiFetch<ApiUser>("/auth/me/");
  },

  async listListings() {
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/?limit=100"
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async myListings() {
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/mine/?limit=100"
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

  async updateListingStatus(id: string, status: ListingStatus) {
    const data = await apiFetch<ApiListing>(`/listings/${id}/status/`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
    return apiListingToCarListing(data);
  },

  async deleteListing(id: string) {
    await apiFetch<unknown>(`/listings/${id}/`, { method: "DELETE" });
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
    const data = await adminApiFetch<AdminAuthResponse>("/admin-panel/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
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
    };
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
};

export type { CarListing };
