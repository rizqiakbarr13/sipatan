import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSessionProvider } from "@/components/admin/session-provider";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-zinc-50">
        <AdminSidebar nama={session.user.nama} role={session.user.role} />
        <main className="flex-1 overflow-x-hidden p-6">{children}</main>
      </div>
    </AdminSessionProvider>
  );
}
