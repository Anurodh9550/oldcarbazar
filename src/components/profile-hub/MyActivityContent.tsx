"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";

const ACTIVITY_KEY = "oldCarBazar_activity";

type ActivityItem = {
  id: string;
  type: "view" | "search";
  label: string;
  href?: string;
  at: number;
};

function loadActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    const parsed = raw ? (JSON.parse(raw) as ActivityItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function MyActivityContent() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setItems(loadActivity().sort((a, b) => b.at - a.at));
  }, []);

  if (items.length === 0) {
    return (
      <ProfileEmptyState
        icon="🕐"
        title="No recent activity"
        description="Jab aap cars search ya view karenge, recent activity yahan save hogi."
        actionLabel="Search used cars"
        actionHref="/used-cars/search"
      />
    );
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="font-medium text-gray-900">{item.label}</p>
            <p className="text-caption capitalize">{item.type}</p>
          </div>
          {item.href ? (
            <Link href={item.href} className="text-sm font-semibold text-[#f75d34] hover:underline">
              View
            </Link>
          ) : (
            <span className="text-caption">
              {new Date(item.at).toLocaleDateString("en-IN")}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
