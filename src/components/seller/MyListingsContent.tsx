"use client";

import ListingImage from "@/components/ListingImage";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSellerIdFromUser, useListings } from "@/context/ListingsContext";
import { ApiError, ensureValidAccessToken } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";
import PageLoader from "@/components/ui/PageLoader";
import type { ListingStatus, UserCarListing } from "@/types/listing";

const statusStyles: Record<ListingStatus, string> = {
  active: "bg-green-100 text-green-700 ring-1 ring-green-200",
  sold: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  draft: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
};

type Toast = { kind: "success" | "error"; text: string } | null;

export default function MyListingsContent() {
  const { user, logout } = useAuth();
  const {
    getMyListings,
    removeListing,
    updateListingStatus,
    loading: listingsLoading,
  } = useListings();

  const sellerId = user ? getSellerIdFromUser(user) : "";
  const listings = useMemo(
    () => getMyListings(sellerId).sort((a, b) => b.createdAt - a.createdAt),
    [getMyListings, sellerId]
  );

  const activeCount = listings.filter((l) => l.status === "active").length;
  const soldCount = listings.filter((l) => l.status === "sold").length;

  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<
    "sold" | "relist" | "delete" | null
  >(null);
  const [confirmDelete, setConfirmDelete] = useState<UserCarListing | null>(
    null
  );
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const toastTimerRef = useRef<number | null>(null);

  const flashToast = (kind: "success" | "error", text: string) => {
    setToast({ kind, text });
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    // Errors linger longer so the seller actually reads what failed.
    toastTimerRef.current = window.setTimeout(
      () => setToast(null),
      kind === "error" ? 7000 : 3500
    );
  };

  const friendlyError = (err: unknown) => {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        logout();
        setConfirmDelete(null);
        return "Your session has expired. Please log in again.";
      }
      if (err.status === 403) {
        return "You don't have permission to change this listing.";
      }
      if (err.status === 0) {
        return "Couldn't reach the server. Check your internet and try again.";
      }
      return err.message || `Request failed (HTTP ${err.status}).`;
    }
    return err instanceof Error
      ? err.message
      : "Something went wrong. Please try again.";
  };

  const ensureSession = async () => {
    const ok = await ensureValidAccessToken();
    if (ok) return true;
    flashToast("error", "Your session has expired. Please log in again.");
    logout();
    setConfirmDelete(null);
    window.dispatchEvent(new Event("ocb-auth-expired"));
    return false;
  };

  const handleStatusChange = async (
    car: UserCarListing,
    next: ListingStatus
  ) => {
    if (busyId) return;
    if (!(await ensureSession())) return;
    setBusyId(car.id);
    setBusyAction(next === "sold" ? "sold" : "relist");
    try {
      await updateListingStatus(car.id, next);
      flashToast(
        "success",
        next === "sold"
          ? `Marked "${car.title}" as sold.`
          : `Re-listed "${car.title}".`
      );
    } catch (err) {
      console.error("[OCB] mark-as-sold failed", err);
      flashToast("error", friendlyError(err));
    } finally {
      setBusyId(null);
      setBusyAction(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setDeleteError("");
    if (!(await ensureSession())) return;
    const target = confirmDelete;
    setBusyId(target.id);
    setBusyAction("delete");
    try {
      await removeListing(target.id);
      flashToast("success", `Deleted "${target.title}".`);
      setConfirmDelete(null);
    } catch (err) {
      const message = friendlyError(err);
      console.error("[OCB] delete failed", err);
      setDeleteError(message);
      flashToast("error", message);
    } finally {
      setBusyId(null);
      setBusyAction(null);
    }
  };

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Ads", value: listings.length, color: "text-[#f75d34]" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Sold", value: soldCount, color: "text-gray-600" },
          {
            label: "Total Views",
            value: listings.reduce((s, l) => s + l.views, 0),
            color: "text-blue-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-caption">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-muted">
          Showing <span className="font-semibold text-gray-900">{listings.length}</span>{" "}
          listings
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sell-car"
            className="rounded-lg bg-[#f75d34] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e54d24]"
          >
            + Post New Ad
          </Link>
          <Link
            href="/seller"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#f75d34] hover:text-[#f75d34]"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {listingsLoading && listings.length === 0 ? (
        <PageLoader message="Loading your listings…" />
      ) : listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <span className="text-6xl">🚗</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">No listings yet</h2>
          <p className="mx-auto mt-2 max-w-md text-body-muted">
            List your first car for free — your ad goes live in just 2 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/sell-car"
              className="rounded-full bg-[#f75d34] px-8 py-3 text-sm font-semibold text-white hover:bg-[#e54d24]"
            >
              Sell Car Free
            </Link>
            <Link
              href="/post-ad"
              className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 hover:border-[#f75d34]"
            >
              Post Ad in 2 Min
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {listings.map((car) => {
            const isBusy = busyId === car.id;
            return (
              <li
                key={car.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-52 w-full shrink-0 bg-gray-100 sm:h-auto sm:w-56">
                    <ListingImage
                      src={car.image}
                      alt={car.title}
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                    {(car.images?.length ?? 0) > 1 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                        📷 {car.images!.length}
                      </span>
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyles[car.status]}`}
                    >
                      {car.status}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {car.title}
                      </h3>
                      <p className="mt-1 text-caption sm:text-sm">{car.specs}</p>
                      <p className="mt-3 text-xl font-bold text-[#f75d34]">
                        {car.price}
                      </p>
                      <p className="mt-2 text-caption">
                        📍 {car.location} •{" "}
                        {new Date(car.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-3 flex gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                        <span>
                          👁 <strong>{car.views}</strong> views
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <WhatsAppIcon size={14} />
                          <strong>{car.inquiries}</strong> inquiries
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      {car.status === "active" && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(car, "sold")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy && busyAction === "sold" && (
                            <Spinner size="xs" tone="white" />
                          )}
                          {isBusy && busyAction === "sold"
                            ? "Marking…"
                            : "Mark as Sold"}
                        </button>
                      )}
                      {car.status === "sold" && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(car, "active")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy && busyAction === "relist" && (
                            <Spinner size="xs" tone="muted" />
                          )}
                          {isBusy && busyAction === "relist"
                            ? "Re-listing…"
                            : "Relist"}
                        </button>
                      )}
                      <Link
                        href={`/my-listings/${car.id}/edit`}
                        aria-disabled={isBusy}
                        className={`rounded-lg border border-[#f75d34] px-4 py-2 text-xs font-semibold text-[#f75d34] hover:bg-[#f75d34]/10 ${
                          isBusy ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          setDeleteError("");
                          setConfirmDelete(car);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy && busyAction === "delete" && (
                          <Spinner size="xs" tone="muted" />
                        )}
                        {isBusy && busyAction === "delete"
                          ? "Deleting…"
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal
          aria-labelledby="confirm-delete-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && busyAction !== "delete") {
              setConfirmDelete(null);
              setDeleteError("");
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2
              id="confirm-delete-title"
              className="text-base font-bold text-gray-900"
            >
              Delete this listing?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {confirmDelete.title}
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {deleteError}
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={busyAction === "delete"}
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteError("");
                }}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyAction === "delete"}
                onClick={handleConfirmDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyAction === "delete" && (
                  <Spinner size="sm" tone="white" />
                )}
                {busyAction === "delete" ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-[120] flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg ${
            toast.kind === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span className="whitespace-normal text-left">{toast.text}</span>
          <button
            type="button"
            onClick={() => {
              if (toastTimerRef.current !== null) {
                window.clearTimeout(toastTimerRef.current);
              }
              setToast(null);
            }}
            aria-label="Dismiss"
            className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold hover:bg-white/30"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
