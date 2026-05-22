import AdminLogin from "@/components/admin/AdminLogin";

export const metadata = {
  title: "Sign in | Old Car Bazar Admin",
  description: "Secure sign-in for Old Car Bazar admin operators.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
