export const nearbyCities = [
  "Vadodara", "Gandhinagar", "Mehsana", "Anand", "Rajkot",
  "Bhavnagar", "Surat", "Jamnagar", "Junagadh", "Morbi",
  "Bharuch", "Navsari", "Valsad", "Palanpur", "Himmatnagar",
];

export const bodyTypes = [
  "Hatchback", "SUV", "Sedan", "MUV", "Minivan", "Coupe",
];

export const exploreBrands = [
  { name: "Hyundai", slug: "hyundai" },
  { name: "Maruti", slug: "maruti" },
  { name: "Tata", slug: "tata" },
  { name: "Honda", slug: "honda" },
  { name: "Toyota", slug: "toyota" },
  { name: "Mahindra", slug: "mahindra" },
  { name: "Kia", slug: "kia" },
  { name: "Ford", slug: "ford" },
  { name: "Renault", slug: "renault" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "MG", slug: "mg" },
  { name: "Skoda", slug: "skoda" },
  { name: "Nissan", slug: "nissan" },
  { name: "Jeep", slug: "jeep" },
  { name: "Datsun", slug: "datsun" },
  { name: "Chevrolet", slug: "chevrolet" },
  { name: "Fiat", slug: "fiat" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "BMW", slug: "bmw" },
  { name: "Audi", slug: "audi" },
  { name: "Volvo", slug: "volvo" },
  { name: "Citroen", slug: "citroen" },
  { name: "Land Rover", slug: "land-rover" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Mini", slug: "mini" },
  { name: "Suzuki", slug: "suzuki" },
];

export function getBrandNameFromSlug(slug: string): string {
  const found = exploreBrands.find((b) => b.slug === slug.toLowerCase());
  if (found) return found.name;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function getBrandSlugFromName(name: string): string {
  const found = exploreBrands.find(
    (b) => b.name.toLowerCase() === name.toLowerCase()
  );
  return found?.slug ?? name.toLowerCase().replace(/\s+/g, "-");
}

export const budgetTabs = [
  { id: "0-5", label: "0 - 5 Lakh" },
  { id: "5-10", label: "5 - 10 Lakh" },
  { id: "10-15", label: "10 - 15 Lakh" },
  { id: "15-20", label: "15 - 20 Lakh" },
];

export const fuelTypes = [
  { id: "Petrol", label: "Petrol", icon: "⛽" },
  { id: "Diesel", label: "Diesel", icon: "🛢️" },
  { id: "CNG", label: "CNG", icon: "🔥" },
  { id: "Electric", label: "Electric", icon: "⚡" },
  { id: "LPG", label: "LPG", icon: "🔥" },
];

export const recentBudgetTabs = [
  { id: "0-3", label: "0 - 3 Lakh" },
  { id: "3-5", label: "3 - 5 Lakh" },
  { id: "5-10", label: "5 - 10 Lakh" },
  { id: "10+", label: "Above 10 Lakh" },
];

export const sellCarCities = [
  "Agra", "Ahmedabad", "Ajmer", "Bangalore", "Bhubaneswar", "Chandigarh",
  "Chennai", "Dehradun", "Delhi", "Faridabad", "Gandhinagar", "Ghaziabad",
  "Gurugram", "Hyderabad", "Jaipur", "Kolkata", "Lucknow", "Mumbai",
  "Noida", "Pune", "Rajkot", "Surat", "Vadodara", "Indore", "Bhopal",
  "Nagpur", "Patna", "Kochi", "Coimbatore", "Visakhapatnam", "Mysore",
  "Thane", "Nashik", "Amritsar", "Ludhiana", "Jodhpur", "Udaipur",
];

export const cityGradients = [
  "from-blue-500 to-blue-700",
  "from-orange-400 to-orange-600",
  "from-purple-500 to-purple-700",
  "from-teal-500 to-teal-700",
  "from-rose-500 to-rose-700",
  "from-indigo-500 to-indigo-700",
];
