import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CarCard } from "@/components/CarCard";
import { Button, Chip, EmptyState } from "@/components/ui";
import { Brand, Radius, Space } from "@/constants/brand";
import {
  bodyTypes,
  budgetRanges,
  carBrands,
  cities,
  fuelTypes,
  ownerOptions,
  sortOptions,
  transmissionTypes,
  type SortId,
} from "@/data/options";
import { api } from "@/lib/api";
import type { CarListing } from "@/types/listing";

type Filters = {
  q: string;
  brand: string | null;
  city: string | null;
  fuel: string | null;
  transmission: string | null;
  bodyType: string | null;
  budget: string | null;
  owners: string | null;
  sort: SortId;
};

const EMPTY: Filters = {
  q: "",
  brand: null,
  city: null,
  fuel: null,
  transmission: null,
  bodyType: null,
  budget: null,
  owners: null,
  sort: "relevance",
};

function priceToLakh(car: CarListing): number {
  const inr = Number(car.priceInr);
  if (Number.isFinite(inr) && inr > 0) return inr / 100000;
  const m = /([0-9]+(?:\.[0-9]+)?)/.exec(car.price ?? "");
  return m ? Number(m[1]) : 0;
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ brand?: string; bodyType?: string; budget?: string; city?: string; q?: string }>();

  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY,
    q: params.q ?? "",
    brand: params.brand ?? null,
    bodyType: params.bodyType ?? null,
    budget: params.budget ?? null,
    city: params.city ?? null,
  }));
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);

  const load = useCallback(async (f: Filters) => {
    setLoading(true);
    setError("");
    try {
      const ordering =
        f.sort === "price-asc" ? "price_inr"
        : f.sort === "price-desc" ? "-price_inr"
        : f.sort === "kms-asc" ? "kms"
        : f.sort === "newest" ? "-created_at"
        : undefined;
      const data = await api.listListings({
        q: f.q || undefined,
        brand: f.brand || undefined,
        city: f.city || undefined,
        fuel: f.fuel || undefined,
        transmission: f.transmission || undefined,
        body_type: f.bodyType || undefined,
        owners: f.owners || undefined,
        ordering,
        limit: 100,
      });
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load cars.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  // Budget filter is applied client-side (range → lakh).
  const results = useMemo(() => {
    if (!filters.budget) return cars;
    const range = budgetRanges.find((b) => b.id === filters.budget);
    if (!range) return cars;
    return cars.filter((c) => {
      const lakh = priceToLakh(c);
      return lakh > range.min && lakh <= range.max;
    });
  }, [cars, filters.budget]);

  const activeCount = useMemo(
    () =>
      [filters.brand, filters.city, filters.fuel, filters.transmission, filters.bodyType, filters.budget, filters.owners].filter(
        Boolean
      ).length,
    [filters]
  );

  const openSheet = () => {
    setDraft(filters);
    setSheetOpen(true);
  };
  const applySheet = () => {
    setFilters(draft);
    setSheetOpen(false);
  };
  const clearAll = () => {
    const cleared = { ...EMPTY, q: filters.q };
    setDraft(cleared);
    setFilters(cleared);
    setSheetOpen(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Brand.textMuted} />
          <TextInput
            value={filters.q}
            onChangeText={(q) => setFilters((f) => ({ ...f, q }))}
            placeholder="Search cars…"
            placeholderTextColor={Brand.textFaint}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {filters.q ? (
            <Pressable onPress={() => setFilters((f) => ({ ...f, q: "" }))} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Brand.textMuted} />
            </Pressable>
          ) : null}
        </View>
        <Pressable style={styles.filterBtn} onPress={openSheet}>
          <Ionicons name="options-outline" size={20} color={Brand.white} />
          {activeCount > 0 ? (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.resultBar}>
        <Text style={styles.resultText}>
          {loading ? "Searching…" : `${results.length} cars found`}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {sortOptions.map((s) => (
            <Chip
              key={s.id}
              label={s.label}
              selected={filters.sort === s.id}
              onPress={() => setFilters((f) => ({ ...f, sort: s.id }))}
            />
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : error ? (
        <EmptyState icon="warning-outline" title="Search failed" subtitle={error} action="Retry" onAction={() => load(filters)} />
      ) : results.length === 0 ? (
        <EmptyState title="No cars match your filters" subtitle="Try removing a filter or widening your budget." action="Clear filters" onAction={clearAll} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CarCard
              car={item}
              onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })}
            />
          )}
          ListFooterComponent={<SafeAreaView edges={["bottom"]} />}
        />
      )}

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <Pressable onPress={clearAll} hitSlop={8}>
                <Text style={styles.clearText}>Clear all</Text>
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
              <FilterGroup label="Brand" options={carBrands} value={draft.brand} onChange={(v) => setDraft((d) => ({ ...d, brand: v }))} />
              <FilterGroup label="City" options={cities} value={draft.city} onChange={(v) => setDraft((d) => ({ ...d, city: v }))} />
              <FilterGroup label="Budget" options={budgetRanges.map((b) => b.id)} labels={Object.fromEntries(budgetRanges.map((b) => [b.id, b.label]))} value={draft.budget} onChange={(v) => setDraft((d) => ({ ...d, budget: v }))} />
              <FilterGroup label="Fuel" options={fuelTypes} value={draft.fuel} onChange={(v) => setDraft((d) => ({ ...d, fuel: v }))} />
              <FilterGroup label="Transmission" options={transmissionTypes} value={draft.transmission} onChange={(v) => setDraft((d) => ({ ...d, transmission: v }))} />
              <FilterGroup label="Body type" options={bodyTypes} value={draft.bodyType} onChange={(v) => setDraft((d) => ({ ...d, bodyType: v }))} />
              <FilterGroup label="Owners" options={ownerOptions} value={draft.owners} onChange={(v) => setDraft((d) => ({ ...d, owners: v }))} />
            </ScrollView>
            <View style={styles.sheetFooter}>
              <Button title="Show results" onPress={applySheet} full />
            </View>
            <SafeAreaView edges={["bottom"]} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  labels,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  labels?: Record<string, string>;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.groupChips}>
        {options.map((opt) => (
          <Chip
            key={opt}
            label={labels?.[opt] ?? opt}
            selected={value === opt}
            onPress={() => onChange(value === opt ? null : opt)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  searchHeader: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Brand.dark,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Brand.white,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: Brand.text },
  filterBtn: {
    width: 46,
    backgroundColor: Brand.primary,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  filterCount: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Brand.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filterCountText: { fontSize: 10, fontWeight: "800", color: Brand.primary },

  resultBar: { paddingTop: 12, gap: 10, paddingBottom: 8 },
  resultText: { paddingHorizontal: 16, fontSize: 13, fontWeight: "700", color: Brand.textMuted },

  list: { padding: 16, gap: 14 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Brand.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.border, marginBottom: 8 },
  sheetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: Brand.text },
  clearText: { fontSize: 14, fontWeight: "700", color: Brand.primary },
  group: { marginBottom: 18 },
  groupLabel: { fontSize: 14, fontWeight: "700", color: Brand.text, marginBottom: 10 },
  groupChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sheetFooter: { paddingTop: 8, paddingBottom: 4 },
});
