import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Badge, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { loanBanks } from "@/data/content";

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function parseRateMid(rate: string) {
  const parts = rate.match(/\d+(\.\d+)?/g);
  if (!parts?.length) return 11;
  if (parts.length === 1) return parseFloat(parts[0]);
  return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
}

function calcEMI(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (r === 0 || months === 0) return principal / Math.max(months, 1);
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function CompareLoansScreen() {
  const [amount, setAmount] = useState("500000");
  const [tenure, setTenure] = useState("48");

  const rows = useMemo(() => {
    const amt = Number(amount) || 0;
    const t = Number(tenure) || 1;
    return loanBanks
      .map((b) => {
        const rate = parseRateMid(b.rate);
        const emi = calcEMI(amt, rate, t);
        const total = emi * t;
        return { ...b, rateMid: rate, emi, interest: total - amt };
      })
      .sort((a, b) => a.emi - b.emi);
  }, [amount, tenure]);

  const cheapest = rows[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}><TextField label="Loan amount (₹)" value={amount} onChangeText={setAmount} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><TextField label="Tenure (months)" value={tenure} onChangeText={setTenure} keyboardType="number-pad" /></View>
      </View>

      {cheapest ? (
        <View style={styles.best}>
          <Text style={styles.bestTag}>BEST DEAL FOR YOU</Text>
          <View style={styles.bestRow}>
            <View>
              <Text style={styles.bestName}>{cheapest.name}</Text>
              <Text style={styles.bestMeta}>At {cheapest.rateMid.toFixed(2)}% over {tenure} months</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.bestEmiLabel}>Monthly EMI</Text>
              <Text style={styles.bestEmi}>₹{inr(cheapest.emi)}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>All lenders compared</Text>
      {rows.map((r) => (
        <View key={r.name} style={[styles.card, r.name === cheapest?.name && styles.cardBest]}>
          <View style={styles.cardHead}>
            <Text style={styles.bankName}>{r.name}</Text>
            {r.highlight ? <Badge label={r.highlight} tone="success" /> : null}
          </View>
          <View style={styles.cardGrid}>
            <Cell label="Rate" value={`${r.rateMid.toFixed(2)}%`} />
            <Cell label="EMI" value={`₹${inr(r.emi)}`} />
            <Cell label="Interest" value={`₹${inr(r.interest)}`} />
            <Cell label="Processing" value={r.processing} />
          </View>
        </View>
      ))}
      <Text style={styles.note}>*Rates are indicative. Final rate depends on credit score, income and lender policy.</Text>
    </ScrollView>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  row: { flexDirection: "row", gap: 10 },
  best: { backgroundColor: Brand.successSoft, borderWidth: 1, borderColor: Brand.success, borderRadius: Radius.lg, padding: 16 },
  bestTag: { fontSize: 11, fontWeight: "800", color: Brand.success, letterSpacing: 1 },
  bestRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 },
  bestName: { fontSize: 18, fontWeight: "800", color: Brand.text },
  bestMeta: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  bestEmiLabel: { fontSize: 11, color: Brand.textMuted },
  bestEmi: { fontSize: 22, fontWeight: "800", color: Brand.success },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Brand.text },
  card: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 10 },
  cardBest: { borderColor: Brand.success, borderWidth: 1.5 },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bankName: { fontSize: 15, fontWeight: "700", color: Brand.text },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cell: { width: "45%" },
  cellLabel: { fontSize: 11, color: Brand.textMuted },
  cellValue: { fontSize: 14, fontWeight: "700", color: Brand.text, marginTop: 2 },
  note: { fontSize: 11, color: Brand.textMuted, marginTop: 4 },
});
