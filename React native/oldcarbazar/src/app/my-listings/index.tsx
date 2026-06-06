import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BoostSheet } from "@/components/BoostSheet";
import { Badge, Button, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { CarListing, ListingStatus } from "@/types/listing";

function statusTone(status?: ListingStatus): "success" | "warning" | "neutral" | "danger" {
  if (status === "published") return "success";
  if (status === "sold") return "neutral";
  if (status === "inactive") return "danger";
  return "warning";
}

export default function MyListingsScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [boostCar, setBoostCar] = useState<CarListing | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setListings(await api.myListings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load listings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) load();
      else setLoading(false);
    }, [isLoggedIn, load])
  );

  const changeStatus = async (car: CarListing, status: ListingStatus) => {
    try {
      const updated = await api.updateListingStatus(car.id, status);
      setListings((list) => list.map((l) => (l.id === car.id ? updated : l)));
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Could not update.");
    }
  };

  const confirmDelete = (car: CarListing) => {
    Alert.alert("Delete listing", `Remove "${car.title}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteListing(car.id);
            setListings((list) => list.filter((l) => l.id !== car.id));
          } catch (err) {
            Alert.alert("Failed", err instanceof Error ? err.message : "Could not delete.");
          }
        },
      },
    ]);
  };

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="lock-closed-outline"
        title="Login required"
        subtitle="Login to manage your car listings."
        action="Login"
        onAction={() => router.push("/login")}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }

  if (error) {
    return <EmptyState icon="warning-outline" title="Couldn't load" subtitle={error} action="Retry" onAction={() => load()} />;
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon="car-outline"
        title="No listings yet"
        subtitle="Post your first car ad and start getting buyers."
        action="Sell a car"
        onAction={() => router.push("/(tabs)/sell")}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Brand.primary} />}
    >
      {listings.map((car) => (
        <View key={car.id} style={styles.card}>
          <Pressable style={styles.cardTop} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })}>
            {car.image ? (
              <Image source={{ uri: car.image }} style={styles.thumb} contentFit="cover" />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Ionicons name="car-sport" size={26} color={Brand.borderStrong} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{car.title}</Text>
              <Text style={styles.price}>{car.price}</Text>
              <View style={styles.metaRow}>
                <Badge label={car.status ?? "draft"} tone={statusTone(car.status)} />
                {car.isBoosted ? <Badge label="Boosted" tone="primary" /> : null}
                {car.moderation === "pending" ? <Badge label="In review" tone="warning" /> : null}
                {car.moderation === "rejected" ? <Badge label="Rejected" tone="danger" /> : null}
              </View>
              <Text style={styles.stats}>👁 {car.views} · 💬 {car.inquiries}</Text>
            </View>
          </Pressable>

          {car.rejectedReason ? <Text style={styles.rejected}>Reason: {car.rejectedReason}</Text> : null}

          {car.status === "published" ? (
            <Button
              title={car.isBoosted ? "Extend boost" : "Boost listing"}
              icon="rocket-outline"
              small
              onPress={() => setBoostCar(car)}
              full
            />
          ) : null}

          <View style={styles.actions}>
            <Button title="Edit" variant="outline" small icon="create-outline" onPress={() => router.push({ pathname: "/my-listings/[id]/edit", params: { id: car.id } })} style={{ flex: 1 }} />
            {car.status === "published" ? (
              <Button title="Mark sold" variant="outline" small icon="checkmark-done-outline" onPress={() => changeStatus(car, "sold")} style={{ flex: 1 }} />
            ) : (
              <Button title="Publish" variant="outline" small icon="cloud-upload-outline" onPress={() => changeStatus(car, "published")} style={{ flex: 1 }} />
            )}
            <Button title="Delete" variant="outline" small icon="trash-outline" onPress={() => confirmDelete(car)} style={{ flex: 1 }} />
          </View>
        </View>
      ))}

      {boostCar ? (
        <BoostSheet
          listingId={boostCar.id}
          listingTitle={boostCar.title}
          visible={!!boostCar}
          onClose={() => setBoostCar(null)}
          onBoosted={(updated) => {
            setListings((list) => list.map((l) => (l.id === updated.id ? updated : l)));
            setBoostCar(null);
            Alert.alert("Boosted!", "Your listing now has top placement.");
          }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Brand.bg },
  list: { padding: 16, gap: 14 },
  card: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 12, gap: 10 },
  cardTop: { flexDirection: "row", gap: 12 },
  thumb: { width: 90, height: 70, borderRadius: Radius.md, backgroundColor: "#eee" },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, fontWeight: "700", color: Brand.text },
  price: { fontSize: 16, fontWeight: "800", color: Brand.primary, marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" },
  stats: { fontSize: 12, color: Brand.textMuted, marginTop: 6 },
  rejected: { fontSize: 12, color: Brand.danger },
  actions: { flexDirection: "row", gap: 8 },
});
