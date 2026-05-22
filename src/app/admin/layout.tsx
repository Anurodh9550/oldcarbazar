import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | Old Car Bazar",
  description:
    "Industry-grade admin panel — manage listings, sellers, buyers, inquiries and analytics on Old Car Bazar.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root">{children}</div>;
}
