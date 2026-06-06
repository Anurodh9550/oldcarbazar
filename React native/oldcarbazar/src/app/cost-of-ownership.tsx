import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";

type FuelType = "petrol" | "diesel" | "cng" | "electric";

const FUEL_RATE: Record<FuelType, number> = { petrol: 105, diesel: 95, cng: 80, electric: 9 };
const DEFAULT_MILEAGE: Record<FuelType, number> = { petrol: 16, diesel: 20, cng: 24, electric: 7 };

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n)));
}

export default function CostOfOwnershipScreen() {
  const [carPrice, setCarPrice] = useState("800000");
  const [years, setYears] = useState("5");
  const [kmsPerYear, setKmsPerYear] = useState("12000");
  const [fuel, setFuel] = useState<FuelType>("petrol");
  const [fuelRate, setFuelRate] = useState(String(FUEL_RATE.petrol));
  const [mileage, setMileage] = useState(String(DEFAULT_MILEAGE.petrol));
  const [insurancePerYear, setInsurancePerYear] = useState("18000");
  const [servicePerYear, setServicePerYear] = useState("12000");
  const [depreciationPct, setDepreciationPct] = useState("12");

  const setFuelType = (f: FuelType) => {
    setFuel(f);
    setFuelRate(String(FUEL_RATE[f]));
    setMileage(String(DEFAULT_MILEAGE[f]));
  };

  const b = useMemo(() => {
    const price = Number(carPrice) || 0;
    const y = Number(years) || 1;
    const kpy = Number(kmsPerYear) || 0;
    const rate = Number(fuelRate) || 0;
    const mil = Math.max(Number(mileage) || 0.1, 0.1);
    const fuelTotal = (kpy / mil) * rate * y;
    const insurance = (Number(insurancePerYear) || 0) * y;
    const service = (Number(servicePerYear) || 0) * y;
    const depreciation = ((Number(depreciationPct) || 0) / 100) * price * y;
    const total = fuelTotal + insurance + service + depreciation;
    return {
      fuelTotal, insurance, service, depreciation, total,
      perMonth: total / Math.max(y * 12, 1),
      perKm: y * kpy > 0 ? total / (y * kpy) : 0,
    };
  }, [carPrice, years, kmsPerYear, fuelRate, mileage, insurancePerYear, servicePerYear, depreciationPct]);

  const segments = [
    { label: "Depreciation", value: b.depreciation, color: Brand.primary },
    { label: "Fuel / Energy", value: b.fuelTotal, color: Brand.info },
    { label: "Insurance", value: b.insurance, color: Brand.success },
    { label: "Service", value: b.service, color: Brand.warning },
  ];
  const totalForChart = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <View style={styles.result}>
        <Text style={styles.resultTag}>TOTAL {years}-YEAR COST</Text>
        <Text style={styles.resultValue}>₹{inr(b.total)}</Text>
        <View style={styles.miniRow}>
          <View style={styles.mini}><Text style={styles.miniLabel}>Per month</Text><Text style={styles.miniValue}>₹{inr(b.perMonth)}</Text></View>
          <View style={styles.mini}><Text style={styles.miniLabel}>Per km</Text><Text style={styles.miniValue}>₹{b.perKm.toFixed(2)}</Text></View>
        </View>
        <View style={styles.bar}>
          {segments.map((s) => (
            <View key={s.label} style={{ flex: s.value / totalForChart, backgroundColor: s.color }} />
          ))}
        </View>
        <View style={{ gap: 6, marginTop: 12, width: "100%" }}>
          {segments.map((s) => (
            <View key={s.label} style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={styles.legendLabel}>{s.label}</Text>
              </View>
              <Text style={styles.legendValue}>₹{inr(s.value)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.label}>Fuel type</Text>
        <View style={styles.chips}>
          {(["petrol", "diesel", "cng", "electric"] as FuelType[]).map((f) => (
            <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} selected={fuel === f} onPress={() => setFuelType(f)} />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label="Car price (₹)" value={carPrice} onChangeText={setCarPrice} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Years" value={years} onChangeText={setYears} keyboardType="number-pad" /></View>
      </View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label="KMs / year" value={kmsPerYear} onChangeText={setKmsPerYear} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label={fuel === "electric" ? "₹/kWh" : "Fuel ₹/L"} value={fuelRate} onChangeText={setFuelRate} keyboardType="decimal-pad" /></View>
      </View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label={fuel === "electric" ? "km/kWh" : "Mileage km/L"} value={mileage} onChangeText={setMileage} keyboardType="decimal-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Depreciation %/yr" value={depreciationPct} onChangeText={setDepreciationPct} keyboardType="number-pad" /></View>
      </View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label="Insurance / year (₹)" value={insurancePerYear} onChangeText={setInsurancePerYear} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Service / year (₹)" value={servicePerYear} onChangeText={setServicePerYear} keyboardType="number-pad" /></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  result: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 18, alignItems: "center" },
  resultTag: { fontSize: 11, fontWeight: "800", color: Brand.textMuted, letterSpacing: 1 },
  resultValue: { fontSize: 30, fontWeight: "800", color: Brand.text, marginTop: 4 },
  miniRow: { flexDirection: "row", gap: 10, marginTop: 12, width: "100%" },
  mini: { flex: 1, backgroundColor: Brand.bg, borderRadius: Radius.sm, padding: 10, alignItems: "center" },
  miniLabel: { fontSize: 11, color: Brand.textMuted },
  miniValue: { fontSize: 16, fontWeight: "800", color: Brand.text, marginTop: 2 },
  bar: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", marginTop: 16, width: "100%", backgroundColor: Brand.border },
  legendRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  legendLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: 14, color: Brand.text, fontWeight: "600" },
  legendValue: { fontSize: 14, fontWeight: "700", color: Brand.text },
  label: { fontSize: 13, fontWeight: "600", color: Brand.text, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  row: { flexDirection: "row", gap: 10 },
});
