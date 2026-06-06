import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import { Brand, Radius, Space } from "@/constants/brand";

// --------------------------------------------------------------------------- //
// Button
// --------------------------------------------------------------------------- //

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "dark" | "outline" | "ghost" | "whatsapp" | "success";
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  full?: boolean;
  style?: ViewStyle;
};

const BTN_BG: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: Brand.primary,
  dark: Brand.dark,
  outline: "transparent",
  ghost: "transparent",
  whatsapp: Brand.whatsapp,
  success: Brand.success,
};

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  loading,
  disabled,
  small,
  full,
  style,
}: ButtonProps) {
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";
  const textColor = isOutline || isGhost ? Brand.text : Brand.white;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        full && { alignSelf: "stretch" },
        { backgroundColor: BTN_BG[variant] },
        isOutline && styles.btnOutline,
        (disabled || loading) && styles.btnDisabled,
        pressed && styles.btnPressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={small ? 16 : 18} color={textColor} /> : null}
          <Text style={[styles.btnText, small && styles.btnTextSmall, { color: textColor }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// --------------------------------------------------------------------------- //
// TextField
// --------------------------------------------------------------------------- //

type FieldProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, style, ...rest }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={Brand.textFaint}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

// --------------------------------------------------------------------------- //
// Chip / Pill
// --------------------------------------------------------------------------- //

export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? Brand.white : Brand.textMuted}
        />
      ) : null}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

/** Horizontal scrolling row of selectable chips. */
export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  getLabel,
}: {
  options: readonly T[];
  value: T | null;
  onChange: (v: T | null) => void;
  getLabel?: (v: T) => string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
    >
      {options.map((opt) => (
        <Chip
          key={opt}
          label={getLabel ? getLabel(opt) : opt}
          selected={value === opt}
          onPress={() => onChange(value === opt ? null : opt)}
        />
      ))}
    </ScrollView>
  );
}

// --------------------------------------------------------------------------- //
// Section header
// --------------------------------------------------------------------------- //

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// --------------------------------------------------------------------------- //
// Badge
// --------------------------------------------------------------------------- //

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "primary";
}) {
  const map = {
    neutral: { bg: Brand.border, fg: Brand.text },
    success: { bg: Brand.successSoft, fg: Brand.success },
    warning: { bg: Brand.warningSoft, fg: Brand.warning },
    danger: { bg: Brand.dangerSoft, fg: Brand.danger },
    info: { bg: Brand.infoSoft, fg: Brand.info },
    primary: { bg: Brand.primarySoft, fg: Brand.primary },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: map.bg }]}>
      <Text style={[styles.badgeText, { color: map.fg }]}>{label}</Text>
    </View>
  );
}

// --------------------------------------------------------------------------- //
// EmptyState
// --------------------------------------------------------------------------- //

export function EmptyState({
  icon = "car-outline",
  title,
  subtitle,
  action,
  onAction,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={36} color={Brand.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
      {action ? <Button title={action} onPress={onAction} style={{ marginTop: Space.md }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
  },
  btnSmall: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: Radius.sm },
  btnOutline: { borderWidth: 1.5, borderColor: Brand.borderStrong },
  btnDisabled: { opacity: 0.5 },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  btnText: { fontWeight: "700", fontSize: 15 },
  btnTextSmall: { fontSize: 13 },

  fieldWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: Brand.text },
  input: {
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.text,
  },
  inputError: { borderColor: Brand.danger },
  errorText: { fontSize: 12, color: Brand.danger },
  hintText: { fontSize: 12, color: Brand.textMuted },

  chipRow: { gap: 8, paddingHorizontal: 16, paddingVertical: 2 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: Brand.primary, borderColor: Brand.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: Brand.textMuted },
  chipTextSelected: { color: Brand.white },

  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: Space.xl,
    marginBottom: Space.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: Brand.text },
  sectionAction: { fontSize: 13, fontWeight: "700", color: Brand.primary },

  badge: { borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },

  empty: { alignItems: "center", justifyContent: "center", padding: 40, gap: 8 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Brand.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: Brand.text, textAlign: "center" },
  emptySub: { fontSize: 14, color: Brand.textMuted, textAlign: "center", lineHeight: 20 },
});
