import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GradientHeaderBackground } from "@/components/GradientHeader";
import { Brand } from "@/constants/brand";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerBackground: () => <GradientHeaderBackground />,
              headerTintColor: Brand.white,
              headerTitleStyle: { fontWeight: "700", fontSize: 17 },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: Brand.bg },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="listing/[id]" options={{ title: "Car Details", headerBackTitle: "Back" }} />
            <Stack.Screen name="dealers/index" options={{ title: "Dealers" }} />
            <Stack.Screen name="dealers/[id]" options={{ title: "Dealer" }} />
            <Stack.Screen name="my-listings/index" options={{ title: "My Listings" }} />
            <Stack.Screen name="my-listings/[id]/edit" options={{ title: "Edit Listing" }} />
            <Stack.Screen name="services" options={{ title: "All Services" }} />
            <Stack.Screen name="emi" options={{ title: "EMI Calculator" }} />
            <Stack.Screen name="pricing" options={{ title: "Seller Plans" }} />
            <Stack.Screen name="valuation" options={{ title: "Free Valuation" }} />
            <Stack.Screen name="loan-eligibility" options={{ title: "Loan Eligibility" }} />
            <Stack.Screen name="compare-loans" options={{ title: "Compare Loans" }} />
            <Stack.Screen name="cost-of-ownership" options={{ title: "Cost of Ownership" }} />
            <Stack.Screen name="used-car-loan" options={{ title: "Used Car Loan" }} />
            <Stack.Screen name="history-report" options={{ title: "History Report" }} />
            <Stack.Screen name="assured" options={{ title: "Assured Cars" }} />
            <Stack.Screen name="compare" options={{ title: "Compare Cars" }} />
            <Stack.Screen name="shortlist" options={{ title: "Saved Cars" }} />
            <Stack.Screen name="profile-settings" options={{ title: "Profile Settings" }} />
            <Stack.Screen name="my-subscriptions" options={{ title: "My Subscriptions" }} />
            <Stack.Screen name="info/[slug]" options={{ title: "Old Car Bazar" }} />
            <Stack.Screen
              name="login"
              options={{ title: "Login", presentation: "modal" }}
            />
            <Stack.Screen
              name="register"
              options={{ title: "Create Account", presentation: "modal" }}
            />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
