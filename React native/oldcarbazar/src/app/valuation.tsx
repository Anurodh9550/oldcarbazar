import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Select } from "@/components/Select";
import { Button, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { carBrands, carYears, cities } from "@/data/options";

export default function ValuationScreen() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kms, setKms] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  const estimate = () => {
    if (!brand || !year || !kms) return;
    const base = parseInt(year, 10) >= 2020 ? 8 : parseInt(year, 10) >= 2015 ? 5 : 3;
    const kmFactor = Math.max(0.5, 1 - parseInt(kms, 10) / 200000);
    const min = Math.round(base * kmFactor * 0.9 * 10) / 10;
    const max = Math.round(base * kmFactor * 1.15 * 10) / 10;
    setResult({ min, max });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
      <Text style={styles.lead}>Fill details below — fair market range in seconds.</Text>
      <Select label="Brand *" placeholder="Select brand" value={brand} options={carBrands} onChange={setBrand} />
      <TextField label="Model *" value={model} onChangeText={setModel} placeholder="e.g. Swift, Creta" />
      <Select label="Year *" placeholder="Select year" value={year} options={carYears.map(String)} onChange={setYear} />
      <TextField label="KMs driven *" value={kms} onChangeText={setKms} placeholder="45000" keyboardType="number-pad" />
      <Select label="City" placeholder="Select city" value={city} options={cities} onChange={setCity} />
      <Button title="Get Free Valuation" icon="calculator-outline" onPress={estimate} full />

      {result ? (
        <View style={styles.result}>
          <Text style={styles.resultTag}>ESTIMATED RANGE</Text>
          <Text style={styles.resultValue}>₹{result.min} – ₹{result.max} Lakh</Text>
          <Text style={styles.resultMeta}>{year} {brand} {model} • {city || "Your city"}</Text>
          <Text style={styles.note}>*Indicative price based on market data. Actual price may vary.</Text>
          <Button title="List at this price" icon="add-circle-outline" variant="dark" onPress={() => router.push("/(tabs)/sell")} full style={{ marginTop: 12 }} />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="bar-chart-outline" size={40} color={Brand.primary} />
          <Text style={styles.placeholderTitle}>Your valuation appears here</Text>
          <Text style={styles.placeholderSub}>Enter details and tap Get Free Valuation.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  lead: { fontSize: 14, color: Brand.textMuted },
  result: { backgroundColor: Brand.primarySoft, borderWidth: 1, borderColor: Brand.primary, borderRadius: Radius.lg, padding: 22, alignItems: "center", marginTop: 4 },
  resultTag: { fontSize: 12, fontWeight: "800", color: Brand.primary, letterSpacing: 1 },
  resultValue: { fontSize: 30, fontWeight: "800", color: Brand.text, marginTop: 8 },
  resultMeta: { fontSize: 13, color: Brand.textMuted, marginTop: 6 },
  note: { fontSize: 11, color: Brand.textMuted, marginTop: 10, textAlign: "center" },
  placeholder: { borderWidth: 1.5, borderStyle: "dashed", borderColor: Brand.border, borderRadius: Radius.lg, padding: 32, alignItems: "center", gap: 8, marginTop: 4 },
  placeholderTitle: { fontSize: 15, fontWeight: "700", color: Brand.text },
  placeholderSub: { fontSize: 13, color: Brand.textMuted, textAlign: "center" },
});
