import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSessionProvider } from "@/components/admin/session-provider";
import { ToastFromParams } from "@/components/toast-from-params";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <AdminSidebar nama={session.user.nama} role={session.user.role} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-1 shrink-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />
          <main className="flex-1 overflow-x-hidden p-6">
            <ToastFromParams />
            {children}
          </main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
