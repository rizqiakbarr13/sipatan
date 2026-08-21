"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  FileStack,
  Table,
  ListChecks,
  Megaphone,
  MessageSquareWarning,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/proyek", label: "Proyek", icon: Building2, exact: false },
  { href: "/admin/dokumen", label: "Dokumen Publikasi", icon: FileStack, exact: false },
  { href: "/admin/nominatif", label: "Data Nominatif", icon: Table, exact: false },
  { href: "/admin/sop", label: "SOP", icon: ListChecks, exact: false },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone, exact: false },
  { href: "/admin/sanggahan", label: "Sanggahan", icon: MessageSquareWarning, exact: false },
] as const;

export function AdminSidebar({
  nama,
  role,
}: {
  nama: string;
  role: string;
}) {
  const pathname = usePathname();

  const items =
    role === "SUPER_ADMIN"
      ? [...NAV_ITEMS, { href: "/admin/users", label: "Kelola User", icon: Users, exact: false }]
      : NAV_ITEMS;

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-white dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2 border-b p-4">
        <div>
          <p className="text-sm font-semibold text-emerald-800">Admin Panel</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Pengadaan Tanah Depok</p>
        </div>
        <ThemeToggle className="h-9 w-9 shrink-0" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-300",
                isActive && "bg-emerald-50 text-emerald-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <p className="truncate px-3 text-xs text-zinc-500 dark:text-zinc-400">
          {nama} · {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
