import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import {
  infoPages,
  newsArticles,
  sampleReviews,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  videoItems,
  type InfoBlock,
} from "@/data/content";

export default function InfoScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = slug ? infoPages[slug] : undefined;

  if (!page) {
    return <EmptyState icon="document-outline" title="Page not found" subtitle="This section is unavailable." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: page.title }} />
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name={page.icon as never} size={26} color={Brand.primary} />
          </View>
          <Text style={styles.badge}>{page.badge.toUpperCase()}</Text>
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.subtitle}>{page.subtitle}</Text>
        </View>

        <View style={styles.body}>
          {page.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

function Block({ block }: { block: InfoBlock }) {
  switch (block.type) {
    case "text":
      return <Text style={styles.paragraph}>{block.text}</Text>;

    case "bullets":
      return (
        <View style={styles.card}>
          {block.items.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={Brand.primary} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      );

    case "steps":
      return (
        <View style={{ gap: 10 }}>
          {block.items.map((s, i) => (
            <View key={s.title} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      );

    case "features":
      return (
        <View style={styles.grid}>
          {block.items.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      );

    case "faq":
      return (
        <View style={{ gap: 10 }}>
          {block.items.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </View>
      );

    case "reviews":
      return (
        <View style={{ gap: 10 }}>
          {sampleReviews.map((r) => (
            <View key={r.car} style={styles.card}>
              <View style={styles.reviewHead}>
                <Text style={styles.reviewCar}>{r.car}</Text>
                <Text style={styles.reviewRating}>★ {r.rating}</Text>
              </View>
              <Text style={styles.reviewExcerpt}>&ldquo;{r.excerpt}&rdquo;</Text>
              <Text style={styles.reviewAuthor}>— {r.author}</Text>
            </View>
          ))}
        </View>
      );

    case "news":
      return (
        <View style={{ gap: 10 }}>
          {newsArticles.map((n) => (
            <View key={n.title} style={styles.card}>
              <Text style={styles.newsTag}>{n.tag}</Text>
              <Text style={styles.newsTitle}>{n.title}</Text>
              <Text style={styles.newsDate}>{n.date}</Text>
            </View>
          ))}
        </View>
      );

    case "videos":
      return (
        <View style={{ gap: 10 }}>
          {videoItems.map((v) => (
            <View key={v.title} style={styles.videoRow}>
              <View style={styles.videoThumb}>
                <Ionicons name="play" size={22} color={Brand.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoMeta}>{v.duration} · {v.views} views</Text>
              </View>
            </View>
          ))}
        </View>
      );

    case "contact":
      return (
        <View style={{ gap: 10 }}>
          <Button title="Call support" icon="call" variant="dark" onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`)} full />
          <Button title="WhatsApp" icon="logo-whatsapp" variant="whatsapp" onPress={() => Linking.openURL(`https://wa.me/${SUPPORT_PHONE.replace(/\D/g, "")}`)} full />
          <Button title="Email us" icon="mail-outline" variant="outline" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} full />
        </View>
      );

    default:
      return null;
  }
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable style={styles.faqItem} onPress={() => setOpen((o) => !o)}>
      <View style={styles.faqHead}>
        <Text style={styles.faqQ}>{q}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={Brand.textMuted} />
      </View>
      {open ? <Text style={styles.faqA}>{a}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  hero: { backgroundColor: Brand.white, padding: 20, borderBottomWidth: 1, borderBottomColor: Brand.border },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Brand.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  badge: { fontSize: 11, fontWeight: "800", color: Brand.primary, letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: "800", color: Brand.text, marginTop: 6 },
  subtitle: { fontSize: 14, color: Brand.textMuted, marginTop: 6, lineHeight: 20 },
  body: { padding: 16, gap: 14 },
  paragraph: { fontSize: 15, color: Brand.text, lineHeight: 23 },
  card: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 16, gap: 10 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  bulletText: { flex: 1, fontSize: 14, color: Brand.text, lineHeight: 20 },
  stepRow: { flexDirection: "row", gap: 12, backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14 },
  stepNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center" },
  stepNumText: { color: Brand.white, fontWeight: "800", fontSize: 14 },
  stepTitle: { fontSize: 15, fontWeight: "700", color: Brand.text },
  stepDesc: { fontSize: 13, color: Brand.textMuted, marginTop: 2, lineHeight: 19 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  featureCard: { width: "47%", backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 4 },
  featureTitle: { fontSize: 14, fontWeight: "700", color: Brand.text },
  featureDesc: { fontSize: 12, color: Brand.textMuted, lineHeight: 17 },
  faqItem: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14 },
  faqHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: "700", color: Brand.text },
  faqA: { fontSize: 13, color: Brand.textMuted, marginTop: 8, lineHeight: 20 },
  reviewHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewCar: { fontSize: 15, fontWeight: "700", color: Brand.text },
  reviewRating: { fontSize: 14, fontWeight: "800", color: Brand.warning },
  reviewExcerpt: { fontSize: 14, color: Brand.text, fontStyle: "italic" },
  reviewAuthor: { fontSize: 12, color: Brand.textMuted },
  newsTag: { fontSize: 11, fontWeight: "800", color: Brand.primary, letterSpacing: 0.5 },
  newsTitle: { fontSize: 15, fontWeight: "700", color: Brand.text, marginTop: 2 },
  newsDate: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  videoRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 12 },
  videoThumb: { width: 56, height: 44, borderRadius: Radius.sm, backgroundColor: Brand.dark, alignItems: "center", justifyContent: "center" },
  videoTitle: { fontSize: 14, fontWeight: "700", color: Brand.text },
  videoMeta: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
});
