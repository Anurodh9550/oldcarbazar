import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Badge, Button } from "@/components/ui";
import { Brand, Radius, Shadow, Space } from "@/constants/brand";
import { useAuth } from "@/context/AuthContext";
import { api, type SubscriptionStatus } from "@/lib/api";

type LinkItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  auth?: boolean;
};

const LINKS: LinkItem[] = [
  { label: "All Services & Tools", icon: "grid-outline", route: "/services" },
  { label: "Upgrade to Pro", icon: "rocket-outline", route: "/pricing" },
  { label: "Billing & Invoices", icon: "receipt-outline", route: "/my-subscriptions", auth: true },
  { label: "My Listings", icon: "list-outline", route: "/my-listings", auth: true },
  { label: "Saved Cars", icon: "heart-outline", route: "/shortlist" },
  { label: "Compare Cars", icon: "git-compare-outline", route: "/compare" },
  { label: "Profile Settings", icon: "person-circle-outline", route: "/profile-settings", auth: true },
  { label: "Browse Dealers", icon: "business-outline", route: "/dealers" },
  { label: "Help & FAQs", icon: "help-circle-outline", route: "/info/faq" },
  { label: "About Us", icon: "information-circle-outline", route: "/info/about" },
];

export default function AccountScreen() {
  const router = useRouter();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [sub, setSub] = useState<SubscriptionStatus | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        api.subscriptionStatus().then(setSub).catch(() => setSub(null));
      } else {
        setSub(null);
      }
    }, [isLoggedIn])
  );

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (loading) return <View style={styles.screen} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        {isLoggedIn && user ? (
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() ?? "U"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.meta}>{user.phone}</Text>
              {user.email ? <Text style={styles.meta}>{user.email}</Text> : null}
            </View>
          </View>
        ) : (
          <View style={styles.guest}>
            <Text style={styles.guestTitle}>Welcome to Old Car Bazar</Text>
            <Text style={styles.guestSub}>Login to sell cars & track your activity.</Text>
            <View style={styles.guestBtns}>
              <Button title="Login" onPress={() => router.push("/login")} style={{ flex: 1 }} small />
              <Button title="Register" variant="outline" onPress={() => router.push("/register")} style={{ flex: 1 }} small />
            </View>
          </View>
        )}
      </View>

      {isLoggedIn && sub ? (
        <View style={styles.subCard}>
          <View style={styles.subTop}>
            <View>
              <Text style={styles.subPlan}>{sub.plan_name}</Text>
              <Text style={styles.subMeta}>
                {sub.is_unlimited
                  ? "Unlimited listings"
                  : `${sub.listings_used}/${sub.listings_limit ?? sub.free_listing_limit} listings used`}
              </Text>
            </View>
            <Badge label={sub.can_publish ? "Active" : "Limit reached"} tone={sub.can_publish ? "success" : "warning"} />
          </View>
          <Button title="View plans" variant="outline" small onPress={() => router.push("/pricing")} style={{ marginTop: 10 }} />
        </View>
      ) : null}

      <View style={styles.linkCard}>
        {LINKS.map((link, idx) => (
          <Pressable
            key={link.label}
            style={[styles.linkRow, idx < LINKS.length - 1 && styles.linkBorder]}
            onPress={() => {
              if (link.auth && !isLoggedIn) {
                router.push("/login");
                return;
              }
              router.push(link.route as never);
            }}
          >
            <View style={styles.linkIcon}>
              <Ionicons name={link.icon} size={20} color={Brand.primary} />
            </View>
            <Text style={styles.linkLabel}>{link.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Brand.textFaint} />
          </Pressable>
        ))}
      </View>

      {isLoggedIn ? (
        <Button title="Logout" variant="outline" icon="log-out-outline" onPress={confirmLogout} style={styles.logout} />
      ) : null}

      <Text style={styles.version}>Old Car Bazar · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  header: { backgroundColor: Brand.dark, padding: 20, paddingBottom: 24 },
  profile: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Brand.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Brand.white, fontSize: 22, fontWeight: "800" },
  name: { color: Brand.white, fontSize: 19, fontWeight: "800" },
  meta: { color: Brand.textFaint, fontSize: 13 },
  guest: { gap: 8 },
  guestTitle: { color: Brand.white, fontSize: 19, fontWeight: "800" },
  guestSub: { color: Brand.textFaint, fontSize: 13 },
  guestBtns: { flexDirection: "row", gap: 10, marginTop: 10 },

  subCard: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Brand.white,
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadow.card,
  },
  subTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  subPlan: { fontSize: 16, fontWeight: "800", color: Brand.text },
  subMeta: { fontSize: 13, color: Brand.textMuted, marginTop: 2 },

  linkCard: {
    margin: 16,
    backgroundColor: Brand.white,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Brand.border,
  },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  linkBorder: { borderBottomWidth: 1, borderBottomColor: Brand.border },
  linkIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Brand.primarySoft, alignItems: "center", justifyContent: "center" },
  linkLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: Brand.text },

  logout: { marginHorizontal: 16 },
  version: { textAlign: "center", color: Brand.textFaint, fontSize: 12, marginTop: 20 },
});
