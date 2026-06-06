import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Select } from "@/components/Select";
import { Button, TextField } from "@/components/ui";
import { Brand } from "@/constants/brand";
import { cities } from "@/data/options";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim() || phone.replace(/\D/g, "").length < 10 || password.length < 6) {
      setError("Enter your name, a valid phone, and a 6+ char password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await register({ name: name.trim(), phone: phone.trim(), password, email, city });
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.sub}>Join thousands buying & selling cars directly.</Text>

        <View style={styles.form}>
          <TextField label="Full name" value={name} onChangeText={setName} placeholder="Anurodh Sharma" />
          <TextField label="Phone" value={phone} onChangeText={setPhone} placeholder="9876543210" keyboardType="phone-pad" />
          <TextField label="Email (optional)" value={email} onChangeText={setEmail} placeholder="you@email.com" autoCapitalize="none" keyboardType="email-address" />
          <Select label="City (optional)" placeholder="Select city" value={city} options={cities} onChange={setCity} />
          <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Create account" onPress={submit} loading={busy} full style={{ marginTop: 4 }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 28, backgroundColor: Brand.bg, flexGrow: 1 },
  title: { fontSize: 26, fontWeight: "800", color: Brand.text },
  sub: { fontSize: 14, color: Brand.textMuted, marginTop: 6, marginBottom: 22 },
  form: { gap: 14 },
  error: { color: Brand.danger, fontSize: 13 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  footerText: { color: Brand.textMuted, fontSize: 14 },
  link: { color: Brand.primary, fontSize: 14, fontWeight: "700" },
});
