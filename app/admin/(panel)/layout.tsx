import AdminNav from "@/components/admin/AdminNav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <AdminNav />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
