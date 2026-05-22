"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { ShieldIcon } from "./icons";

/**
 * Protects all /admin routes (except /admin/login). Redirects unauthorized
 * visitors to the admin login page after a tiny grace period to avoid SSR
 * flashes.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, hydrated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, hydrated, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#f75d34]" />
          <p className="text-sm font-medium text-slate-600">Loading admin…</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldIcon className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Admin access required
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in with an authorized admin account to continue.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-full bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
          >
            Go to admin login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
