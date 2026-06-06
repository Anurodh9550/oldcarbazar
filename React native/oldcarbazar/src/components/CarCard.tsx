import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radius, Shadow } from "@/constants/brand";
import { shortlist } from "@/lib/storage";
import type { CarListing } from "@/types/listing";

type Props = {
  car: CarListing;
  onPress: () => void;
  compact?: boolean;
  showShortlist?: boolean;
  onShortlistChange?: (saved: boolean) => void;
};

export function CarCard({ car, onPress, compact, showShortlist = true, onShortlistChange }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    shortlist.has(car.id).then((v) => active && setSaved(v));
    return () => {
      active = false;
    };
  }, [car.id]);

  const toggleSave = async () => {
    const next = await shortlist.toggle(car);
    setSaved(next);
    onShortlistChange?.(next);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
        {car.image ? (
          <Image source={{ uri: car.image }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="car-sport" size={44} color={Brand.borderStrong} />
          </View>
        )}
        {showShortlist ? (
          <Pressable style={styles.heart} onPress={toggleSave} hitSlop={8}>
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={18}
              color={saved ? Brand.primary : Brand.white}
            />
          </Pressable>
        ) : null}
        <View style={styles.badgeRow}>
          {car.featured ? (
            <View style={[styles.badge, styles.featuredBadge]}>
              <Text style={styles.badgeText}>FEATURED</Text>
            </View>
          ) : null}
          {car.isBoosted ? (
            <View style={[styles.badge, styles.boostBadge]}>
              <Ionicons name="rocket" size={10} color={Brand.white} />
              <Text style={styles.badgeText}>BOOSTED</Text>
            </View>
          ) : null}
        </View>
        {car.year ? (
          <View style={styles.yearTag}>
            <Text style={styles.yearText}>{car.year}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {car.title}
        </Text>
        <Text style={styles.price}>{car.price}</Text>
        <Text style={styles.specs} numberOfLines={1}>
          {car.specs}
        </Text>
        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Brand.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {car.location}
            </Text>
          </View>
          {car.views ? (
            <Text style={styles.views}>
              <Ionicons name="eye-outline" size={12} color={Brand.textFaint} /> {car.views}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.white,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Brand.border,
    ...Shadow.card,
  },
  cardCompact: { width: 240 },
  pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  imageWrap: { position: "relative", height: 180, backgroundColor: "#eee" },
  imageWrapCompact: { height: 150 },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  badgeRow: { position: "absolute", top: 10, left: 10, flexDirection: "row", gap: 6 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  featuredBadge: { backgroundColor: Brand.dark },
  boostBadge: { backgroundColor: Brand.primary },
  badgeText: { color: Brand.white, fontSize: 9, fontWeight: "800", letterSpacing: 0.4 },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  yearTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  yearText: { color: Brand.white, fontSize: 11, fontWeight: "700" },
  body: { padding: 14, gap: 3 },
  title: { fontSize: 15, fontWeight: "700", color: Brand.text },
  price: { fontSize: 19, fontWeight: "800", color: Brand.primary, marginTop: 2 },
  specs: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, flex: 1 },
  location: { fontSize: 12, color: Brand.textMuted, flexShrink: 1 },
  views: { fontSize: 12, color: Brand.textFaint },
});
