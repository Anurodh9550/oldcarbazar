"use client";

import { usePathname } from "next/navigation";

/** Hides the public site footer on admin routes. */
export default function ConditionalFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
