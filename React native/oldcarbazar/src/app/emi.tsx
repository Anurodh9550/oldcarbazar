import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand, Radius, Shadow } from "@/constants/brand";

function emi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
}

function Stepper({
  label,
  value,
  suffix,
  step,
  min,
  max,
  onChange,
  format,
}: {
  label: string;
  value: number;
  suffix?: string;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value - step))}>
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>
          {format ? format(value) : value.toLocaleString("en-IN")}
          {suffix ? ` ${suffix}` : ""}
        </Text>
        <Pressable style={styles.stepBtn} onPress={() => onChange(clamp(value + step))}>
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function EmiScreen() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);

  const months = years * 12;
  const monthly = useMemo(() => emi(amount, rate, months), [amount, rate, months]);
  const total = monthly * months;
  const interest = total - amount;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Monthly EMI</Text>
        <Text style={styles.resultValue}>₹{Math.round(monthly).toLocaleString("en-IN")}</Text>
        <View style={styles.resultSplit}>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLabel}>Principal</Text>
            <Text style={styles.resultItemValue}>₹{amount.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLabel}>Interest</Text>
            <Text style={styles.resultItemValue}>₹{Math.round(interest).toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLabel}>Total</Text>
            <Text style={styles.resultItemValue}>₹{Math.round(total).toLocaleString("en-IN")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputs}>
        <Stepper label="Loan amount" value={amount} step={50000} min={50000} max={5000000} onChange={setAmount} format={(v) => `₹${v.toLocaleString("en-IN")}`} />
        <Stepper label="Interest rate" value={rate} step={0.25} min={5} max={20} onChange={(v) => setRate(Number(v.toFixed(2)))} suffix="%" format={(v) => v.toFixed(2)} />
        <Stepper label="Tenure" value={years} step={1} min={1} max={8} onChange={setYears} suffix="years" />
      </View>

      <Text style={styles.note}>
        This is an indicative EMI. Actual rates depend on the lender, your credit profile and the car&apos;s age.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  resultCard: { backgroundColor: Brand.dark, borderRadius: Radius.lg, padding: 22, alignItems: "center", ...Shadow.raised },
  resultLabel: { color: Brand.textFaint, fontSize: 13, fontWeight: "600" },
  resultValue: { color: Brand.white, fontSize: 38, fontWeight: "800", marginTop: 4 },
  resultSplit: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 18, gap: 8 },
  resultItem: { flex: 1, alignItems: "center" },
  resultItemLabel: { color: Brand.textFaint, fontSize: 11 },
  resultItemValue: { color: Brand.white, fontSize: 13, fontWeight: "700", marginTop: 3 },

  inputs: { marginTop: 18, gap: 14 },
  field: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: Brand.textMuted, marginBottom: 12 },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Brand.primarySoft, alignItems: "center", justifyContent: "center" },
  stepBtnText: { fontSize: 24, fontWeight: "800", color: Brand.primary },
  stepValue: { fontSize: 18, fontWeight: "800", color: Brand.text },

  note: { fontSize: 12, color: Brand.textMuted, marginTop: 18, lineHeight: 18, textAlign: "center" },
});
