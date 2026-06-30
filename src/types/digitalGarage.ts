export type GarageVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  regNumber: string;
  purchaseDate: string;
  insuranceExpiry: string;
  serviceDueDate: string;
  odometerKm: number;
  rcNotes: string;
  notes: string;
  photos: string[];
  listingId?: string;
  addedAt: number;
};

export type GarageReminder = {
  vehicleId: string;
  type: "insurance" | "service";
  label: string;
  dueDate: string;
  daysLeft: number;
  urgent: boolean;
};
