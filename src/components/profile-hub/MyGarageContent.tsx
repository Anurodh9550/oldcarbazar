"use client";

import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";

export default function MyGarageContent() {
  return (
    <>
      <ProfileEmptyState
        icon="🏠"
        title="Your garage is empty"
        description="Add the cars you own here — for service due dates, RC copies and insurance reminders."
        actionLabel="Add a vehicle"
        actionHref="/sell-car"
      />
      <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-sm text-gray-700">
        <strong>Tip:</strong> If you&apos;re selling a car, use{" "}
        <a href="/my-listings" className="font-semibold text-[#f75d34] hover:underline">
          My Listings
        </a>{" "}
        — that&apos;s where your ads are managed.
      </p>
    </>
  );
}
