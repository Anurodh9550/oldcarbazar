import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { RazorpayCheckout, type CheckoutOrder } from "@/components/RazorpayCheckout";
import { Brand, Radius } from "@/constants/brand";
import { api, ApiError, type BoostPackage, type RazorpayVerifyPayload } from "@/lib/api";
import type { CarListing } from "@/types/listing";

type Props = {
  listingId: string;
  listingTitle: string;
  visible: boolean;
  onClose: () => void;
  onBoosted: (car: CarListing) => void;
};

export function BoostSheet({ listingId, listingTitle, visible, onClose, onBoosted }: Props) {
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .listBoostPackages()
      .then((next) => {
        if (cancelled) return;
        setPackages(next);
        if (next.length > 0) setSelected(next[Math.min(1, next.length - 1)].code);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load boost plans.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const startPayment = async () => {
    if (!selected) return;
    setError("");
    setBusy(true);
    try {
      const order = await api.createBoostOrder(listingId, selected);
      setCheckout({
        keyId: order.key_id,
        orderId: order.order_id,
        amount: order.amount,
        currency: order.currency,
        description: `${order.package.name} — ${listingTitle}`,
        prefillName: order.name,
        prefillEmail: order.email,
        prefillContact: order.contact,
        notes: { package: order.package.code, listing_id: order.listing_id, product: "old-car-bazar-boost" },
      });
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError && err.status === 503) {
        setError("Online payments are not configured yet. Please try again later.");
      } else {
        setError(err instanceof Error ? err.message : "Payment could not start.");
      }
    }
  };

  const onSuccess = async (payload: RazorpayVerifyPayload) => {
    setCheckout(null);
    try {
      const updated = await api.verifyBoostPayment(listingId, payload);
      onBoosted(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment verification failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={() => !busy && onClose()}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>🚀 Boost this listing</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                Top placement for {listingTitle}
              </Text>
            </View>
            <Pressable onPress={onClose} disabled={busy} hitSlop={8}>
              <Ionicons name="close" size={22} color={Brand.text} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={Brand.primary} />
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 340 }} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
              {packages.map((pkg) => {
                const active = selected === pkg.code;
                return (
                  <Pressable
                    key={pkg.code}
                    style={[styles.pkg, active && styles.pkgActive]}
                    onPress={() => setSelected(pkg.code)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pkgName}>{pkg.name}</Text>
                      <Text style={styles.pkgDesc}>
                        {pkg.perks[0] ?? `Top placement for ${pkg.duration_days} days`}
                      </Text>
                    </View>
                    <Text style={styles.pkgPrice}>₹{pkg.price_inr.toLocaleString("en-IN")}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title={busy ? "Opening payment…" : "Pay & Boost"}
            icon="rocket-outline"
            onPress={startPayment}
            loading={busy && !checkout}
            disabled={busy || loading || !selected}
            full
            style={{ marginTop: 12 }}
          />
          <Text style={styles.secure}>Secured by Razorpay · UPI, cards, net banking</Text>
          <SafeAreaView edges={["bottom"]} />
        </Pressable>
      </Pressable>

      <RazorpayCheckout
        visible={!!checkout}
        order={checkout}
        onSuccess={onSuccess}
        onCancel={() => {
          setCheckout(null);
          setBusy(false);
        }}
        onError={(message) => {
          setCheckout(null);
          setBusy(false);
          setError(message);
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: Brand.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: 16, paddingTop: 8 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.border, marginBottom: 10 },
  head: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  title: { fontSize: 17, fontWeight: "800", color: Brand.text },
  subtitle: { fontSize: 13, color: Brand.textMuted, marginTop: 2 },
  loading: { paddingVertical: 30, alignItems: "center" },
  pkg: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 12 },
  pkgActive: { borderColor: Brand.primary, backgroundColor: Brand.primarySoft, borderWidth: 1.5 },
  pkgName: { fontSize: 14, fontWeight: "700", color: Brand.text },
  pkgDesc: { fontSize: 12, color: Brand.textMuted, marginTop: 2 },
  pkgPrice: { fontSize: 16, fontWeight: "800", color: Brand.primary },
  error: { marginTop: 10, backgroundColor: Brand.dangerSoft, color: Brand.danger, fontSize: 12, fontWeight: "600", padding: 10, borderRadius: Radius.sm },
  secure: { textAlign: "center", fontSize: 11, color: Brand.textFaint, marginTop: 10 },
});
