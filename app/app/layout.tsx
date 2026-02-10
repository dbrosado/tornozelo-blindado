import { BottomNav } from "@/components/shared/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white pb-24">
      <main className="container max-w-md mx-auto px-5 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
