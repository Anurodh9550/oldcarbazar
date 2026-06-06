import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand, Radius } from "@/constants/brand";

type Item = { label: string; icon: keyof typeof Ionicons.glyphMap; route: string };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "Finance Tools",
    items: [
      { label: "EMI Calculator", icon: "calculator-outline", route: "/emi" },
      { label: "Loan Eligibility", icon: "checkmark-done-outline", route: "/loan-eligibility" },
      { label: "Compare Loans", icon: "stats-chart-outline", route: "/compare-loans" },
      { label: "Cost of Ownership", icon: "receipt-outline", route: "/cost-of-ownership" },
      { label: "Used Car Loan", icon: "cash-outline", route: "/used-car-loan" },
    ],
  },
  {
    title: "Car Tools",
    items: [
      { label: "Free Valuation", icon: "pricetag-outline", route: "/valuation" },
      { label: "Compare Cars", icon: "git-compare-outline", route: "/compare" },
      { label: "History Report", icon: "document-text-outline", route: "/history-report" },
      { label: "Assured Cars", icon: "ribbon-outline", route: "/assured" },
      { label: "Saved Cars", icon: "heart-outline", route: "/shortlist" },
    ],
  },
  {
    title: "My Account",
    items: [
      { label: "My Listings", icon: "list-outline", route: "/my-listings" },
      { label: "My Activity", icon: "pulse-outline", route: "/(tabs)/activity" },
      { label: "My Subscriptions", icon: "card-outline", route: "/my-subscriptions" },
      { label: "Profile Settings", icon: "person-circle-outline", route: "/profile-settings" },
      { label: "Seller Plans", icon: "star-outline", route: "/pricing" },
    ],
  },
  {
    title: "Help & Guides",
    items: [
      { label: "How to Buy", icon: "cart-outline", route: "/info/help-buy" },
      { label: "How to Sell", icon: "trending-up-outline", route: "/info/help-sell" },
      { label: "Selling Guide", icon: "bulb-outline", route: "/info/sell-guide" },
      { label: "RC Transfer Guide", icon: "document-outline", route: "/info/rc-guide" },
      { label: "Car Insurance", icon: "umbrella-outline", route: "/info/insurance" },
      { label: "Safety Tips", icon: "shield-checkmark-outline", route: "/info/safety" },
      { label: "FAQs", icon: "help-circle-outline", route: "/info/faq" },
    ],
  },
  {
    title: "Discover",
    items: [
      { label: "Reviews", icon: "star-half-outline", route: "/info/reviews" },
      { label: "News & Updates", icon: "newspaper-outline", route: "/info/news" },
      { label: "Videos", icon: "play-circle-outline", route: "/info/videos" },
      { label: "Browse Dealers", icon: "business-outline", route: "/dealers" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", icon: "information-circle-outline", route: "/info/about" },
      { label: "Contact", icon: "call-outline", route: "/info/contact" },
      { label: "Careers", icon: "briefcase-outline", route: "/info/careers" },
      { label: "Partner with Us", icon: "people-outline", route: "/info/partner" },
      { label: "Advertise", icon: "megaphone-outline", route: "/info/advertise" },
      { label: "Investors", icon: "trending-up-outline", route: "/info/investors" },
      { label: "Feedback", icon: "chatbox-ellipses-outline", route: "/info/feedback" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Terms & Conditions", icon: "reader-outline", route: "/info/terms" },
      { label: "Privacy Policy", icon: "lock-closed-outline", route: "/info/privacy" },
      { label: "Corporate Policies", icon: "shield-outline", route: "/info/policies" },
    ],
  },
];

export default function ServicesScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}>
      {GROUPS.map((group) => (
        <View key={group.title}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.grid}>
            {group.items.map((item) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [styles.tile, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(item.route as never)}
              >
                <View style={styles.tileIcon}>
                  <Ionicons name={item.icon} size={22} color={Brand.primary} />
                </View>
                <Text style={styles.tileLabel} numberOfLines={2}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.bg },
  groupTitle: { fontSize: 16, fontWeight: "800", color: Brand.text, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { width: "31%", backgroundColor: Brand.white, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.md, padding: 12, alignItems: "center", gap: 8, minHeight: 90, justifyContent: "center" },
  tileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Brand.primarySoft, alignItems: "center", justifyContent: "center" },
  tileLabel: { fontSize: 12, fontWeight: "600", color: Brand.text, textAlign: "center" },
});
