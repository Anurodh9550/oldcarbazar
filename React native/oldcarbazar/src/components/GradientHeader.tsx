import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

/** Stylish brand gradient used as the navigation header background. */
export function GradientHeaderBackground() {
  return (
    <LinearGradient
      colors={["#ff7d4f", "#f75d34", "#d8431d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
