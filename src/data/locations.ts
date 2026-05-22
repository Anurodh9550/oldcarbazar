export const cities = [
  { name: "Ahmedabad", state: "Gujarat", carCount: 1553, popular: true },
  { name: "Mumbai", state: "Maharashtra", carCount: 2840, popular: true },
  { name: "Delhi", state: "Delhi NCR", carCount: 3120, popular: true },
  { name: "Bangalore", state: "Karnataka", carCount: 2210, popular: true },
  { name: "Hyderabad", state: "Telangana", carCount: 1890, popular: true },
  { name: "Chennai", state: "Tamil Nadu", carCount: 1650, popular: true },
  { name: "Pune", state: "Maharashtra", carCount: 1420, popular: true },
  { name: "Kolkata", state: "West Bengal", carCount: 1340, popular: true },
  { name: "Surat", state: "Gujarat", carCount: 980, popular: false },
  { name: "Jaipur", state: "Rajasthan", carCount: 870, popular: false },
  { name: "Lucknow", state: "Uttar Pradesh", carCount: 760, popular: false },
  { name: "Chandigarh", state: "Punjab", carCount: 540, popular: false },
  { name: "Gurugram", state: "Haryana", carCount: 720, popular: false },
  { name: "Noida", state: "Uttar Pradesh", carCount: 680, popular: false },
  { name: "Ghaziabad", state: "Uttar Pradesh", carCount: 510, popular: false },
  { name: "Faridabad", state: "Haryana", carCount: 430, popular: false },
  { name: "Thane", state: "Maharashtra", carCount: 620, popular: false },
  { name: "Nashik", state: "Maharashtra", carCount: 390, popular: false },
  { name: "Nagpur", state: "Maharashtra", carCount: 410, popular: false },
  { name: "Indore", state: "Madhya Pradesh", carCount: 520, popular: false },
  { name: "Bhopal", state: "Madhya Pradesh", carCount: 380, popular: false },
  { name: "Vadodara", state: "Gujarat", carCount: 420, popular: false },
  { name: "Rajkot", state: "Gujarat", carCount: 350, popular: false },
  { name: "Gandhinagar", state: "Gujarat", carCount: 290, popular: false },
  { name: "Coimbatore", state: "Tamil Nadu", carCount: 340, popular: false },
  { name: "Kochi", state: "Kerala", carCount: 310, popular: false },
  { name: "Visakhapatnam", state: "Andhra Pradesh", carCount: 320, popular: false },
  { name: "Mysore", state: "Karnataka", carCount: 270, popular: false },
  { name: "Patna", state: "Bihar", carCount: 280, popular: false },
  { name: "Bhubaneswar", state: "Odisha", carCount: 260, popular: false },
  { name: "Dehradun", state: "Uttarakhand", carCount: 240, popular: false },
  { name: "Amritsar", state: "Punjab", carCount: 220, popular: false },
  { name: "Ludhiana", state: "Punjab", carCount: 290, popular: false },
  { name: "Jodhpur", state: "Rajasthan", carCount: 230, popular: false },
  { name: "Udaipur", state: "Rajasthan", carCount: 190, popular: false },
  { name: "Agra", state: "Uttar Pradesh", carCount: 250, popular: false },
  { name: "Ajmer", state: "Rajasthan", carCount: 170, popular: false },
] as const;

export type CityName = (typeof cities)[number]["name"];

export const DEFAULT_CITY: CityName = "Ahmedabad";

export function getCityStats(cityName: string) {
  return cities.find((c) => c.name === cityName) ?? cities[0];
}
