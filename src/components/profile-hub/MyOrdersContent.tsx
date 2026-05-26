"use client";

import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";

export default function MyOrdersContent() {
  return (
    <ProfileEmptyState
      icon="📦"
      title="No orders yet"
      description="When you book, inspect or request to purchase a car, it will appear here."
      actionLabel="Browse used cars"
      actionHref="/used-cars"
    />
  );
}
