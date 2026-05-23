"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { seedAdmins } from "@/data/admin";
import { ShieldIcon } from "./icons";

export default function AdminLogin() {
  const router = useRouter();
  const { login, admin, hydrated } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && admin) router.replace("/admin");
  }, [hydrated, admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (idx: number) => {
    const a = seedAdmins[idx];
    setEmail(a.email);
    setPassword(a.password);
    setError("");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_minmax(380px,440px)]">
      {/* Marketing column */}
      <div className="relative hidden overflow-hidden bg-[#0f172a] lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=1000&fit=crop')",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/90 to-[#1e1b4b]/80"
        />
        <div
          aria-hidden
          className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-[#f75d34]/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex h-full w-full flex-col justify-between p-12"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f75d34] text-base font-black text-white">
              OB
            </span>
            <div>
              <p className="text-base font-bold text-white">Old Car Bazar</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                Admin Console
              </p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-orange-200 backdrop-blur">
              <ShieldIcon className="h-3.5 w-3.5" /> Secure Admin Access
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
              Manage India&apos;s fastest growing
              <br />
              used-car marketplace.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Approve listings, monitor inquiries, support sellers and buyers
              and grow your platform — all from one industry-grade admin
              command center.
            </p>
            <ul className="mt-8 grid max-w-md grid-cols-2 gap-4 text-xs text-slate-300">
              {[
                { k: "10K+", v: "Listings" },
                { k: "35+", v: "Cities" },
                { k: "98%", v: "Approval SLA" },
                { k: "24/7", v: "Moderation" },
              ].map((s) => (
                <li
                  key={s.v}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-2xl font-bold text-white">{s.k}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-orange-200">
                    {s.v}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Old Car Bazar. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Form column */}
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-6 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f75d34] text-sm font-black text-white">
                OB
              </span>
              <p className="text-sm font-bold text-slate-900">Old Car Bazar</p>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f75d34]">
              Admin
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sign in with your admin credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email address
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@oldcarbazar.com"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500 hover:text-[#f75d34]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#f75d34] focus:ring-[#f75d34]"
                  defaultChecked
                />
                Keep me signed in
              </label>
              <a
                href="mailto:support@oldcarbazar.com"
                className="font-semibold text-[#f75d34] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f75d34] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#e54d24] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in to admin panel"
              )}
            </motion.button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Demo accounts
              </p>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Pre-loaded
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {seedAdmins.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => fillDemo(i)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-xs transition hover:border-[#f75d34]/40 hover:bg-orange-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {a.email}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {a.name} • {a.role}
                      </p>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 font-mono text-[10px] text-slate-600 ring-1 ring-slate-200">
                      {a.password}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              These demo credentials are stored locally for the prototype. In
              production, wire this to a real auth backend with hashed
              passwords and MFA.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
