import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { Brand, Radius } from "@/constants/brand";
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
import { api, ApiError, carListingToForm } from "@/lib/api";
import { initialSellForm, type SellForm } from "@/types/listing";

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<SellForm>(initialSellForm);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getListing(id)
      .then((car) => {
        setForm(carListingToForm(car));
        setPhotos(car.images ?? (car.image ? [car.image] : []));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFeature = (feat: string) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(feat) ? f.features.filter((x) => x !== feat) : [...f.features, feat],
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

  const save = async () => {
    if (!id) return;
    if (!form.brand || !form.model || !form.year || !form.fuel || !form.transmission || !form.kms) {
      Alert.alert("Missing details", "Brand, model, year, fuel, transmission and kms are required.");
      return;
    }
    if (!form.price || !form.city || photos.length < MIN_LISTING_PHOTOS) {
      Alert.alert("Missing details", `Price, city and at least ${MIN_LISTING_PHOTOS} photos are required.`);
      return;
    }
    setBusy(true);
    try {
      const urls = await api.uploadPhotos(photos);
      const listing = await api.updateListing(id, form, urls);
      Alert.alert("Saved", "Your listing has been updated.", [
        { text: "View", onPress: () => router.replace({ pathname: "/listing/[id]", params: { id: listing.id } }) },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not update listing.";
      Alert.alert("Update failed", msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  if (error) {
    return <EmptyState icon="alert-circle-outline" title="Could not load" subtitle={error} />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ title: "Edit listing" }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Select label="Brand" placeholder="Select brand" value={form.brand} options={carBrands} onChange={(v) => set("brand", v)} />
        <TextField label="Model" value={form.model} onChangeText={(v) => set("model", v)} placeholder="e.g. Swift VXI" />
        <TextField label="Variant (optional)" value={form.variant} onChangeText={(v) => set("variant", v)} />
        <Select label="Year" placeholder="Select year" value={form.year} options={carYears.map(String)} onChange={(v) => set("year", v)} />
        <Select label="Body type" placeholder="Select body type" value={form.bodyType} options={bodyTypes} onChange={(v) => set("bodyType", v)} />
        <Select label="Fuel" placeholder="Select fuel" value={form.fuel} options={fuelTypes} onChange={(v) => set("fuel", v)} />
        <Select label="Transmission" placeholder="Select transmission" value={form.transmission} options={transmissionTypes} onChange={(v) => set("transmission", v)} />
        <TextField label="Kms driven" value={form.kms} onChangeText={(v) => set("kms", v)} keyboardType="number-pad" />
        <Select label="Owners" value={form.owners} options={ownerOptions} onChange={(v) => set("owners", v)} />
        <Select label="Color" placeholder="Select color" value={form.color} options={carColors.map((c) => ({ value: c.id, label: c.label }))} onChange={(v) => set("color", v)} />
        <Select label="Seats" value={form.seats} options={seatOptions} onChange={(v) => set("seats", v)} />

        <TextField label="Price (₹ in Lakh)" value={form.price} onChangeText={(v) => set("price", v)} placeholder="e.g. 5.5" keyboardType="decimal-pad" />
        <Select label="City" placeholder="Select city" value={form.city} options={cities} onChange={(v) => set("city", v)} />
        <TextField label="Area (optional)" value={form.area} onChangeText={(v) => set("area", v)} />
        <TextField label="Reg. number (optional)" value={form.regNumber} onChangeText={(v) => set("regNumber", v)} autoCapitalize="characters" />
        <Select label="Registration month" value={form.registrationMonth} options={registrationMonths} onChange={(v) => set("registrationMonth", v)} />
        <TextField label="Engine CC (optional)" value={form.engineCc} onChangeText={(v) => set("engineCc", v)} keyboardType="number-pad" />
        <TextField label="Mileage (optional)" value={form.mileage} onChangeText={(v) => set("mileage", v)} />
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

        <TextField label="Description (optional)" value={form.description} onChangeText={(v) => set("description", v)} multiline style={{ height: 90, textAlignVertical: "top" }} />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Available on WhatsApp</Text>
          </View>
          <Switch value={form.whatsapp} onValueChange={(v) => set("whatsapp", v)} trackColor={{ true: Brand.primary }} />
        </View>

        <Button title={busy ? "Saving…" : "Save changes"} icon="checkmark-circle" variant="success" onPress={save} loading={busy} full />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  center: { flex: 1, backgroundColor: Brand.bg, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  groupLabel: { fontSize: 14, fontWeight: "700", color: Brand.text, marginBottom: 10 },
  featureWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  photoWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoBox: { width: 92, height: 92, borderRadius: Radius.md, overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  photoRemove: { position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
  photoAdd: { width: 92, height: 92, borderRadius: Radius.md, borderWidth: 1.5, borderStyle: "dashed", borderColor: Brand.primary, alignItems: "center", justifyContent: "center", gap: 2, backgroundColor: Brand.primarySoft },
  photoAddText: { fontSize: 12, fontWeight: "700", color: Brand.primary },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  switchLabel: { fontSize: 15, fontWeight: "600", color: Brand.text },
});
