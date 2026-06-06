import { useMemo } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Brand } from "@/constants/brand";
import type { RazorpayVerifyPayload } from "@/lib/api";

export type CheckoutOrder = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  prefillName: string;
  prefillEmail: string | null;
  prefillContact: string;
  notes?: Record<string, string>;
};

type Props = {
  visible: boolean;
  order: CheckoutOrder | null;
  onSuccess: (payload: RazorpayVerifyPayload) => void;
  onCancel: () => void;
  onError: (message: string) => void;
};

function buildHtml(order: CheckoutOrder) {
  const options = {
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: "Old Car Bazar",
    description: order.description,
    order_id: order.orderId,
    prefill: {
      name: order.prefillName,
      email: order.prefillEmail ?? "",
      contact: order.prefillContact,
    },
    notes: order.notes ?? {},
    theme: { color: "#f75d34" },
  };
  const optionsJson = JSON.stringify(options);
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>html,body{margin:0;height:100%;background:#1a1a1a;font-family:-apple-system,system-ui,sans-serif;color:#fff;display:flex;align-items:center;justify-content:center}</style>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
  <div id="status">Opening secure payment…</div>
  <script>
    function post(obj){ try { window.ReactNativeWebView.postMessage(JSON.stringify(obj)); } catch(e){} }
    function start(){
      if (!window.Razorpay) { post({ type: 'error', message: 'Could not load Razorpay checkout.' }); return; }
      var options = ${optionsJson};
      options.handler = function(response){ post({ type: 'success', response: response }); };
      options.modal = { ondismiss: function(){ post({ type: 'dismiss' }); }, escape: false, backdropclose: false };
      try {
        var rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function(resp){
          post({ type: 'failed', message: (resp && resp.error && resp.error.description) || 'Payment failed.' });
        });
        rzp.open();
      } catch(e){ post({ type: 'error', message: String(e) }); }
    }
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);
  </script>
</body>
</html>`;
}

export function RazorpayCheckout({ visible, order, onSuccess, onCancel, onError }: Props) {
  const html = useMemo(() => (order ? buildHtml(order) : ""), [order]);

  const handleMessage = (raw: string) => {
    let msg: { type: string; response?: RazorpayVerifyPayload; message?: string };
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    switch (msg.type) {
      case "success":
        if (msg.response) onSuccess(msg.response);
        break;
      case "dismiss":
        onCancel();
        break;
      case "failed":
      case "error":
        onError(msg.message ?? "Payment could not be completed.");
        break;
    }
  };

  return (
    <Modal visible={visible && !!order} animationType="slide" onRequestClose={onCancel} transparent={false}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <Pressable onPress={onCancel} hitSlop={10}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
        {order ? (
          <WebView
            originWhitelist={["*"]}
            source={{ html, baseUrl: "https://oldcarbazar.com" }}
            onMessage={(e) => handleMessage(e.nativeEvent.data)}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loading}>
                <ActivityIndicator color={Brand.primary} size="large" />
              </View>
            )}
            style={styles.web}
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Brand.dark },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: Brand.white, fontSize: 16, fontWeight: "700" },
  cancel: { color: "#ffb59a", fontSize: 15, fontWeight: "600" },
  web: { flex: 1, backgroundColor: Brand.dark },
  loading: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: Brand.dark },
});
