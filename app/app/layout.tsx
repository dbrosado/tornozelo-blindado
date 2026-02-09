import { BottomNav } from "@/components/shared/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-carbon text-text-main pb-20">
      <main className="container max-w-md mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
