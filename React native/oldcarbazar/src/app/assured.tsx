import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { assuredFeatures } from "@/data/content";

export default function AssuredScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTag}>200-POINT INSPECTION</Text>
        <Text style={styles.heroTitle}>Assured Cars</Text>
        <Text style={styles.heroSub}>Hand-picked, inspected and warranty-backed used cars — no haggling, no surprises.</Text>
      </View>

      <View style={styles.grid}>
        {assuredFeatures.map((f) => (
          <View key={f.title} style={styles.card}>
            <Ionicons name="ribbon-outline" size={22} color={Brand.primary} />
            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      <Button title="Browse all cars" icon="car-sport-outline" onPress={() => router.push("/(tabs)/search")} full />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  hero: { backgroundColor: Brand.dark, borderRadius: Radius.lg, padding: 20 },
  heroTag: { color: "#ffb59a", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { color: Brand.white, fontSize: 24, fontWeight: "800", marginTop: 6 },
  heroSub: { color: Brand.textFaint, fontSize: 13, marginTop: 8, lineHeight: 19 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "47%", backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: Brand.text, marginTop: 4 },
  cardDesc: { fontSize: 12, color: Brand.textMuted, lineHeight: 17 },
});
