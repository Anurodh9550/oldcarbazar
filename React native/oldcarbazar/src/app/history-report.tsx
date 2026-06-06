import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, TextField } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { historyReportSections } from "@/data/content";

export default function HistoryReportScreen() {
  const [reg, setReg] = useState("");
  const [checked, setChecked] = useState("");

  const run = () => {
    if (reg.trim().length < 6) return;
    setChecked(reg.trim().toUpperCase());
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <Text style={styles.lead}>Enter the registration number to view the car&apos;s full history — RC, insurance, challans and ownership.</Text>
      <TextField
        label="Registration number"
        value={reg}
        onChangeText={setReg}
        placeholder="e.g. MH02AB1234"
        autoCapitalize="characters"
      />
      <Button title="Get History Report" icon="search" onPress={run} full />

      {checked ? (
        <View style={styles.resultBanner}>
          <Ionicons name="information-circle" size={20} color={Brand.info} />
          <Text style={styles.resultText}>
            Report for {checked} is being prepared. Verified RTO data will be sent to your registered contact. The report covers:
          </Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>What&apos;s in the report</Text>
      <View style={styles.grid}>
        {historyReportSections.map((s) => (
          <View key={s.title} style={styles.card}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardDesc}>{s.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  lead: { fontSize: 14, color: Brand.textMuted, lineHeight: 20 },
  resultBanner: { flexDirection: "row", gap: 10, backgroundColor: Brand.infoSoft, borderRadius: Radius.md, padding: 14 },
  resultText: { flex: 1, fontSize: 13, color: Brand.text, lineHeight: 19 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Brand.text },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "47%", backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: Brand.text },
  cardDesc: { fontSize: 12, color: Brand.textMuted, lineHeight: 17 },
});
