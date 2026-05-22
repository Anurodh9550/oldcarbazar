import type { AdminRole } from "@/types/admin";

/**
 * Seed admin credentials used by the demo admin panel.
 * Replace these with a real auth backend in production.
 */
export type SeedAdmin = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  avatar?: string;
};

export const seedAdmins: SeedAdmin[] = [
  {
    id: "admin-1",
    email: "admin@oldcarbazar.com",
    password: "admin@123",
    name: "Anurodh Singh",
    role: "super-admin",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  },
  {
    id: "admin-2",
    email: "moderator@oldcarbazar.com",
    password: "mod@123",
    name: "Riya Sharma",
    role: "moderator",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
  {
    id: "admin-3",
    email: "support@oldcarbazar.com",
    password: "support@123",
    name: "Karan Mehta",
    role: "support",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop",
  },
];

export const adminRoleLabels: Record<AdminRole, string> = {
  "super-admin": "Super Admin",
  moderator: "Moderator",
  support: "Support",
};

export const adminRoleColors: Record<AdminRole, string> = {
  "super-admin": "bg-violet-100 text-violet-700 ring-violet-200",
  moderator: "bg-blue-100 text-blue-700 ring-blue-200",
  support: "bg-amber-100 text-amber-700 ring-amber-200",
};

/** Seeded buyers (without any listings) so the buyers tab is not empty. */
export const seedBuyers = [
  {
    id: "buyer-amit-91",
    name: "Amit Kumar",
    email: "amit.kumar@gmail.com",
    phone: "9876512345",
    city: "Delhi",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "buyer-priya-92",
    name: "Priya Verma",
    email: "priya.v@gmail.com",
    phone: "9988123456",
    city: "Mumbai",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "buyer-rohit-93",
    name: "Rohit Singh",
    email: "rohit.singh@gmail.com",
    phone: "9090909090",
    city: "Bangalore",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "buyer-sneha-94",
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    phone: "9123456780",
    city: "Ahmedabad",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
  {
    id: "buyer-arjun-95",
    name: "Arjun Reddy",
    email: "arjun.r@gmail.com",
    phone: "9012345678",
    city: "Hyderabad",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
  },
  {
    id: "buyer-neha-96",
    name: "Neha Joshi",
    email: "neha.j@gmail.com",
    phone: "8765432109",
    city: "Pune",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 32,
  },
];
