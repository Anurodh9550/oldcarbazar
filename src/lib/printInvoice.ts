/** Shared printable tax-invoice HTML (browser print → Save as PDF). */

export type PrintableInvoiceData = {
  title: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerGstin?: string;
  sellerName?: string;
  sellerAddress?: string;
  sellerEmail?: string;
  sellerGstin?: string;
  itemLabel: string;
  status: string;
  orderId: string;
  paymentId: string;
  receipt: string;
  amountInr: number;
  baseInr?: number;
  gstInr?: number;
  gstRate?: number;
  extra?: { label: string; value: string }[];
};

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function openPrintableInvoice(data: PrintableInvoiceData) {
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;

  const sellerName = data.sellerName || "Old Car Bazar";
  const sellerAddress = data.sellerAddress || "Old Car Bazar, India";
  const sellerEmail = data.sellerEmail || "support@oldcarbazar.com";
  const baseInr = data.baseInr ?? data.amountInr;
  const gstInr = data.gstInr ?? 0;
  const gstRate = data.gstRate ?? 18;
  const showGstBreakdown = gstInr > 0 || (data.baseInr != null && data.baseInr !== data.amountInr);

  const extraRows = (data.extra ?? [])
    .map(
      (e) =>
        `<tr><td class="k">${escapeHtml(e.label)}</td><td class="v">${escapeHtml(e.value)}</td></tr>`
    )
    .join("");

  const customerGstRow = data.customerGstin
    ? `<tr><td class="k">Customer GSTIN</td><td class="v">${escapeHtml(data.customerGstin)}</td></tr>`
    : "";

  const sellerGstLine = data.sellerGstin
    ? `<p class="gst">GSTIN: ${escapeHtml(data.sellerGstin)}</p>`
    : "";

  const taxRows = showGstBreakdown
    ? `<table class="tax">
        <tr><td class="k">Taxable value</td><td class="v">${formatINR(baseInr)}</td></tr>
        <tr><td class="k">GST (${gstRate}%)</td><td class="v">${formatINR(gstInr)}</td></tr>
      </table>`
    : "";

  win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
  <title>${escapeHtml(data.invoiceNumber)}</title>
  <style>
    *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
    body{margin:0;padding:40px;color:#111827}
    .brand{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f75d34;padding-bottom:16px}
    .brand h1{margin:0;color:#f75d34;font-size:24px}
    .muted{color:#6b7280;font-size:12px}
    .gst{margin:6px 0 0;font-size:12px;font-weight:700;color:#374151}
    h2{font-size:15px;margin:24px 0 8px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    td{padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;vertical-align:top}
    td.k{color:#6b7280;width:200px}
    td.v{font-weight:600}
    table.tax{margin-top:16px}
    .total{margin-top:12px;text-align:right;font-size:20px;font-weight:800;color:#111827}
    .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;background:#ecfdf5;color:#047857}
    .foot{margin-top:32px;color:#9ca3af;font-size:11px;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
    <div class="brand">
      <div>
        <h1>${escapeHtml(sellerName)}</h1>
        <p class="muted">${escapeHtml(sellerAddress)} · ${escapeHtml(sellerEmail)}</p>
        ${sellerGstLine}
      </div>
      <div style="text-align:right">
        <p class="muted">Tax Invoice</p>
        <p style="font-weight:700;margin:2px 0">${escapeHtml(data.invoiceNumber)}</p>
        <p class="muted">${escapeHtml(data.date)}</p>
      </div>
    </div>
    <h2>${escapeHtml(data.title)}</h2>
    <table>
      <tr><td class="k">Billed to</td><td class="v">${escapeHtml(data.customerName)}</td></tr>
      <tr><td class="k">Phone</td><td class="v">${escapeHtml(data.customerPhone || "—")}</td></tr>
      <tr><td class="k">Email</td><td class="v">${escapeHtml(data.customerEmail || "—")}</td></tr>
      ${customerGstRow}
      <tr><td class="k">Item</td><td class="v">${escapeHtml(data.itemLabel)}</td></tr>
      <tr><td class="k">Status</td><td class="v"><span class="pill">${escapeHtml(data.status)}</span></td></tr>
      ${extraRows}
    </table>
    <h2>Payment / Transaction</h2>
    <table>
      <tr><td class="k">Razorpay Order ID</td><td class="v">${escapeHtml(data.orderId || "—")}</td></tr>
      <tr><td class="k">Razorpay Payment ID</td><td class="v">${escapeHtml(data.paymentId || "—")}</td></tr>
      <tr><td class="k">Receipt</td><td class="v">${escapeHtml(data.receipt || "—")}</td></tr>
    </table>
    ${taxRows}
    <p class="total">Total Paid: ${formatINR(data.amountInr)}</p>
    <p class="foot">This is a system-generated tax invoice from Old Car Bazar.</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`);
  win.document.close();
}
