import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { RazorpayCheckout, type CheckoutOrder } from "@/components/RazorpayCheckout";
import { Badge, Button, EmptyState } from "@/components/ui";
import { Brand, Radius, Shadow } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, type ApiPlan, type RazorpayVerifyPayload, type SubscriptionStatus } from "@/lib/api";

export default function PricingScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activating, setActivating] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutOrder | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [p, s] = await Promise.all([
        api.listPlans(),
        isLoggedIn ? api.subscriptionStatus().catch(() => null) : Promise.resolve(null),
      ]);
      setPlans(p);
      setStatus(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load plans.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpgrade = async (plan: ApiPlan) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setActivating(plan.code);
    try {
      const order = await api.createRazorpayOrder(plan.code);
      setCheckout({
        keyId: order.key_id,
        orderId: order.order_id,
        amount: order.amount,
        currency: order.currency,
        description: `${plan.name} plan — Old Car Bazar`,
        prefillName: order.name,
        prefillEmail: order.email,
        prefillContact: order.contact,
        notes: { plan: plan.code, product: "old-car-bazar-subscription" },
      });
    } catch (err) {
      setActivating(null);
      if (err instanceof ApiError && err.status === 503) {
        Alert.alert("Payments unavailable", "Online payments are not configured yet. Please try again later or upgrade on the website.");
      } else {
        Alert.alert("Could not start payment", err instanceof Error ? err.message : "Try again.");
      }
    }
  };

  const onPaymentSuccess = async (payload: RazorpayVerifyPayload) => {
    setCheckout(null);
    try {
      await api.verifyRazorpayPayment(payload);
      await load();
      Alert.alert("Plan activated!", "Your subscription is now active. Enjoy more reach and listings.");
    } catch (err) {
      Alert.alert("Verification failed", err instanceof Error ? err.message : "Payment captured but verification failed. Contact support.");
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </View>
    );
  }
  if (error) {
    return <EmptyState icon="warning-outline" title="Couldn't load plans" subtitle={error} action="Retry" onAction={load} />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text style={styles.heading}>Sell more, faster</Text>
      <Text style={styles.sub}>Upgrade to list more cars and get more buyer reach.</Text>

      {plans.map((plan) => {
        const isCurrent = status?.plan === plan.code;
        const isFree = plan.price_inr === 0;
        const isPopular = plan.code === "pro";
        return (
          <View key={plan.code} style={[styles.card, isCurrent && styles.cardCurrent, isPopular && !isCurrent && styles.cardPopular]}>
            <View style={styles.cardHead}>
              <Text style={styles.planName}>{plan.name}</Text>
              {isCurrent ? <Badge label="Current" tone="success" /> : isPopular ? <Badge label="Popular" tone="primary" /> : null}
            </View>
            <Text style={styles.price}>
              {isFree ? "Free" : `₹${plan.price_inr.toLocaleString("en-IN")}`}
              {!isFree ? <Text style={styles.priceMeta}> / {plan.duration_days} days</Text> : null}
            </Text>
            <Text style={styles.limit}>
              {plan.listing_limit === null ? "Unlimited listings" : `${plan.listing_limit} listings`}
            </Text>
            <View style={styles.perks}>
              {plan.perks.map((perk) => (
                <View key={perk} style={styles.perkRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Brand.success} />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
            <Button
              title={isCurrent ? "Active plan" : isFree ? "Default plan" : activating === plan.code ? "Starting…" : "Upgrade now"}
              variant={isCurrent || isFree ? "outline" : "primary"}
              disabled={isCurrent || isFree || activating === plan.code}
              loading={activating === plan.code && !checkout}
              onPress={() => handleUpgrade(plan)}
              full
              style={{ marginTop: 12 }}
            />
          </View>
        );
      })}

      <View style={styles.secureRow}>
        <Ionicons name="lock-closed" size={14} color={Brand.textMuted} />
        <Text style={styles.note}>Secured by Razorpay · UPI, cards, net banking & wallets</Text>
      </View>

      <RazorpayCheckout
        visible={!!checkout}
        order={checkout}
        onSuccess={onPaymentSuccess}
        onCancel={() => {
          setCheckout(null);
          setActivating(null);
        }}
        onError={(message) => {
          setCheckout(null);
          setActivating(null);
          Alert.alert("Payment failed", message);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "800", color: Brand.text },
  sub: { fontSize: 14, color: Brand.textMuted, marginTop: 4, marginBottom: 18 },
  card: { backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.lg, padding: 18, marginBottom: 14, ...Shadow.card },
  cardCurrent: { borderColor: Brand.primary, borderWidth: 2 },
  cardPopular: { borderColor: Brand.primary },
  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  planName: { fontSize: 18, fontWeight: "800", color: Brand.text },
  price: { fontSize: 28, fontWeight: "800", color: Brand.primary, marginTop: 8 },
  priceMeta: { fontSize: 14, fontWeight: "600", color: Brand.textMuted },
  limit: { fontSize: 14, color: Brand.text, fontWeight: "600", marginTop: 4 },
  perks: { marginTop: 14, gap: 8 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  perkText: { fontSize: 14, color: Brand.text, flex: 1 },
  secureRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 },
  note: { fontSize: 12, color: Brand.textMuted, textAlign: "center" },
});
