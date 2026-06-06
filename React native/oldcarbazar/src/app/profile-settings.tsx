import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Select } from "@/components/Select";
import { Button, EmptyState, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { cities } from "@/data/options";
import { api, ApiError } from "@/lib/api";

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, isLoggedIn, loading, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [busy, setBusy] = useState(false);

  if (loading) return <View style={styles.screen} />;

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="person-circle-outline"
        title="Login to edit your profile"
        action="Login / Register"
        onAction={() => router.push("/login")}
      />
    );
  }

  const save = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }
    setBusy(true);
    try {
      await api.updateProfile({ name, email, city });
      await refreshUser();
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not update profile.";
      Alert.alert("Update failed", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={styles.phoneCard}>
          <Text style={styles.phoneLabel}>Registered phone</Text>
          <Text style={styles.phoneValue}>{user?.phone}</Text>
          <Text style={styles.phoneHint}>Phone number cannot be changed.</Text>
        </View>
        <TextField label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" autoCapitalize="none" keyboardType="email-address" />
        <Select label="City" placeholder="Select city" value={city} options={cities} onChange={setCity} />
        <Button title={busy ? "Saving…" : "Save changes"} icon="checkmark-circle" onPress={save} loading={busy} full />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  phoneCard: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16 },
  phoneLabel: { fontSize: 12, color: Brand.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  phoneValue: { fontSize: 18, fontWeight: "800", color: Brand.text, marginTop: 4 },
  phoneHint: { fontSize: 12, color: Brand.textFaint, marginTop: 4 },
});
