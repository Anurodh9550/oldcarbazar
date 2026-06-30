export type CarAvailabilityStatus =
  | "available"
  | "reserved"
  | "sold"
  | "coming_soon";

export type CarAvailabilityEntry = {
  listingId: string;
  dealerId: string;
  title: string;
  status: CarAvailabilityStatus;
  note?: string;
  availableFrom?: string;
  updatedAt: number;
};

export const AVAILABILITY_STATUS_META: Record<
  CarAvailabilityStatus,
  { label: string; color: string; bg: string; ring: string }
> = {
  available: {
    label: "Available",
    color: "text-emerald-800",
    bg: "bg-emerald-100",
    ring: "ring-emerald-300",
  },
  reserved: {
    label: "Reserved",
    color: "text-amber-800",
    bg: "bg-amber-100",
    ring: "ring-amber-300",
  },
  sold: {
    label: "Sold",
    color: "text-gray-700",
    bg: "bg-gray-100",
    ring: "ring-gray-300",
  },
  coming_soon: {
    label: "Coming Soon",
    color: "text-blue-800",
    bg: "bg-blue-100",
    ring: "ring-blue-300",
  },
};
