import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE } from "@/config/api";
import type {
  CarListing,
  ListingStatus,
  SellForm,
} from "@/types/listing";

// --------------------------------------------------------------------------- //
// Token storage (AsyncStorage + in-memory cache so requests stay synchronous)
// --------------------------------------------------------------------------- //

const ACCESS_KEY = "ocb_access_token";
const REFRESH_KEY = "ocb_refresh_token";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function loadTokens() {
  const [a, r] = await Promise.all([
    AsyncStorage.getItem(ACCESS_KEY),
    AsyncStorage.getItem(REFRESH_KEY),
  ]);
  accessToken = a;
  refreshToken = r;
  return { access: a, refresh: r };
}

export async function saveTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  await AsyncStorage.multiSet([
    [ACCESS_KEY, access],
    [REFRESH_KEY, refresh],
  ]);
}

export async function clearTokens() {
  accessToken = null;
  refreshToken = null;
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}

export function hasSession() {
  return Boolean(accessToken);
}

// --------------------------------------------------------------------------- //
// API shapes (snake_case from Django)
// --------------------------------------------------------------------------- //

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
  status?: ListingStatus;
  moderation?: "pending" | "approved" | "rejected";
  rejected_reason?: string;
  featured?: boolean;
  whatsapp?: boolean;
  views?: number;
  inquiries_count?: number;
  boosted_until?: string | null;
  is_boosted?: boolean;
  created_at?: string;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  avatar_url?: string;
  role: "buyer" | "seller" | "both";
  status: "active" | "blocked";
  date_joined?: string;
};

type AuthResponse = { access: string; refresh: string; user: ApiUser };

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
  currency: string;
  status: "active" | "expired" | "cancelled" | "pending";
  started_at: string;
  expires_at: string;
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
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
  currency: string;
  status: "created" | "paid" | "failed";
  boosted_until: string | null;
  provider: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  listing_id: string;
  listing_title: string;
};

export type RazorpayCheckoutOrder = {
  key_id: string;
  order_id: string;
  amount: number;
  amount_inr: number;
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
  currency: string;
  package: BoostPackage;
  listing_id: string;
  name: string;
  email: string | null;
  contact: string;
};

export type Inquiry = {
  id: string;
  listing: string;
  listing_title: string;
  listing_price: string;
  buyer_name: string;
  buyer_phone: string;
  message: string;
  channel: "whatsapp" | "call" | "form" | "chat";
  status: string;
  created_at: string;
};

export type TestDrive = {
  id: string;
  listing: string;
  listing_title: string;
  buyer_name: string;
  buyer_phone: string;
  scheduled_at: string;
  location_note: string;
  message: string;
  status: string;
  seller_response: string;
  created_at: string;
};

export type Offer = {
  id: string;
  listing: string;
  listing_title: string;
  buyer_name: string;
  buyer_phone: string;
  amount: string;
  counter_amount: string | null;
  message: string;
  seller_response: string;
  status: string;
  created_at: string;
};

export type DealerCard = {
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
  member_since: string;
};

export type DealerDetail = DealerCard & {
  listings: ApiListing[];
  total_listings_count: number;
};

// --------------------------------------------------------------------------- //
// Error + helpers
// --------------------------------------------------------------------------- //

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

function unwrapList<T>(data: T[] | Paginated<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) {
      await clearTokens();
      return null;
    }
    const data = (await res.json()) as { access?: string; refresh?: string };
    if (!data.access) return null;
    accessToken = data.access;
    if (data.refresh) refreshToken = data.refresh;
    await AsyncStorage.setItem(ACCESS_KEY, data.access);
    if (data.refresh) await AsyncStorage.setItem(REFRESH_KEY, data.refresh);
    return data.access;
  } catch {
    return null;
  }
}

type FetchOpts = {
  method?: string;
  body?: BodyInit | null;
  auth?: boolean;
  isForm?: boolean;
};

async function apiFetch<T>(path: string, opts: FetchOpts = {}, retry = true): Promise<T> {
  const { method = "GET", body, auth = false, isForm = false } = opts;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body && !isForm) headers["Content-Type"] = "application/json";
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, body, headers });
  } catch (err) {
    throw new ApiError(0, "Could not reach the server. Check your internet connection.", err);
  }

  if (res.status === 401 && auth && retry) {
    const next = await refreshAccessToken();
    if (next) return apiFetch<T>(path, opts, false);
    await clearTokens();
    throw new ApiError(401, "Session expired. Please log in again.", null);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      data && typeof data === "object"
        ? Object.values(data as Record<string, unknown>).flat().join(" ")
        : String(data || `Request failed (${res.status})`);
    throw new ApiError(res.status, message || "Request failed", data);
  }
  return data as T;
}

// --------------------------------------------------------------------------- //
// Converters
// --------------------------------------------------------------------------- //

export function apiListingToCarListing(item: ApiListing): CarListing {
  const photoUrls = (item.photos ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((p) => p.url)
    .filter(Boolean);
  const cover = item.cover_image || photoUrls[0] || "";
  return {
    id: item.id,
    title: item.title,
    brand: item.brand,
    model: item.model,
    variant: item.variant,
    year: item.year,
    price: item.price_label,
    priceInr: item.price_inr,
    specs: `${Number(item.kms).toLocaleString("en-IN")} kms • ${item.fuel} • ${item.transmission}`,
    location: item.location,
    area: item.area,
    image: cover,
    images: photoUrls.length > 0 ? photoUrls : cover ? [cover] : undefined,
    phone: item.seller_phone,
    sellerName: item.seller_name,
    sellerEmail: item.seller_email || undefined,
    description: item.description,
    features: item.features,
    bodyType: item.body_type,
    color: item.color,
    seats: item.seats,
    engineCc: item.engine_cc,
    mileage: item.mileage,
    ownership: item.ownership,
    registrationMonth: item.registration_month,
    regNumber: item.reg_number,
    insurance: item.insurance,
    whatsapp: item.whatsapp,
    featured: item.featured,
    status: item.status,
    moderation: item.moderation,
    rejectedReason: item.rejected_reason,
    isBoosted:
      item.is_boosted ??
      (item.boosted_until ? new Date(item.boosted_until).getTime() > Date.now() : false),
    boostedUntil: item.boosted_until ?? null,
    kms: item.kms,
    fuel: item.fuel,
    transmission: item.transmission,
    owners: item.owners,
    views: item.views ?? 0,
    inquiries: item.inquiries_count ?? 0,
    createdAt: item.created_at ? new Date(item.created_at).getTime() : undefined,
  };
}

/** Convert a fetched listing back into the editable SellForm shape. */
export function carListingToForm(car: CarListing): SellForm {
  const priceLakh = car.priceInr
    ? String(Math.round((Number(car.priceInr.replace(/[^\d.]/g, "")) / 100000) * 100) / 100)
    : car.price.replace(/[^\d.]/g, "");
  return {
    brand: car.brand,
    model: car.model,
    year: String(car.year),
    variant: car.variant ?? "",
    bodyType: car.bodyType ?? "",
    color: car.color ?? "",
    fuel: car.fuel,
    transmission: car.transmission,
    kms: String(car.kms),
    owners: car.owners,
    seats: car.seats ? String(car.seats) : "5",
    registrationMonth: car.registrationMonth ?? "January",
    engineCc: car.engineCc ?? "",
    mileage: car.mileage ?? "",
    insurance: car.insurance ?? "",
    price: priceLakh,
    city: car.location,
    area: car.area ?? "",
    regNumber: car.regNumber ?? "",
    description: car.description ?? "",
    features: car.features ?? [],
    sellerName: car.sellerName,
    phone: car.phone,
    email: car.sellerEmail ?? "",
    whatsapp: car.whatsapp ?? true,
  };
}

function formToPayload(form: SellForm, photos: string[]) {
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

// --------------------------------------------------------------------------- //
// Public API surface
// --------------------------------------------------------------------------- //

export type ListingQuery = {
  q?: string;
  city?: string;
  brand?: string;
  fuel?: string;
  transmission?: string;
  body_type?: string;
  min_price?: number;
  max_price?: number;
  min_kms?: number;
  max_kms?: number;
  owners?: string;
  ordering?: string;
  limit?: number;
};

export const api = {
  baseUrl: API_BASE,

  // ---- Auth ----
  async register(payload: { name: string; phone: string; password: string; email?: string; city?: string }) {
    const body: Record<string, string> = {
      name: payload.name,
      phone: payload.phone,
      password: payload.password,
    };
    if (payload.email?.trim()) body.email = payload.email.trim();
    if (payload.city?.trim()) body.city = payload.city.trim();
    const data = await apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    await saveTokens(data.access, data.refresh);
    return data.user;
  },

  async login(identifier: string, password: string) {
    const data = await apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    await saveTokens(data.access, data.refresh);
    return data.user;
  },

  async me() {
    return apiFetch<ApiUser>("/auth/me/", { auth: true });
  },

  async updateProfile(payload: { name?: string; email?: string; city?: string }): Promise<ApiUser> {
    const body: Record<string, string> = {};
    if (payload.name !== undefined) body.name = payload.name.trim();
    if (payload.email !== undefined) body.email = payload.email.trim();
    if (payload.city !== undefined) body.city = payload.city.trim();
    return apiFetch<ApiUser>("/auth/me/", {
      method: "PATCH",
      body: JSON.stringify(body),
      auth: true,
    });
  },

  async logout() {
    await clearTokens();
  },

  // ---- Listings (browse / search) ----
  async listListings(query: ListingQuery = {}): Promise<CarListing[]> {
    const search = new URLSearchParams();
    search.set("limit", String(query.limit ?? 100));
    if (query.q) search.set("search", query.q);
    if (query.city) search.set("city", query.city);
    if (query.brand) search.set("brand", query.brand);
    if (query.fuel) search.set("fuel", query.fuel);
    if (query.transmission) search.set("transmission", query.transmission);
    if (query.body_type) search.set("body_type", query.body_type);
    if (query.owners) search.set("owners", query.owners);
    if (query.ordering) search.set("ordering", query.ordering);
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      `/listings/?${search.toString()}`
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async getListing(id: string): Promise<CarListing> {
    const data = await apiFetch<ApiListing>(`/listings/${id}/`);
    return apiListingToCarListing(data);
  },

  async myListings(): Promise<CarListing[]> {
    const data = await apiFetch<ApiListing[] | Paginated<ApiListing>>(
      "/listings/mine/?limit=100",
      { auth: true }
    );
    return unwrapList(data).map(apiListingToCarListing);
  },

  async createListing(form: SellForm, photos: string[]): Promise<CarListing> {
    const data = await apiFetch<ApiListing>("/listings/", {
      method: "POST",
      body: JSON.stringify(formToPayload(form, photos)),
      auth: true,
    });
    return apiListingToCarListing(data);
  },

  async updateListing(id: string, form: SellForm, photos: string[]): Promise<CarListing> {
    const data = await apiFetch<ApiListing>(`/listings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(formToPayload(form, photos)),
      auth: true,
    });
    return apiListingToCarListing(data);
  },

  async updateListingStatus(id: string, status: ListingStatus): Promise<CarListing> {
    const data = await apiFetch<ApiListing>(`/listings/${id}/status/`, {
      method: "POST",
      body: JSON.stringify({ status }),
      auth: true,
    });
    return apiListingToCarListing(data);
  },

  async deleteListing(id: string) {
    await apiFetch<unknown>(`/listings/${id}/`, { method: "DELETE", auth: true });
  },

  async uploadMedia(uri: string, index = 0): Promise<string> {
    const form = new FormData();
    const name = `photo-${Date.now()}-${index}.jpg`;
    // React Native FormData file shape
    form.append("file", { uri, name, type: "image/jpeg" } as unknown as Blob);
    form.append("folder", "old-car-bazar/listings");
    const data = await apiFetch<{ secure_url?: string; url?: string }>(
      "/listings/upload-media/",
      { method: "POST", body: form, auth: true, isForm: true }
    );
    return data.secure_url || data.url || "";
  },

  /** Upload any local (file://) URIs, pass through remote https URLs. */
  async uploadPhotos(uris: string[]): Promise<string[]> {
    const out: string[] = [];
    for (const [i, uri] of uris.entries()) {
      if (uri.startsWith("http")) {
        out.push(uri);
        continue;
      }
      const url = await this.uploadMedia(uri, i);
      if (url) out.push(url);
    }
    return out;
  },

  // ---- Inquiries ----
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
    if (payload.buyer_email?.trim()) body.buyer_email = payload.buyer_email.trim();
    if (payload.message?.trim()) body.message = payload.message.trim();
    return apiFetch<Inquiry>("/inquiries/", { method: "POST", body: JSON.stringify(body) });
  },

  async myInquiries(): Promise<Inquiry[]> {
    const data = await apiFetch<Inquiry[] | Paginated<Inquiry>>(
      "/inquiries/mine/?limit=100",
      { auth: true }
    );
    return unwrapList(data);
  },

  // ---- Test drives ----
  async createTestDrive(payload: {
    listing: string;
    buyer_name: string;
    buyer_phone: string;
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
    if (payload.location_note?.trim()) body.location_note = payload.location_note.trim();
    if (payload.message?.trim()) body.message = payload.message.trim();
    return apiFetch<TestDrive>("/test-drives/", { method: "POST", body: JSON.stringify(body) });
  },

  async myTestDrives(): Promise<TestDrive[]> {
    const data = await apiFetch<TestDrive[] | Paginated<TestDrive>>(
      "/test-drives/mine/?limit=100",
      { auth: true }
    );
    return unwrapList(data);
  },

  // ---- Offers ----
  async createOffer(payload: {
    listing: string;
    buyer_name: string;
    buyer_phone: string;
    amount: number;
    message?: string;
  }) {
    const body: Record<string, string | number> = {
      listing: payload.listing,
      buyer_name: payload.buyer_name.trim(),
      buyer_phone: payload.buyer_phone,
      amount: payload.amount,
    };
    if (payload.message?.trim()) body.message = payload.message.trim();
    return apiFetch<Offer>("/offers/", { method: "POST", body: JSON.stringify(body) });
  },

  async myOffers(): Promise<Offer[]> {
    const data = await apiFetch<Offer[] | Paginated<Offer>>(
      "/offers/mine/?limit=100",
      { auth: true }
    );
    return unwrapList(data);
  },

  // ---- Subscriptions ----
  async listPlans(): Promise<ApiPlan[]> {
    const data = await apiFetch<{ plans: ApiPlan[] }>("/subscriptions/plans/");
    return data.plans;
  },

  async subscriptionStatus(): Promise<SubscriptionStatus> {
    return apiFetch<SubscriptionStatus>("/subscriptions/status/", { auth: true });
  },

  async createRazorpayOrder(plan: string): Promise<RazorpayCheckoutOrder> {
    return apiFetch<RazorpayCheckoutOrder>("/subscriptions/create-order/", {
      method: "POST",
      body: JSON.stringify({ plan }),
      auth: true,
    });
  },

  async verifyRazorpayPayment(payload: RazorpayVerifyPayload): Promise<ApiSubscriptionRecord> {
    return apiFetch<ApiSubscriptionRecord>("/subscriptions/verify-payment/", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    });
  },

  async activateSubscription(plan: string, providerPaymentId?: string): Promise<ApiSubscriptionRecord> {
    const body: Record<string, string> = { plan };
    if (providerPaymentId) body.provider_payment_id = providerPaymentId;
    return apiFetch<ApiSubscriptionRecord>("/subscriptions/activate/", {
      method: "POST",
      body: JSON.stringify(body),
      auth: true,
    });
  },

  async mySubscriptions(): Promise<{
    subscriptions: ApiSubscriptionRecord[];
    invoices: InvoicePayload[];
    boost_invoices: BoostInvoicePayload[];
  }> {
    return apiFetch("/subscriptions/mine/", { auth: true });
  },

  async getInvoice(subscriptionId: string): Promise<InvoicePayload> {
    return apiFetch<InvoicePayload>(`/subscriptions/${subscriptionId}/invoice/`, { auth: true });
  },

  // ---- Listing boost ----
  async listBoostPackages(): Promise<BoostPackage[]> {
    const data = await apiFetch<{ packages: BoostPackage[] }>("/listings/boost-packages/");
    return data.packages;
  },

  async createBoostOrder(listingId: string, pkg: string): Promise<BoostCheckoutOrder> {
    return apiFetch<BoostCheckoutOrder>(`/listings/${listingId}/create-boost-order/`, {
      method: "POST",
      body: JSON.stringify({ package: pkg }),
      auth: true,
    });
  },

  async verifyBoostPayment(listingId: string, payload: RazorpayVerifyPayload): Promise<CarListing> {
    const data = await apiFetch<ApiListing>(`/listings/${listingId}/verify-boost-payment/`, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    });
    return apiListingToCarListing(data);
  },

  // ---- Dealers ----
  async listDealers(params: { q?: string; city?: string; sort?: string; limit?: number } = {}) {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.city) search.set("city", params.city);
    if (params.sort) search.set("sort", params.sort);
    search.set("limit", String(params.limit ?? 48));
    const data = await apiFetch<DealerCard[] | Paginated<DealerCard>>(
      `/dealers/?${search.toString()}`
    );
    return unwrapList(data);
  },

  async getDealer(id: string): Promise<DealerDetail> {
    return apiFetch<DealerDetail>(`/dealers/${id}/`);
  },
};
