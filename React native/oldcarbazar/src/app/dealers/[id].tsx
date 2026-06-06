import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import { CarCard } from "@/components/CarCard";
import { Badge, Button, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { apiListingToCarListing, api, type DealerDetail } from "@/lib/api";

export default function DealerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dealer, setDealer] = useState<DealerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      setDealer(await api.getDealer(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dealer.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }
  if (error || !dealer) {
    return <EmptyState icon="warning-outline" title="Couldn't load dealer" subtitle={error} action="Retry" onAction={load} />;
  }

  const cars = (dealer.listings ?? []).map(apiListingToCarListing);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.header}>
        {dealer.avatar_url ? (
          <Image source={{ uri: dealer.avatar_url }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{dealer.name?.[0]?.toUpperCase() ?? "D"}</Text>
          </View>
        )}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{dealer.name}</Text>
          {dealer.is_pro ? <Badge label="PRO" tone="primary" /> : null}
        </View>
        <Text style={styles.city}>📍 {dealer.cities?.join(", ") || dealer.primary_city}</Text>
        <View style={styles.statRow}>
          <Stat label="Active cars" value={String(dealer.total_listings_count ?? cars.length)} />
          <Stat label="Brands" value={String(dealer.brands?.length ?? 0)} />
          <Stat label="Member since" value={dealer.member_since ? new Date(dealer.member_since).getFullYear().toString() : "—"} />
        </View>
        {dealer.phone ? (
          <Button title="Call dealer" icon="call" variant="dark" onPress={() => Linking.openURL(`tel:${dealer.phone}`)} style={{ marginTop: 14 }} full />
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Cars by this dealer ({cars.length})</Text>
      <View style={styles.list}>
        {cars.length === 0 ? (
          <EmptyState title="No active cars" subtitle="This dealer has no live listings right now." />
        ) : (
          cars.map((car) => (
            <CarCard key={car.id} car={car} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { backgroundColor: Brand.white, padding: 20, alignItems: "center", borderBottomWidth: 1, borderBottomColor: Brand.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#eee" },
  avatarPlaceholder: { backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Brand.white, fontSize: 30, fontWeight: "800" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  name: { fontSize: 20, fontWeight: "800", color: Brand.text },
  city: { fontSize: 14, color: Brand.textMuted, marginTop: 4 },
  statRow: { flexDirection: "row", gap: 24, marginTop: 16 },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: Brand.text },
  statLabel: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Brand.text, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  list: { paddingHorizontal: 16, gap: 14 },
});
