import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Badge, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { formatPriceInr } from "@/lib/format";
import { api, type DealerCard } from "@/lib/api";

export default function DealersScreen() {
  const router = useRouter();
  const [dealers, setDealers] = useState<DealerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(async (search = "") => {
    setLoading(true);
    setError("");
    try {
      setDealers(await api.listDealers({ q: search || undefined, sort: "listings" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dealers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 350);
    return () => clearTimeout(t);
  }, [q, load]);

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Brand.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search dealers or cities…"
            placeholderTextColor={Brand.textFaint}
            style={styles.searchInput}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : error ? (
        <EmptyState icon="warning-outline" title="Couldn't load" subtitle={error} action="Retry" onAction={() => load(q)} />
      ) : dealers.length === 0 ? (
        <EmptyState icon="business-outline" title="No dealers found" subtitle="Try a different search." />
      ) : (
        <FlatList
          data={dealers}
          keyExtractor={(d) => d.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push({ pathname: "/dealers/[id]", params: { id: item.id } })}>
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{item.name?.[0]?.toUpperCase() ?? "D"}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  {item.is_pro ? <Badge label="PRO" tone="primary" /> : null}
                </View>
                <Text style={styles.city}>📍 {item.primary_city}</Text>
                <Text style={styles.meta}>
                  {item.active_listings_count} cars
                  {item.min_price_inr ? ` · from ${formatPriceInr(item.min_price_inr)}` : ""}
                </Text>
                {item.brands.length > 0 ? (
                  <Text style={styles.brands} numberOfLines={1}>{item.brands.slice(0, 4).join(" · ")}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Brand.textFaint} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  searchWrap: { padding: 16, backgroundColor: Brand.dark },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Brand.white, borderRadius: Radius.md, paddingHorizontal: 12 },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: Brand.text },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, gap: 12 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eee" },
  avatarPlaceholder: { backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Brand.white, fontSize: 22, fontWeight: "800" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 16, fontWeight: "700", color: Brand.text, flexShrink: 1 },
  city: { fontSize: 13, color: Brand.textMuted, marginTop: 2 },
  meta: { fontSize: 13, color: Brand.text, marginTop: 2, fontWeight: "600" },
  brands: { fontSize: 12, color: Brand.textFaint, marginTop: 2 },
});
