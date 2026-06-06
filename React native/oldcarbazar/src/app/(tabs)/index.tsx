import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CarCard } from "@/components/CarCard";
import { GradientHeaderBackground } from "@/components/GradientHeader";
import { Chip, EmptyState, SectionTitle } from "@/components/ui";
import { Brand, Radius, Shadow, Space } from "@/constants/brand";
import { bodyTypes, budgetRanges, popularBrands } from "@/data/options";
import { api } from "@/lib/api";
import { recentlyViewed } from "@/lib/storage";
import type { CarListing } from "@/types/listing";

const HERO_TRIGGER = 150;

const QUICK_ACTIONS = [
  { key: "sell", label: "Sell Car", icon: "cash-outline", route: "/(tabs)/sell" },
  { key: "dealers", label: "Dealers", icon: "business-outline", route: "/dealers" },
  { key: "emi", label: "EMI Calc", icon: "calculator-outline", route: "/emi" },
  { key: "services", label: "Services", icon: "grid-outline", route: "/services" },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<CarListing[]>([]);
  const [headerActive, setHeaderActive] = useState(false);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      const active = e.contentOffset.y > HERO_TRIGGER;
      runOnJS(setHeaderActive)(active);
    },
  });

  const headerAnimStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [HERO_TRIGGER - 50, HERO_TRIGGER],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [-12, 0]) }],
    };
  });

  const heroParallax = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-120, 0], [-60, 0], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-120, 0], [1.18, 1], Extrapolation.CLAMP) },
    ],
  }));

  useFocusEffect(
    useCallback(() => {
      recentlyViewed.get().then(setRecent);
    }, [])
  );

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await api.listListings({ limit: 50 });
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load cars.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featured = useMemo(
    () => cars.filter((c) => c.featured || c.isBoosted).slice(0, 8),
    [cars]
  );
  const latest = useMemo(() => cars.slice(0, 12), [cars]);

  const goSearch = (params?: Record<string, string>) =>
    router.push({ pathname: "/(tabs)/search", params });

  return (
    <View style={styles.screen}>
      <Animated.View
        pointerEvents={headerActive ? "auto" : "none"}
        style={[styles.floatHeader, { paddingTop: insets.top, height: insets.top + 54 }, headerAnimStyle]}
      >
        <GradientHeaderBackground />
        <View style={styles.floatHeaderRow}>
          <Text style={styles.floatHeaderTitle}>Old Car Bazar</Text>
          <Pressable style={styles.floatSearchBtn} onPress={() => goSearch()} hitSlop={8}>
            <Ionicons name="search" size={20} color={Brand.white} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Brand.primary} />
        }
      >
        <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Animated.View style={[StyleSheet.absoluteFill, heroParallax]}>
            <ImageBackground
              source={require("../../../assets/images/hero-bg.png")}
              style={StyleSheet.absoluteFill}
              imageStyle={styles.heroImage}
            />
          </Animated.View>
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTag}>INDIA&apos;S USED CAR MARKETPLACE</Text>
          <Text style={styles.heroTitle}>Find Your Perfect Used Car</Text>
          <Pressable style={styles.searchBar} onPress={() => goSearch()}>
            <Ionicons name="search" size={18} color={Brand.textMuted} />
            <Text style={styles.searchPlaceholder}>Search by brand, model or city…</Text>
          </Pressable>
          <Text style={styles.heroSub}>
            {loading ? "Loading listings…" : `${cars.length} verified cars available`}
          </Text>
        </View>

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            style={styles.quickAction}
            onPress={() => router.push(a.route as never)}
          >
            <View style={styles.quickIcon}>
              <Ionicons name={a.icon as never} size={22} color={Brand.primary} />
            </View>
            <Text style={styles.quickLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Popular Brands" action="View all" onAction={() => goSearch()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
        {popularBrands.map((b) => (
          <Chip key={b} label={b} onPress={() => goSearch({ brand: b })} />
        ))}
      </ScrollView>

      <SectionTitle title="Browse by Budget" />
      <View style={styles.budgetGrid}>
        {budgetRanges.map((b) => (
          <Pressable key={b.id} style={styles.budgetCard} onPress={() => goSearch({ budget: b.id })}>
            <Ionicons name="pricetag" size={18} color={Brand.primary} />
            <Text style={styles.budgetLabel}>{b.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Body Type" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
        {bodyTypes.map((b) => (
          <Chip key={b} label={b} onPress={() => goSearch({ bodyType: b })} />
        ))}
      </ScrollView>

      {featured.length > 0 ? (
        <>
          <SectionTitle title="Featured & Boosted" action="See all" onAction={() => goSearch()} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featured.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                compact
                onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })}
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      {recent.length > 0 ? (
        <>
          <SectionTitle title="Recently Viewed" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {recent.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                compact
                onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })}
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      <SectionTitle title="Latest Listings" action="View all" onAction={() => goSearch()} />
      <View style={styles.list}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Brand.primary} />
          </View>
        ) : error ? (
          <EmptyState icon="warning-outline" title="Couldn't load cars" subtitle={error} action="Retry" onAction={() => load()} />
        ) : latest.length === 0 ? (
          <EmptyState title="No cars listed yet" subtitle="Check back soon for fresh listings." />
        ) : (
          latest.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onPress={() => router.push({ pathname: "/listing/[id]", params: { id: car.id } })}
            />
          ))
        )}
      </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  floatHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    justifyContent: "flex-end",
    overflow: "hidden",
    ...Shadow.card,
  },
  floatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  floatHeaderTitle: { color: Brand.white, fontSize: 18, fontWeight: "800" },
  floatSearchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { backgroundColor: Brand.dark, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, overflow: "hidden" },
  heroImage: { resizeMode: "cover" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,12,0.55)" },
  heroTag: {
    color: "#ffb59a",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: Brand.white,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    maxWidth: "75%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Brand.white,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 14,
  },
  searchPlaceholder: { color: Brand.textMuted, fontSize: 14 },
  heroSub: { color: Brand.textFaint, fontSize: 13, marginTop: 12 },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -14,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Brand.white,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: Radius.md,
    gap: 6,
    ...Shadow.card,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Brand.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { fontSize: 11, fontWeight: "700", color: Brand.text },

  chipScroll: { gap: 8, paddingHorizontal: 16 },
  featuredScroll: { gap: 12, paddingHorizontal: 16 },

  budgetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
  },
  budgetCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  budgetLabel: { fontSize: 13, fontWeight: "700", color: Brand.text, flexShrink: 1 },

  list: { paddingHorizontal: 16, gap: 14 },
  center: { paddingVertical: 40, alignItems: "center" },
});
