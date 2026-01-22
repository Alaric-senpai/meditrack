import { PharmacySidebar } from '@/components/layout/pharmacy-sidebar';

export default async function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <PharmacySidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
