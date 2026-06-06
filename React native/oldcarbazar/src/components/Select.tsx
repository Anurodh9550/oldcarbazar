import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand, Radius } from "@/constants/brand";

export type Option = { value: string; label: string };

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  options: (string | Option)[];
  onChange: (value: string) => void;
  error?: string;
};

function toOption(o: string | Option): Option {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export function Select({ label, placeholder = "Select", value, options, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const opts = options.map(toOption);
  const selected = opts.find((o) => o.value === value);

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Text style={[styles.value, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Brand.textMuted} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>{label ?? "Select"}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={Brand.text} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {opts.map((opt) => {
                const active = opt.value === value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.row, active && styles.rowActive]}
                    onPress={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.rowText, active && styles.rowTextActive]}>
                      {opt.label}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={20} color={Brand.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <SafeAreaView edges={["bottom"]} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "600", color: Brand.text },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Brand.white,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  fieldError: { borderColor: Brand.danger },
  value: { fontSize: 15, color: Brand.text },
  placeholder: { color: Brand.textFaint },
  errorText: { fontSize: 12, color: Brand.danger },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Brand.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Brand.border,
    marginBottom: 8,
  },
  sheetHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  sheetTitle: { fontSize: 17, fontWeight: "800", color: Brand.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  rowActive: {},
  rowText: { fontSize: 15, color: Brand.text },
  rowTextActive: { color: Brand.primary, fontWeight: "700" },
});
