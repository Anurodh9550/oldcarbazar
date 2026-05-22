"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useListings } from "@/context/ListingsContext";
import { cities, DEFAULT_CITY, getCityStats } from "@/data/locations";
import type { CarListing } from "@/data/cars";

type LocationContextValue = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cityStats: ReturnType<typeof getCityStats>;
  filteredCars: CarListing[];
  totalCarsInCity: number;
};

const LocationContext = createContext<LocationContextValue | null>(null);

const popularNameSet = new Set(cities.map((c) => c.name.toLowerCase()));

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { allListings, userListings } = useListings();
  const [selectedCity, setSelectedCityState] = useState<string>(DEFAULT_CITY);

  const setSelectedCity = useCallback((city: string) => {
    setSelectedCityState(city);
  }, []);

  const filteredCars = useMemo(
    () => allListings.filter((car) => car.location === selectedCity),
    [allListings, selectedCity]
  );

  const totalCarsInCity = useMemo(() => {
    const isPopular = popularNameSet.has(selectedCity.toLowerCase());
    const base = isPopular ? getCityStats(selectedCity).carCount : 0;
    const userInCity = userListings.filter((c) => c.location === selectedCity).length;
    return base + userInCity;
  }, [selectedCity, userListings]);

  const cityStats = useMemo(() => getCityStats(selectedCity), [selectedCity]);

  const value = useMemo(
    () => ({
      selectedCity,
      setSelectedCity,
      cityStats,
      filteredCars,
      totalCarsInCity,
    }),
    [selectedCity, setSelectedCity, cityStats, filteredCars, totalCarsInCity]
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return ctx;
}
