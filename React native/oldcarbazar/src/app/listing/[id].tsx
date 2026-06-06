import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Button } from "@/components/ui";
import { Brand, Radius, Space } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { whatsappUrl } from "@/lib/format";
import { api } from "@/lib/api";
import { compare, recentlyViewed, shortlist } from "@/lib/storage";
import type { CarListing } from "@/types/listing";

type ContactMode = "inquiry" | "testdrive" | "offer" | null;

export default function CarDetailScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [car, setCar] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [mode, setMode] = useState<ContactMode>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.getListing(id);
      setCar(data);
      recentlyViewed.add(data);
      setSaved(await shortlist.has(data.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load car.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSave = async () => {
    if (!car) return;
    setSaved(await shortlist.toggle(car));
  };

  const addToCompare = async () => {
    if (!car) return;
    const res = await compare.toggle(car);
    if (res.full) {
      Alert.alert("Compare full", "You can compare up to 3 cars. Remove one first.");
    } else {
      Alert.alert(res.added ? "Added to compare" : "Removed from compare");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }
  if (error || !car) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Car not found."}</Text>
        <Button title="Retry" onPress={load} small />
      </View>
    );
  }

  const images = car.images?.length ? car.images : car.image ? [car.image] : [];
  const waMessage = `Hi, I'm interested in your car: ${car.title} (${car.price}) on Old Car Bazar.`;

  const specRaw: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string }[] = [
    { icon: "calendar-outline", label: "Year", value: String(car.year) },
    { icon: "speedometer-outline", label: "Driven", value: car.kms ? `${car.kms.toLocaleString("en-IN")} km` : undefined },
    { icon: "water-outline", label: "Fuel", value: car.fuel },
    { icon: "cog-outline", label: "Transmission", value: car.transmission },
    { icon: "people-outline", label: "Owners", value: car.owners },
    { icon: "car-outline", label: "Body", value: car.bodyType },
    { icon: "color-palette-outline", label: "Color", value: car.color },
    { icon: "person-outline", label: "Seats", value: car.seats ? `${car.seats}` : undefined },
  ];
  const specs = specRaw.filter((s) => s.value);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {images.length > 0 ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))
              }
            >
              {images.map((uri, i) => (
                <Image key={`${uri}-${i}`} source={{ uri }} style={{ width, height: 280 }} contentFit="cover" />
              ))}
            </ScrollView>
            {images.length > 1 ? (
              <View style={styles.dots}>
                {images.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeImg && styles.dotActive]} />
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[styles.placeholder, { width, height: 280 }]}>
            <Ionicons name="car-sport" size={72} color={Brand.borderStrong} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            {car.featured ? <Badge label="FEATURED" tone="primary" /> : null}
            {car.isBoosted ? <Badge label="BOOSTED" tone="warning" /> : null}
            <Badge label="DIRECT OWNER" tone="success" />
          </View>
          <Text style={styles.title}>{car.title}</Text>
          <Text style={styles.price}>{car.price}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={15} color={Brand.textMuted} />
            <Text style={styles.location}>{car.area ? `${car.area}, ` : ""}{car.location}</Text>
          </View>

          <View style={styles.specGrid}>
            {specs.map((s) => (
              <View key={s.label} style={styles.specItem}>
                <Ionicons name={s.icon} size={18} color={Brand.primary} />
                <View>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>{s.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {car.features && car.features.length > 0 ? (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featureWrap}>
                {car.features.map((f) => (
                  <View key={f} style={styles.featurePill}>
                    <Ionicons name="checkmark-circle" size={14} color={Brand.success} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {car.description ? (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.desc}>{car.description}</Text>
            </View>
          ) : null}

          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{car.sellerName?.[0]?.toUpperCase() ?? "S"}</Text>
              </View>
              <View>
                <Text style={styles.sellerName}>{car.sellerName}</Text>
                <Text style={styles.sellerMeta}>{car.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.stats}>
            <Text style={styles.statText}>👁 {car.views} views</Text>
            <Text style={styles.statText}>💬 {car.inquiries} inquiries</Text>
          </View>

          <View style={styles.actionGrid}>
            <Button title={saved ? "Saved" : "Save"} icon={saved ? "heart" : "heart-outline"} variant="outline" onPress={toggleSave} style={{ flex: 1 }} small />
            <Button title="Compare" icon="git-compare-outline" variant="outline" onPress={addToCompare} style={{ flex: 1 }} small />
          </View>
          <View style={styles.actionGrid}>
            <Button title="Send Inquiry" icon="chatbubble-ellipses-outline" variant="outline" onPress={() => setMode("inquiry")} style={{ flex: 1 }} small />
            <Button title="Test Drive" icon="car-sport-outline" variant="outline" onPress={() => setMode("testdrive")} style={{ flex: 1 }} small />
            <Button title="Make Offer" icon="pricetag-outline" variant="outline" onPress={() => setMode("offer")} style={{ flex: 1 }} small />
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomBar}>
        <Button title="Call" icon="call" variant="dark" onPress={() => Linking.openURL(`tel:${car.phone}`)} style={{ flex: 1 }} />
        <Button title="WhatsApp" icon="logo-whatsapp" variant="whatsapp" onPress={() => Linking.openURL(whatsappUrl(car.phone, waMessage))} style={{ flex: 1 }} />
      </SafeAreaView>

      <ContactModal
        mode={mode}
        car={car}
        defaultName={user?.name ?? ""}
        defaultPhone={user?.phone ?? ""}
        onClose={() => setMode(null)}
      />
    </View>
  );
}

function ContactModal({
  mode,
  car,
  defaultName,
  defaultPhone,
  onClose,
}: {
  mode: ContactMode;
  car: CarListing;
  defaultName: string;
  defaultPhone: string;
  onClose: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(defaultName);
    setPhone(defaultPhone);
    setMessage("");
    setAmount("");
    setWhen("");
  }, [mode, defaultName, defaultPhone]);

  const title =
    mode === "inquiry" ? "Send Inquiry" : mode === "testdrive" ? "Book Test Drive" : "Make an Offer";

  const submit = async () => {
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) {
      Alert.alert("Missing details", "Please enter your name and a valid 10-digit phone number.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "inquiry") {
        await api.createInquiry({ listing: car.id, buyer_name: name, buyer_phone: phone, message });
      } else if (mode === "testdrive") {
        const scheduled = when.trim() ? when : new Date(Date.now() + 86400000).toISOString();
        await api.createTestDrive({ listing: car.id, buyer_name: name, buyer_phone: phone, scheduled_at: scheduled, message });
      } else if (mode === "offer") {
        const amt = Number(amount.replace(/\D/g, ""));
        if (!amt) {
          Alert.alert("Enter amount", "Please enter your offer amount in rupees.");
          setBusy(false);
          return;
        }
        await api.createOffer({ listing: car.id, buyer_name: name, buyer_phone: phone, amount: amt, message });
      }
      Alert.alert("Sent!", "The seller has received your request and will contact you soon.");
      onClose();
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Could not send. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={mode !== null} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={Brand.text} />
            </Pressable>
          </View>
          <Text style={styles.sheetCar}>{car.title} · {car.price}</Text>

          <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Brand.textFaint} style={styles.input} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" placeholderTextColor={Brand.textFaint} style={styles.input} />
          {mode === "offer" ? (
            <TextInput value={amount} onChangeText={setAmount} placeholder="Offer amount (₹)" keyboardType="number-pad" placeholderTextColor={Brand.textFaint} style={styles.input} />
          ) : null}
          {mode === "testdrive" ? (
            <TextInput value={when} onChangeText={setWhen} placeholder="Preferred date/time (optional)" placeholderTextColor={Brand.textFaint} style={styles.input} />
          ) : null}
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message (optional)"
            placeholderTextColor={Brand.textFaint}
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            multiline
          />
          <Button title={busy ? "Sending…" : "Submit"} onPress={submit} loading={busy} full style={{ marginTop: 4 }} />
          <SafeAreaView edges={["bottom"]} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  scroll: { paddingBottom: 110 },
  placeholder: { alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  dots: { flexDirection: "row", gap: 6, justifyContent: "center", position: "absolute", bottom: 12, left: 0, right: 0 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" },
  dotActive: { backgroundColor: Brand.white, width: 18 },

  body: { padding: 20, gap: 10 },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: "800", color: Brand.text, lineHeight: 28 },
  price: { fontSize: 28, fontWeight: "800", color: Brand.primary },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 14, color: Brand.textMuted },

  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  specItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    padding: 12,
  },
  specLabel: { fontSize: 11, color: Brand.textMuted },
  specValue: { fontSize: 14, fontWeight: "700", color: Brand.text },

  block: { marginTop: 12, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Brand.text },
  featureWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  featureText: { fontSize: 12, fontWeight: "600", color: Brand.text },
  desc: { fontSize: 14, color: Brand.textMuted, lineHeight: 22 },

  sellerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Brand.white, fontSize: 18, fontWeight: "800" },
  sellerName: { fontSize: 15, fontWeight: "700", color: Brand.text },
  sellerMeta: { fontSize: 12, color: Brand.textMuted },

  stats: { flexDirection: "row", gap: 18, marginTop: 12 },
  statText: { fontSize: 13, color: Brand.textMuted },

  actionGrid: { flexDirection: "row", gap: 8, marginTop: 14 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  errorText: { color: Brand.danger, textAlign: "center", fontSize: 14 },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: Brand.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: 16, gap: 10 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.border },
  sheetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: Brand.text },
  sheetCar: { fontSize: 13, color: Brand.textMuted, marginBottom: 4 },
  input: {
    backgroundColor: Brand.bg,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.text,
  },
});
