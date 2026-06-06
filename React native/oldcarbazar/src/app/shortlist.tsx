import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CarCard } from "@/components/CarCard";
import { EmptyState } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { shortlist } from "@/lib/storage";
import type { CarListing } from "@/types/listing";

export default function ShortlistScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<CarListing[]>([]);

  const load = useCallback(() => {
    shortlist.get().then(setCars);
  }, []);

  useFocusEffect(useCallback(() => load(), [load]));

  if (cars.length === 0) {
    return (
      <EmptyState
        icon="heart-outline"
        title="No saved cars yet"
        subtitle="Tap the heart on any car to save it here for later."
        action="Browse cars"
        onAction={() => router.push("/(tabs)/search")}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.list}>
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })}
          onShortlistChange={(saved) => {
            if (!saved) setCars((c) => c.filter((x) => x.id !== car.id));
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  list: { padding: 16, gap: 14 },
});
