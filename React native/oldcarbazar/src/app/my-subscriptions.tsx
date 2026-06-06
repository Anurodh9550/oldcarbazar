import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { Badge, Button, EmptyState } from "@/components/ui";
import { Brand, Radius } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import {
  api,
  type BoostInvoicePayload,
  type InvoicePayload,
  type SubscriptionStatus,
} from "@/lib/api";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function statusTone(s: string): "success" | "warning" | "neutral" | "danger" {
  if (s === "active" || s === "paid") return "success";
  if (s === "pending" || s === "created") return "warning";
  if (s === "failed") return "danger";
  return "neutral";
}

export default function MySubscriptionsScreen() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [invoices, setInvoices] = useState<InvoicePayload[]>([]);
  const [boosts, setBoosts] = useState<BoostInvoicePayload[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      api.subscriptionStatus().catch(() => null),
      api.mySubscriptions().catch(() => ({ subscriptions: [], invoices: [], boost_invoices: [] })),
    ])
      .then(([s, mine]) => {
        setStatus(s);
        setInvoices(mine.invoices ?? []);
        setBoosts(mine.boost_invoices ?? []);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  useFocusEffect(useCallback(() => load(), [load]));

  if (authLoading) return <View style={styles.screen} />;

  if (!isLoggedIn) {
    return (
      <EmptyState
        icon="card-outline"
        title="Login to view subscriptions"
        action="Login / Register"
        onAction={() => router.push("/login")}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  const used = status?.listings_used ?? 0;
  const limit = status?.is_unlimited ? "Unlimited" : status?.listings_limit ?? status?.free_listing_limit ?? 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.planCard}>
        <View style={styles.planHead}>
          <Text style={styles.planLabel}>CURRENT PLAN</Text>
          <Badge label={status?.can_publish ? "Active" : "Limited"} tone={status?.can_publish ? "success" : "warning"} />
        </View>
        <Text style={styles.planName}>{status?.plan_name ?? "Free"}</Text>
        <View style={styles.row}>
          <Stat label="Listings used" value={String(used)} />
          <Stat label="Limit" value={String(limit)} />
        </View>
        <View style={styles.row}>
          <Stat label="Started" value={fmtDate(status?.started_at ?? null)} />
          <Stat label="Expires" value={fmtDate(status?.expires_at ?? null)} />
        </View>
      </View>

      <Button title="View plans & upgrade" icon="rocket-outline" onPress={() => router.push("/pricing")} full />

      {invoices.length > 0 ? (
        <View style={{ gap: 10 }}>
          <Text style={styles.sectionTitle}>Subscription invoices</Text>
          {invoices.map((inv) => (
            <View key={inv.subscription_id} style={styles.invoice}>
              <View style={styles.invoiceTop}>
                <Text style={styles.invoiceTitle}>{inv.plan_name}</Text>
                <Badge label={inv.status} tone={statusTone(inv.status)} />
              </View>
              <Text style={styles.invoiceMeta}>Invoice {inv.invoice_number}</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceAmount}>₹{inv.amount_inr.toLocaleString("en-IN")}</Text>
                <Text style={styles.invoiceDate}>{fmtDate(inv.issued_at)}</Text>
              </View>
              <Text style={styles.invoicePeriod}>Valid: {fmtDate(inv.started_at)} → {fmtDate(inv.expires_at)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {boosts.length > 0 ? (
        <View style={{ gap: 10 }}>
          <Text style={styles.sectionTitle}>Boost history</Text>
          {boosts.map((b) => (
            <View key={b.boost_order_id} style={styles.invoice}>
              <View style={styles.invoiceTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invoiceTitle}>{b.package_name}</Text>
                  <Text style={styles.invoiceMeta} numberOfLines={1}>{b.listing_title}</Text>
                </View>
                <Badge label={b.status} tone={statusTone(b.status)} />
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceAmount}>₹{b.amount_inr.toLocaleString("en-IN")}</Text>
                <Text style={styles.invoiceDate}>{fmtDate(b.issued_at)}</Text>
              </View>
              {b.boosted_until ? <Text style={styles.invoicePeriod}>Boosted until {fmtDate(b.boosted_until)}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      {invoices.length === 0 && boosts.length === 0 ? (
        <View style={styles.infoCard}>
          <Ionicons name="receipt-outline" size={20} color={Brand.info} />
          <Text style={styles.infoText}>No payments yet. Upgrade to Pro or boost a listing to see invoices here.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  center: { flex: 1, backgroundColor: Brand.bg, alignItems: "center", justifyContent: "center" },
  planCard: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 18, gap: 12 },
  planHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  planLabel: { fontSize: 12, fontWeight: "800", color: Brand.textMuted, letterSpacing: 0.5 },
  planName: { fontSize: 24, fontWeight: "800", color: Brand.text },
  row: { flexDirection: "row", gap: 12 },
  stat: { flex: 1, backgroundColor: Brand.bg, borderRadius: Radius.sm, padding: 12 },
  statLabel: { fontSize: 11, color: Brand.textMuted },
  statValue: { fontSize: 15, fontWeight: "700", color: Brand.text, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Brand.text },
  invoice: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 14, gap: 6 },
  invoiceTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  invoiceTitle: { fontSize: 15, fontWeight: "700", color: Brand.text },
  invoiceMeta: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  invoiceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  invoiceAmount: { fontSize: 16, fontWeight: "800", color: Brand.primary },
  invoiceDate: { fontSize: 12, color: Brand.textMuted },
  invoicePeriod: { fontSize: 12, color: Brand.textMuted },
  infoCard: { flexDirection: "row", gap: 10, backgroundColor: Brand.infoSoft, borderRadius: Radius.md, padding: 14 },
  infoText: { flex: 1, fontSize: 13, color: Brand.text, lineHeight: 19 },
});
