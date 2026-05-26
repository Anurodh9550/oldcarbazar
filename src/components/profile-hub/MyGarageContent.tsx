"use client";

import ProfileEmptyState from "@/components/profile-hub/ProfileEmptyState";

export default function MyGarageContent() {
  return (
    <>
      <ProfileEmptyState
        icon="🏠"
        title="Your garage is empty"
        description="Yahan apni owned cars add kar sakte ho — service due dates, RC copy, aur insurance reminders ke liye."
        actionLabel="Add a vehicle"
        actionHref="/sell-car"
      />
      <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-sm text-gray-700">
        <strong>Tip:</strong> Agar aap car bech rahe ho,{" "}
        <a href="/my-listings" className="font-semibold text-[#f75d34] hover:underline">
          My Listings
        </a>{" "}
        use karo — wahan ads manage hoti hain.
      </p>
    </>
  );
}
