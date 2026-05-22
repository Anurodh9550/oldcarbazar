export type CarListing = {
  id: string;
  title: string;
  specs: string;
  price: string;
  location: string;
  badge?: "DIRECT OWNER" | "FEATURED";
  image: string;
  /** All uploaded photos; first image is cover (image) */
  images?: string[];
};

export const carListings: CarListing[] = [
  {
    id: "1",
    title: "2020 Tata Harrier XZ BSVI",
    specs: "80,000 kms • Diesel • Manual",
    price: "₹11 Lakh",
    location: "Ahmedabad",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "2019 Maruti Swift VDI",
    specs: "45,000 kms • Diesel • Manual",
    price: "₹5.5 Lakh",
    location: "Ahmedabad",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "2021 Hyundai Creta SX",
    specs: "32,000 kms • Petrol • Automatic",
    price: "₹14.2 Lakh",
    location: "Mumbai",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "2018 Honda City ZX CVT",
    specs: "62,000 kms • Petrol • Automatic",
    price: "₹8.9 Lakh",
    location: "Delhi",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "2017 Toyota Innova Crysta",
    specs: "1,10,000 kms • Diesel • Manual",
    price: "₹12.5 Lakh",
    location: "Bangalore",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe25c6d?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "2022 Mahindra Thar LX",
    specs: "18,000 kms • Petrol • Manual",
    price: "₹13.8 Lakh",
    location: "Pune",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    title: "2019 Kia Seltos HTX",
    specs: "55,000 kms • Petrol • Automatic",
    price: "₹10.2 Lakh",
    location: "Hyderabad",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
  },
  {
    id: "8",
    title: "2016 Renault Duster RXZ",
    specs: "95,000 kms • Diesel • Manual",
    price: "₹6.8 Lakh",
    location: "Chennai",
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop",
  },
  {
    id: "9",
    title: "2020 Maruti Ertiga VDI",
    specs: "40,000 kms • Diesel • Manual",
    price: "₹9.5 Lakh",
    location: "Surat",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1621007947412-baf6869b7751?w=600&h=400&fit=crop",
  },
  {
    id: "10",
    title: "2018 Ford EcoSport Titanium",
    specs: "70,000 kms • Diesel • Manual",
    price: "₹7.2 Lakh",
    location: "Jaipur",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop",
  },
  {
    id: "11",
    title: "2021 Tata Nexon EV",
    specs: "22,000 kms • Electric • Automatic",
    price: "₹11.5 Lakh",
    location: "Kolkata",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop",
  },
  {
    id: "12",
    title: "2017 Hyundai i20 Sportz",
    specs: "58,000 kms • Petrol • Manual",
    price: "₹5.9 Lakh",
    location: "Lucknow",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop",
  },
  {
    id: "13",
    title: "2019 Volkswagen Polo GT",
    specs: "48,000 kms • Petrol • Manual",
    price: "₹7.8 Lakh",
    location: "Chandigarh",
    image:
      "https://images.unsplash.com/photo-1542362565-b07e54358753?w=600&h=400&fit=crop",
  },
  {
    id: "14",
    title: "2020 MG Hector Plus",
    specs: "35,000 kms • Petrol • Automatic",
    price: "₹13.1 Lakh",
    location: "Mumbai",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1619767886555-ef069765baa8?w=600&h=400&fit=crop",
  },
  {
    id: "15",
    title: "2018 Maruti Baleno Alpha",
    specs: "52,000 kms • Petrol • Automatic",
    price: "₹6.4 Lakh",
    location: "Delhi",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&h=400&fit=crop",
  },
  {
    id: "16",
    title: "2022 Skoda Kushaq Style",
    specs: "15,000 kms • Petrol • Automatic",
    price: "₹12.9 Lakh",
    location: "Bangalore",
    badge: "DIRECT OWNER",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop",
  },
  {
    id: "17",
    title: "2019 Honda Amaze VX",
    specs: "44,000 kms • Petrol • Manual",
    price: "₹6.1 Lakh",
    location: "Ahmedabad",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  },
  {
    id: "18",
    title: "2020 Toyota Fortuner 4x2",
    specs: "60,000 kms • Diesel • Automatic",
    price: "₹28.5 Lakh",
    location: "Hyderabad",
    badge: "FEATURED",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
  },
];

export const budgetFilters = [
  "Under ₹2 Lakh",
  "₹2 - ₹4 Lakh",
  "₹4 - ₹6 Lakh",
  "₹6 - ₹10 Lakh",
  "₹10 - ₹15 Lakh",
  "Above ₹15 Lakh",
];

export const recommendedFilters = [
  { label: "Certified Cars", icon: "✓" },
  { label: "Price Drop", icon: "↓" },
  { label: "Under ₹5 Lakh", icon: "₹" },
  { label: "Luxury Cars", icon: "★" },
];
