import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, TextField } from "@/components/ui";
import { Brand, Space } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!identifier.trim() || !password) {
      setError("Enter your phone/email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(identifier.trim(), password);
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Ionicons name="car-sport" size={40} color={Brand.primary} />
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Login to manage listings, inquiries & offers.</Text>

        <View style={styles.form}>
          <TextField
            label="Phone or Email"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="9876543210"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Login" onPress={submit} loading={busy} full style={{ marginTop: 4 }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Old Car Bazar? </Text>
          <Link href="/register" style={styles.link}>
            Create account
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 32, backgroundColor: Brand.bg, flexGrow: 1 },
  logo: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Brand.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "800", color: Brand.text, textAlign: "center" },
  sub: { fontSize: 14, color: Brand.textMuted, textAlign: "center", marginTop: 6, marginBottom: 24 },
  form: { gap: 14 },
  error: { color: Brand.danger, fontSize: 13 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: Brand.textMuted, fontSize: 14 },
  link: { color: Brand.primary, fontSize: 14, fontWeight: "700" },
});
