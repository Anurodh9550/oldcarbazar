"use client";

import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";

export default function MyOrdersContent() {
  return (
    <ProfileEmptyState
      icon="📦"
      title="No orders yet"
      description="Jab aap kisi car ki booking, inspection, ya purchase request karenge, woh yahan dikhegi."
      actionLabel="Browse used cars"
      actionHref="/used-cars"
    />
  );
}
