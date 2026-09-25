import { requireAdmin } from "@/shared/libs/authGuard";
import { AdminTopbar } from "@/features/admin/components/AdminTopbar";
import { Sidebar } from "@/features/admin/components/Sidebar";
import { countUnreadMessages } from "@/features/admin/repositories/dashboardRepository";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unreadCount = await countUnreadMessages();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
