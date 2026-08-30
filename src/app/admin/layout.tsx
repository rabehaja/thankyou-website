import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";
import { ToastProvider } from "@/components/ui/toast";
import { requireAdminPage } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdminPage();
  const settings = await getSettings();

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar coupleNames={settings.couple_names} />
          <main className="flex-1 bg-cream-bg px-8 py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
