"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { seedAdmins } from "@/data/admin";
import { adminRoleColors, adminRoleLabels } from "@/data/admin";
import { ShieldIcon } from "./icons";

export default function SettingsContent() {
  const { admin, settings, updateSettings, resetSettings, logActivity } =
    useAdmin();
  const [saved, setSaved] = useState(false);
  const [keywords, setKeywords] = useState(
    settings.blockedKeywords.join(", ")
  );

  const handleSave = () => {
    updateSettings({
      blockedKeywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    });
    logActivity("settings-updated", "Platform settings saved");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Admin profile */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="dark-surface border-b border-slate-100 bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
            Your account
          </p>
          <h2 className="mt-1 text-lg font-bold">{admin?.name ?? "Admin"}</h2>
          <p className="text-sm text-slate-300">{admin?.email}</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            {admin && (
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${adminRoleColors[admin.role]}`}
              >
                {adminRoleLabels[admin.role]}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldIcon className="h-4 w-4" /> Session active
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform toggles */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            Platform controls
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Core marketplace behaviour
          </p>
          <ul className="mt-5 space-y-4">
            <ToggleRow
              label="Auto-approve listings"
              desc="New seller ads go live without manual review"
              checked={settings.autoApproveListings}
              onChange={(v) => toggle("autoApproveListings", v)}
            />
            <ToggleRow
              label="Maintenance mode"
              desc="Show maintenance banner on storefront"
              checked={settings.maintenanceMode}
              onChange={(v) => toggle("maintenanceMode", v)}
            />
            <ToggleRow
              label="Email notifications"
              desc="Send email alerts to admins on new listings"
              checked={settings.emailNotifications}
              onChange={(v) => toggle("emailNotifications", v)}
            />
            <ToggleRow
              label="SMS notifications"
              desc="SMS alerts for high-priority events"
              checked={settings.smsNotifications}
              onChange={(v) => toggle("smsNotifications", v)}
            />
            <ToggleRow
              label="WhatsApp channel"
              desc="Allow buyers to contact via WhatsApp"
              checked={settings.whatsappEnabled}
              onChange={(v) => toggle("whatsappEnabled", v)}
            />
          </ul>
        </section>

        {/* Listing limits */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            Listing rules
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Guardrails for seller submissions
          </p>
          <div className="mt-5 space-y-4">
            <NumberField
              label="Max photos per listing"
              value={settings.maxPhotosPerListing}
              onChange={(v) => updateSettings({ maxPhotosPerListing: v })}
              min={1}
              max={20}
            />
            <NumberField
              label="Min price (₹)"
              value={settings.minListingPrice}
              onChange={(v) => updateSettings({ minListingPrice: v })}
              min={0}
              step={10000}
            />
            <NumberField
              label="Max price (₹)"
              value={settings.maxListingPrice}
              onChange={(v) => updateSettings({ maxListingPrice: v })}
              min={100000}
              step={100000}
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Blocked keywords (comma-separated)
              </span>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              />
            </label>
          </div>
        </section>

        {/* Support contact */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            Support contact
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Shown to buyers and sellers on help pages
          </p>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Support email
              </span>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  updateSettings({ supportEmail: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Support phone
              </span>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) =>
                  updateSettings({ supportPhone: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Brand accent color
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.brandColor}
                  onChange={(e) =>
                    updateSettings({ brandColor: e.target.value })
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
                />
                <span className="font-mono text-sm text-slate-600">
                  {settings.brandColor}
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Demo admins */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">
            Admin team (demo)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Pre-configured roles for this prototype
          </p>
          <ul className="mt-5 space-y-3">
            {seedAdmins.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{a.email}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${adminRoleColors[a.role]}`}
                >
                  {adminRoleLabels[a.role]}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            Production: connect to your identity provider (Auth0, Firebase,
            Clerk) with role-based access control.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="rounded-xl bg-[#f75d34] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#e54d24]"
        >
          Save settings
        </motion.button>
        <button
          type="button"
          onClick={() => {
            resetSettings();
            setKeywords(settings.blockedKeywords.join(", "));
            logActivity("settings-updated", "Settings reset to defaults");
          }}
          className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset to defaults
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold text-emerald-600"
          >
            ✓ Settings saved
          </motion.span>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-500">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#f75d34]" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </li>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f75d34] focus:ring-2 focus:ring-[#f75d34]/20"
      />
    </label>
  );
}
