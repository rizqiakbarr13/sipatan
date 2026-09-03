"use client";

import Link from "next/link";
import Image from "next/image";
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
  IdCard,
  Camera,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, color: "text-zinc-600 dark:text-zinc-300", ring: "bg-zinc-400" },
  { href: "/admin/proyek", label: "Proyek", icon: Building2, exact: false, color: "text-blue-600 dark:text-blue-400", ring: "bg-blue-500" },
  { href: "/admin/dokumen", label: "Dokumen Publikasi", icon: FileStack, exact: false, color: "text-violet-600 dark:text-violet-400", ring: "bg-violet-500" },
  { href: "/admin/nominatif", label: "Data Nominatif", icon: Table, exact: false, color: "text-amber-600 dark:text-amber-400", ring: "bg-amber-500" },
  { href: "/admin/sop", label: "SOP", icon: ListChecks, exact: false, color: "text-teal-600 dark:text-teal-400", ring: "bg-teal-500" },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone, exact: false, color: "text-pink-600 dark:text-pink-400", ring: "bg-pink-500" },
  { href: "/admin/sanggahan", label: "Sanggahan", icon: MessageSquareWarning, exact: false, color: "text-orange-600 dark:text-orange-400", ring: "bg-orange-500" },
  { href: "/admin/warga", label: "Akun Warga", icon: IdCard, exact: false, color: "text-cyan-600 dark:text-cyan-400", ring: "bg-cyan-500" },
  { href: "/admin/galeri", label: "Galeri Kegiatan", icon: Camera, exact: false, color: "text-rose-600 dark:text-rose-400", ring: "bg-rose-500" },
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
      ? [...NAV_ITEMS, { href: "/admin/users", label: "Kelola User", icon: Users, exact: false, color: "text-red-600 dark:text-red-400", ring: "bg-red-500" }]
      : NAV_ITEMS;

  const initial = nama.trim().charAt(0).toUpperCase() || "A";

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800">
            <Image src="/sipatan-logo.png" alt="SIPATAN" width={140} height={140} className="h-8 w-auto object-contain" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-heading font-semibold text-zinc-900 dark:text-zinc-100">SIPATAN</p>
            <p className="text-[11px] uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Admin Panel</p>
          </div>
        </div>
        <ThemeToggle className="h-9 w-9 shrink-0" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ href, label, icon: Icon, exact, color, ring }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                isActive && "bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
                  ring,
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                )}
              />
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? color : "text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">{nama}</p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
