import { ClinicianSidebar } from "@/components/layout/clinician-sidebar";

export default async function ClinicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ClinicianSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
