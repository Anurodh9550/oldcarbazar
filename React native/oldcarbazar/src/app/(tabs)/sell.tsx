import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { Select } from "@/components/Select";
import { Button, Chip, EmptyState, TextField } from "@/components/ui";
import { Brand, Radius, Space } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import {
  bodyTypes,
  carBrands,
  carColors,
  carYears,
  cities,
  featureOptions,
  fuelTypes,
  insuranceOptions,
  MAX_LISTING_PHOTOS,
  MIN_LISTING_PHOTOS,
  ownerOptions,
  registrationMonths,
  seatOptions,
  transmissionTypes,
} from "@/data/options";
import { api } from "@/lib/api";
import { initialSellForm, type SellForm } from "@/types/listing";

const STEPS = ["Car details", "Price & photos", "Contact"];

export default function SellScreen() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SellForm>(initialSellForm);
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        sellerName: f.sellerName || user.name,
        phone: f.phone || user.phone,
        email: f.email || user.email,
        city: f.city || user.city || "",
      }));
    }
  }, [user]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFeature = (feat: string) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(feat)
        ? f.features.filter((x) => x !== feat)
        : [...f.features, feat],
    }));

  const pickPhotos = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to add car images.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_LISTING_PHOTOS - photos.length,
      quality: 0.7,
    });
    if (!res.canceled) {
      setPhotos((p) => [...p, ...res.assets.map((a) => a.uri)].slice(0, MAX_LISTING_PHOTOS));
    }
  };

  const removePhoto = (uri: string) => setPhotos((p) => p.filter((x) => x !== uri));

  const step0Valid = form.brand && form.model && form.year && form.fuel && form.transmission && form.kms;
  const step1Valid = form.price && form.city && photos.length >= MIN_LISTING_PHOTOS;
  const step2Valid = form.sellerName && form.phone.replace(/\D/g, "").length >= 10;

  const submit = async () => {
    if (!step2Valid) {
      Alert.alert("Missing details", "Enter seller name and a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const urls = await api.uploadPhotos(photos);
      if (urls.length < MIN_LISTING_PHOTOS) {
        throw new Error(`At least ${MIN_LISTING_PHOTOS} photos must upload successfully.`);
      }
      const listing = await api.createListing(form, urls);
      Alert.alert("Published!", "Your car is now live on Old Car Bazar.", [
        {
          text: "View listing",
          onPress: () => {
            setForm(initialSellForm);
            setPhotos([]);
            setStep(0);
            router.push({ pathname: "/listing/[id]", params: { id: listing.id } });
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Could not publish", err instanceof Error ? err.message : "Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <View style={styles.center} />;

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="lock-closed-outline"
        title="Login to sell your car"
        subtitle="Post your ad free and reach thousands of buyers directly."
        action="Login / Register"
        onAction={() => router.push("/login")}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.stepBar}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              {i < step ? (
                <Ionicons name="checkmark" size={14} color={Brand.white} />
              ) : (
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 0 ? (
          <View style={styles.form}>
            <Select label="Brand" placeholder="Select brand" value={form.brand} options={carBrands} onChange={(v) => set("brand", v)} />
            <TextField label="Model" value={form.model} onChangeText={(v) => set("model", v)} placeholder="e.g. Swift VXI" />
            <TextField label="Variant (optional)" value={form.variant} onChangeText={(v) => set("variant", v)} placeholder="e.g. ZXI Plus" />
            <Select label="Year" placeholder="Select year" value={form.year} options={carYears.map(String)} onChange={(v) => set("year", v)} />
            <Select label="Body type" placeholder="Select body type" value={form.bodyType} options={bodyTypes} onChange={(v) => set("bodyType", v)} />
            <Select label="Fuel" placeholder="Select fuel" value={form.fuel} options={fuelTypes} onChange={(v) => set("fuel", v)} />
            <Select label="Transmission" placeholder="Select transmission" value={form.transmission} options={transmissionTypes} onChange={(v) => set("transmission", v)} />
            <TextField label="Kms driven" value={form.kms} onChangeText={(v) => set("kms", v)} placeholder="e.g. 45000" keyboardType="number-pad" />
            <Select label="Owners" value={form.owners} options={ownerOptions} onChange={(v) => set("owners", v)} />
            <Select label="Color" placeholder="Select color" value={form.color} options={carColors.map((c) => ({ value: c.id, label: c.label }))} onChange={(v) => set("color", v)} />
            <Select label="Seats" value={form.seats} options={seatOptions} onChange={(v) => set("seats", v)} />
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.form}>
            <TextField label="Price (₹ in Lakh)" value={form.price} onChangeText={(v) => set("price", v)} placeholder="e.g. 5.5" keyboardType="decimal-pad" hint="Enter price in lakh, e.g. 5.5 for ₹5.5 L" />
            <Select label="City" placeholder="Select city" value={form.city} options={cities} onChange={(v) => set("city", v)} />
            <TextField label="Area (optional)" value={form.area} onChangeText={(v) => set("area", v)} placeholder="e.g. Andheri West" />
            <TextField label="Reg. number (optional)" value={form.regNumber} onChangeText={(v) => set("regNumber", v)} placeholder="e.g. MH02AB1234" autoCapitalize="characters" />
            <Select label="Registration month" value={form.registrationMonth} options={registrationMonths} onChange={(v) => set("registrationMonth", v)} />
            <TextField label="Engine CC (optional)" value={form.engineCc} onChangeText={(v) => set("engineCc", v)} placeholder="e.g. 1197" keyboardType="number-pad" />
            <TextField label="Mileage (optional)" value={form.mileage} onChangeText={(v) => set("mileage", v)} placeholder="e.g. 22 kmpl" />
            <Select label="Insurance" placeholder="Select insurance" value={form.insurance} options={insuranceOptions} onChange={(v) => set("insurance", v)} />

            <View>
              <Text style={styles.groupLabel}>Features</Text>
              <View style={styles.featureWrap}>
                {featureOptions.map((feat) => (
                  <Chip key={feat} label={feat} selected={form.features.includes(feat)} onPress={() => toggleFeature(feat)} />
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.groupLabel}>
                Photos ({photos.length}/{MAX_LISTING_PHOTOS}) · min {MIN_LISTING_PHOTOS}
              </Text>
              <View style={styles.photoWrap}>
                {photos.map((uri) => (
                  <View key={uri} style={styles.photoBox}>
                    <Image source={{ uri }} style={styles.photo} contentFit="cover" />
                    <Pressable style={styles.photoRemove} onPress={() => removePhoto(uri)} hitSlop={6}>
                      <Ionicons name="close" size={14} color={Brand.white} />
                    </Pressable>
                  </View>
                ))}
                {photos.length < MAX_LISTING_PHOTOS ? (
                  <Pressable style={styles.photoAdd} onPress={pickPhotos}>
                    <Ionicons name="camera" size={24} color={Brand.primary} />
                    <Text style={styles.photoAddText}>Add</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <TextField label="Description (optional)" value={form.description} onChangeText={(v) => set("description", v)} placeholder="Service history, condition, reason for sale…" multiline style={{ height: 90, textAlignVertical: "top" }} />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.form}>
            <TextField label="Your name" value={form.sellerName} onChangeText={(v) => set("sellerName", v)} placeholder="Full name" />
            <TextField label="Phone" value={form.phone} onChangeText={(v) => set("phone", v)} placeholder="9876543210" keyboardType="phone-pad" />
            <TextField label="Email (optional)" value={form.email} onChangeText={(v) => set("email", v)} placeholder="you@email.com" autoCapitalize="none" keyboardType="email-address" />
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Available on WhatsApp</Text>
                <Text style={styles.switchHint}>Let buyers message you on WhatsApp</Text>
              </View>
              <Switch
                value={form.whatsapp}
                onValueChange={(v) => set("whatsapp", v)}
                trackColor={{ true: Brand.primary }}
              />
            </View>

            <View style={styles.review}>
              <Text style={styles.reviewTitle}>Review</Text>
              <ReviewRow label="Car" value={`${form.brand} ${form.model} ${form.year}`} />
              <ReviewRow label="Specs" value={`${form.kms || "—"} km · ${form.fuel || "—"} · ${form.transmission || "—"}`} />
              <ReviewRow label="Price" value={form.price ? `₹${form.price} Lakh` : "—"} />
              <ReviewRow label="Location" value={[form.area, form.city].filter(Boolean).join(", ") || "—"} />
              <ReviewRow label="Photos" value={`${photos.length} added`} />
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 ? (
          <Button title="Back" variant="outline" onPress={() => setStep((s) => s - 1)} style={{ flex: 1 }} />
        ) : null}
        {step < 2 ? (
          <Button
            title="Next"
            icon="arrow-forward"
            onPress={() => {
              if (step === 0 && !step0Valid) {
                Alert.alert("Fill car details", "Brand, model, year, fuel, transmission and kms are required.");
                return;
              }
              if (step === 1 && !step1Valid) {
                Alert.alert("Add price & photos", `Price, city and at least ${MIN_LISTING_PHOTOS} photos are required.`);
                return;
              }
              setStep((s) => s + 1);
            }}
            style={{ flex: 1 }}
          />
        ) : (
          <Button title={busy ? "Publishing…" : "Publish listing"} icon="checkmark-circle" variant="success" onPress={submit} loading={busy} style={{ flex: 1 }} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: Brand.bg },
  stepBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: Brand.white,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  stepItem: { alignItems: "center", gap: 6 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Brand.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: Brand.primary },
  stepNum: { fontSize: 12, fontWeight: "800", color: Brand.textMuted },
  stepNumActive: { color: Brand.white },
  stepLabel: { fontSize: 11, color: Brand.textMuted },
  stepLabelActive: { color: Brand.text, fontWeight: "700" },

  content: { padding: 16, paddingBottom: 24 },
  form: { gap: 14 },
  groupLabel: { fontSize: 14, fontWeight: "700", color: Brand.text, marginBottom: 10 },
  featureWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  photoWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoBox: { width: 92, height: 92, borderRadius: Radius.md, overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAdd: {
    width: 92,
    height: 92,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Brand.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: Brand.primarySoft,
  },
  photoAddText: { fontSize: 12, fontWeight: "700", color: Brand.primary },

  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchLabel: { fontSize: 15, fontWeight: "600", color: Brand.text },
  switchHint: { fontSize: 12, color: Brand.textMuted },

  review: {
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  reviewTitle: { fontSize: 15, fontWeight: "800", color: Brand.text, marginBottom: 2 },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  reviewLabel: { fontSize: 13, color: Brand.textMuted },
  reviewValue: { fontSize: 13, fontWeight: "600", color: Brand.text, flexShrink: 1, textAlign: "right" },

  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
});
