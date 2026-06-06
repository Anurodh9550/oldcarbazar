import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { compareTips } from "@/data/content";
import { compare } from "@/lib/storage";
import type { CarListing } from "@/types/listing";

const ROWS: { label: string; get: (c: CarListing) => string }[] = [
  { label: "Price", get: (c) => c.price },
  { label: "Year", get: (c) => String(c.year) },
  { label: "KMs", get: (c) => (c.kms ? `${c.kms.toLocaleString("en-IN")} km` : "—") },
  { label: "Fuel", get: (c) => c.fuel || "—" },
  { label: "Transmission", get: (c) => c.transmission || "—" },
  { label: "Owners", get: (c) => c.owners || "—" },
  { label: "Body", get: (c) => c.bodyType || "—" },
  { label: "Location", get: (c) => c.location || "—" },
];

export default function CompareScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<CarListing[]>([]);

  const load = useCallback(() => {
    compare.get().then(setCars);
  }, []);

  useFocusEffect(useCallback(() => load(), [load]));

  const remove = async (id: string) => {
    await compare.remove(id);
    load();
  };

  if (cars.length === 0) {
    return (
      <EmptyState
        icon="git-compare-outline"
        title="No cars to compare"
        subtitle="Add up to 3 cars from any listing to compare them side by side."
        action="Browse cars"
        onAction={() => router.push("/(tabs)/search")}
      />
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            <View style={styles.rowLabelCell} />
            {cars.map((c) => (
              <View key={c.id} style={styles.carCol}>
                <Pressable onPress={() => router.push({ pathname: "/listing/[id]", params: { id: c.id } })}>
                  {c.image ? (
                    <Image source={{ uri: c.image }} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <View style={[styles.thumb, styles.thumbPh]}>
                      <Ionicons name="car-sport" size={28} color={Brand.borderStrong} />
                    </View>
                  )}
                </Pressable>
                <Text style={styles.carTitle} numberOfLines={2}>{c.title}</Text>
                <Pressable onPress={() => remove(c.id)} hitSlop={8} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={18} color={Brand.danger} />
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {ROWS.map((row, i) => (
            <View key={row.label} style={[styles.dataRow, i % 2 === 0 && styles.dataRowAlt]}>
              <View style={styles.rowLabelCell}>
                <Text style={styles.rowLabel}>{row.label}</Text>
              </View>
              {cars.map((c) => (
                <View key={c.id} style={styles.carCol}>
                  <Text style={[styles.cellValue, row.label === "Price" && styles.priceValue]}>{row.get(c)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Comparison tips</Text>
        {compareTips.map((t) => (
          <Text key={t} style={styles.tip}>• {t}</Text>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Button title="Add more cars" icon="add" variant="outline" onPress={() => router.push("/(tabs)/search")} full />
      </View>
    </ScrollView>
  );
}

const COL = 150;
const LABEL = 110;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  headerRow: { flexDirection: "row", padding: 12, backgroundColor: Brand.white, borderBottomWidth: 1, borderBottomColor: Brand.border },
  rowLabelCell: { width: LABEL, justifyContent: "center" },
  carCol: { width: COL, paddingHorizontal: 8, alignItems: "center" },
  thumb: { width: COL - 20, height: 80, borderRadius: Radius.sm, backgroundColor: "#eee" },
  thumbPh: { alignItems: "center", justifyContent: "center" },
  carTitle: { fontSize: 12, fontWeight: "700", color: Brand.text, textAlign: "center", marginTop: 6 },
  removeBtn: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  removeText: { fontSize: 11, color: Brand.danger, fontWeight: "600" },
  dataRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 12 },
  dataRowAlt: { backgroundColor: Brand.white },
  rowLabel: { fontSize: 13, fontWeight: "700", color: Brand.textMuted },
  cellValue: { fontSize: 13, color: Brand.text, textAlign: "center", fontWeight: "600" },
  priceValue: { color: Brand.primary, fontWeight: "800" },
  tips: { margin: 16, backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16, gap: 6 },
  tipsTitle: { fontSize: 14, fontWeight: "800", color: Brand.text, marginBottom: 2 },
  tip: { fontSize: 13, color: Brand.textMuted, lineHeight: 19 },
});
