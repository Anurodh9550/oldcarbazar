import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Badge, EmptyState } from "@/components/ui";
import { Brand, Radius, Space } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { formatPriceInr, timeAgo } from "@/lib/format";
import { api, type Inquiry, type Offer, type TestDrive } from "@/lib/api";

type Tab = "inquiries" | "offers" | "testdrives";

const TABS: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "inquiries", label: "Inquiries", icon: "chatbubble-ellipses-outline" },
  { id: "offers", label: "Offers", icon: "pricetag-outline" },
  { id: "testdrives", label: "Test Drives", icon: "car-sport-outline" },
];

function statusTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  const s = status.toLowerCase();
  if (["accepted", "approved", "completed", "confirmed"].includes(s)) return "success";
  if (["pending", "new", "countered", "requested"].includes(s)) return "warning";
  if (["rejected", "declined", "cancelled", "withdrawn"].includes(s)) return "danger";
  return "info";
}

export default function ActivityScreen() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const [inq, off, td] = await Promise.all([
        api.myInquiries(),
        api.myOffers(),
        api.myTestDrives(),
      ]);
      setInquiries(inq);
      setOffers(off);
      setTestDrives(td);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load activity.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) load();
    }, [isLoggedIn, load])
  );

  if (authLoading) return <View style={styles.screen} />;

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="lock-closed-outline"
        title="Login to see your activity"
        subtitle="Track your inquiries, offers and test drive bookings."
        action="Login / Register"
        onAction={() => router.push("/login")}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <Pressable key={t.id} style={[styles.tab, tab === t.id && styles.tabActive]} onPress={() => setTab(t.id)}>
            <Ionicons name={t.icon} size={16} color={tab === t.id ? Brand.primary : Brand.textMuted} />
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : error ? (
        <EmptyState icon="warning-outline" title="Couldn't load" subtitle={error} action="Retry" onAction={() => load()} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={Brand.primary} />}
        >
          {tab === "inquiries" ? (
            inquiries.length === 0 ? (
              <EmptyState icon="chatbubble-ellipses-outline" title="No inquiries yet" subtitle="Inquiries you send appear here." />
            ) : (
              inquiries.map((i) => (
                <Card key={i.id} title={i.listing_title} subtitle={i.listing_price} status={i.status} time={i.created_at} body={i.message} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: i.listing } })} />
              ))
            )
          ) : null}

          {tab === "offers" ? (
            offers.length === 0 ? (
              <EmptyState icon="pricetag-outline" title="No offers yet" subtitle="Offers you make appear here." />
            ) : (
              offers.map((o) => (
                <Card
                  key={o.id}
                  title={o.listing_title}
                  subtitle={`Offered ${formatPriceInr(o.amount)}${o.counter_amount ? ` · Counter ${formatPriceInr(o.counter_amount)}` : ""}`}
                  status={o.status}
                  time={o.created_at}
                  body={o.seller_response || o.message}
                  onPress={() => router.push({ pathname: "/listing/[id]", params: { id: o.listing } })}
                />
              ))
            )
          ) : null}

          {tab === "testdrives" ? (
            testDrives.length === 0 ? (
              <EmptyState icon="car-sport-outline" title="No test drives yet" subtitle="Your test drive bookings appear here." />
            ) : (
              testDrives.map((t) => (
                <Card
                  key={t.id}
                  title={t.listing_title}
                  subtitle={`Scheduled ${new Date(t.scheduled_at).toLocaleString("en-IN")}`}
                  status={t.status}
                  time={t.created_at}
                  body={t.seller_response || t.message || t.location_note}
                  onPress={() => router.push({ pathname: "/listing/[id]", params: { id: t.listing } })}
                />
              ))
            )
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

function Card({
  title,
  subtitle,
  status,
  time,
  body,
  onPress,
}: {
  title: string;
  subtitle: string;
  status: string;
  time: string;
  body?: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
        <Badge label={status} tone={statusTone(status)} />
      </View>
      <Text style={styles.cardSub}>{subtitle}</Text>
      {body ? <Text style={styles.cardBody} numberOfLines={2}>{body}</Text> : null}
      <Text style={styles.cardTime}>{timeAgo(time)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  tabBar: { flexDirection: "row", backgroundColor: Brand.white, borderBottomWidth: 1, borderBottomColor: Brand.border },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: Brand.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: Brand.textMuted },
  tabTextActive: { color: Brand.primary },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 5 },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Brand.text, flex: 1 },
  cardSub: { fontSize: 13, color: Brand.textMuted },
  cardBody: { fontSize: 13, color: Brand.text, marginTop: 2 },
  cardTime: { fontSize: 11, color: Brand.textFaint, marginTop: 2 },
});
