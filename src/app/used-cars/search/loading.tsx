import LogoLoader from "@/components/ui/LogoLoader";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <LogoLoader message="Searching cars…" />
    </main>
  );
}
