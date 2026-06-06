import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Chip, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";

const employmentTypes = ["Salaried", "Self-Employed", "Business Owner"] as const;

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n)));
}

export default function LoanEligibilityScreen() {
  const [employment, setEmployment] = useState<string>("Salaried");
  const [income, setIncome] = useState("50000");
  const [obligations, setObligations] = useState("5000");
  const [age, setAge] = useState("28");
  const [tenure, setTenure] = useState("60");
  const [rate, setRate] = useState("10.5");

  const e = useMemo(() => {
    const inc = Number(income) || 0;
    const obl = Number(obligations) || 0;
    const a = Number(age) || 0;
    const n = Number(tenure) || 0;
    const r = (Number(rate) || 0) / 12 / 100;
    const disposable = Math.max(inc - obl, 0);
    const foir = employment === "Salaried" ? 0.55 : 0.5;
    const eligibleEmi = disposable * foir;
    let loan = 0;
    if (r > 0 && n > 0 && eligibleEmi > 0) {
      loan = (eligibleEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    }
    const tenureCapByAge = Math.max((65 - a) * 12, 0);
    const ageOk = a >= 21 && a <= 65 && n <= tenureCapByAge;
    return { loan, eligibleEmi, foir: foir * 100, ageOk, tenureCapByAge };
  }, [employment, income, obligations, age, tenure, rate]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <View style={styles.result}>
        <Text style={styles.resultTag}>MAXIMUM ELIGIBLE LOAN</Text>
        <Text style={styles.resultValue}>₹{inr(e.loan)}</Text>
        <Text style={styles.resultMeta}>Based on FOIR {e.foir.toFixed(0)}% & tenure {tenure} months</Text>
      </View>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Eligible EMI</Text>
          <Text style={styles.statValue}>₹{inr(e.eligibleEmi)}</Text>
          <Text style={styles.statSub}>per month</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Age check</Text>
          <Text style={[styles.statValue, { color: e.ageOk ? Brand.success : Brand.warning }]}>
            {e.ageOk ? "Eligible" : "Adjust tenure"}
          </Text>
          <Text style={styles.statSub}>Max tenure: {Math.min(e.tenureCapByAge, 84)} mo</Text>
        </View>
      </View>

      <View>
        <Text style={styles.label}>Employment type</Text>
        <View style={styles.chips}>
          {employmentTypes.map((t) => (
            <Chip key={t} label={t} selected={employment === t} onPress={() => setEmployment(t)} />
          ))}
        </View>
      </View>

      <TextField label="Monthly net income (₹)" value={income} onChangeText={setIncome} keyboardType="number-pad" />
      <TextField label="Existing EMI obligations (₹)" value={obligations} onChangeText={setObligations} keyboardType="number-pad" />
      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Tenure (mo)" value={tenure} onChangeText={setTenure} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Rate (%)" value={rate} onChangeText={setRate} keyboardType="decimal-pad" /></View>
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Tips to increase eligibility</Text>
        {["Clear existing loans and credit card dues.", "Add a co-applicant (spouse / parent).", "Choose a longer tenure to reduce the EMI."].map((t) => (
          <Text key={t} style={styles.tip}>✓ {t}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  result: { backgroundColor: Brand.primarySoft, borderWidth: 1, borderColor: Brand.primary, borderRadius: Radius.lg, padding: 22, alignItems: "center" },
  resultTag: { fontSize: 11, fontWeight: "800", color: Brand.primary, letterSpacing: 1 },
  resultValue: { fontSize: 34, fontWeight: "800", color: Brand.text, marginTop: 6 },
  resultMeta: { fontSize: 12, color: Brand.textMuted, marginTop: 4 },
  statRow: { flexDirection: "row", gap: 12 },
  stat: { flex: 1, backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14 },
  statLabel: { fontSize: 11, color: Brand.textMuted, textTransform: "uppercase" },
  statValue: { fontSize: 18, fontWeight: "800", color: Brand.text, marginTop: 4 },
  statSub: { fontSize: 11, color: Brand.textFaint, marginTop: 2 },
  label: { fontSize: 13, fontWeight: "600", color: Brand.text, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  row: { flexDirection: "row", gap: 10 },
  tips: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16, gap: 8 },
  tipsTitle: { fontSize: 13, fontWeight: "800", color: Brand.text, textTransform: "uppercase" },
  tip: { fontSize: 14, color: Brand.text },
});
