import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola User Admin</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Hanya Super Admin yang dapat mengelola akun.</p>
        </div>
        <Link href="/admin/users/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Tambah User
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{u.nama}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {u.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/users/${u.id}`} className="text-emerald-700 hover:underline">
                      Edit
                    </Link>
                    {u.id !== session.user.id && <UserRowActions id={u.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
