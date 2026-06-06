import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { loanBenefits, loanDocs } from "@/data/content";

export default function UsedCarLoanScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTag}>PRE-APPROVED OFFERS</Text>
        <Text style={styles.heroTitle}>Used Car Loan</Text>
        <Text style={styles.heroSub}>Get a car loan in 2 minutes — best offers from top banks & NBFCs, all in one place.</Text>
      </View>

      <Text style={styles.sectionTitle}>Why finance with us</Text>
      <View style={styles.grid}>
        {loanBenefits.map((b) => (
          <View key={b.title} style={styles.card}>
            <Ionicons name="checkmark-circle" size={22} color={Brand.primary} />
            <Text style={styles.cardTitle}>{b.title}</Text>
            <Text style={styles.cardDesc}>{b.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Documents required</Text>
      <View style={styles.docCard}>
        {loanDocs.map((d) => (
          <View key={d} style={styles.docRow}>
            <Ionicons name="document-text-outline" size={16} color={Brand.textMuted} />
            <Text style={styles.docText}>{d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.toolRow}>
        <Button title="EMI Calculator" variant="outline" icon="calculator-outline" onPress={() => router.push("/emi")} style={{ flex: 1 }} small />
        <Button title="Check Eligibility" icon="checkmark-done-outline" onPress={() => router.push("/loan-eligibility")} style={{ flex: 1 }} small />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  hero: { backgroundColor: Brand.dark, borderRadius: Radius.lg, padding: 20 },
  heroTag: { color: "#ffb59a", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { color: Brand.white, fontSize: 24, fontWeight: "800", marginTop: 6 },
  heroSub: { color: Brand.textFaint, fontSize: 13, marginTop: 8, lineHeight: 19 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Brand.text },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "47%", backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: Brand.text, marginTop: 4 },
  cardDesc: { fontSize: 12, color: Brand.textMuted, lineHeight: 17 },
  docCard: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16, gap: 10 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  docText: { fontSize: 14, color: Brand.text, flex: 1 },
  toolRow: { flexDirection: "row", gap: 10, marginTop: 4 },
});
