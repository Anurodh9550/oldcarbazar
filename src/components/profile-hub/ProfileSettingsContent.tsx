"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const STORAGE_KEY = "oldCarBazar_user";

export default function ProfileSettingsContent() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Name, email, aur phone required hain.");
      return;
    }
    setError("");
    const updated = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim() || undefined,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-lg space-y-5">
      <p className="text-body-muted">
        Account details yahan update karo. Backend profile API jald add hogi — abhi
        display name browser mein save hota hai.
      </p>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Full name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none focus:ring-1 focus:ring-[#f75d34]"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none focus:ring-1 focus:ring-[#f75d34]"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Phone</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none focus:ring-1 focus:ring-[#f75d34]"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">City (optional)</span>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ahmedabad"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f75d34] focus:outline-none focus:ring-1 focus:ring-[#f75d34]"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Profile saved locally. Logout/login ke baad server se sync hoga.
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-[#f75d34] py-3 text-sm font-semibold text-white hover:bg-[#e54d24] sm:w-auto sm:px-8"
      >
        Save changes
      </button>
    </form>
  );
}
