"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, UserCircle, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/lib/i18n/client";
import { logoutWarga } from "@/app/(public)/akun/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader({ warga }: { warga: { nama: string; email: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { dict } = useLocale();

  const NAV_LINKS = [
    { href: "/", label: dict.nav.beranda },
    { href: "/dokumen", label: dict.nav.dokumen },
    { href: "/data-nominatif", label: dict.nav.nominatif },
    { href: "/sop", label: dict.nav.sop },
    { href: "/pengumuman", label: dict.nav.pengumuman },
    { href: "/sanggahan/lacak", label: dict.nav.lacak },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/sipatan-logo.png"
            alt="SIPATAN"
            width={140}
            height={140}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-emerald-400",
                  active && "bg-emerald-50 text-emerald-800 dark:bg-zinc-800 dark:text-emerald-400"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <ThemeToggle />

          {warga ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <UserCircle className="h-4 w-4" />
                  {warga.nama.split(" ")[0]}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{warga.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/akun">
                    <FileText className="h-4 w-4" /> {dict.nav.sanggahanSaya}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    logoutWarga();
                  }}
                  className="text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" /> {dict.nav.keluar}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/akun/masuk"
              className="inline-flex h-10 items-center rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {dict.nav.masuk}
            </Link>
          )}

          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "sm" }))}>
            {dict.nav.ajukanSanggahan}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.tutupMenu : dict.nav.bukaMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi mobile"
          className="border-t bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-emerald-400",
                    pathname === link.href && "bg-emerald-50 text-emerald-800 dark:bg-zinc-800 dark:text-emerald-400"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between gap-2 pt-2">
              <LanguageToggle className="flex-1 justify-center" />
              {warga ? (
                <Link
                  href="/akun"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <UserCircle className="h-4 w-4" /> {warga.nama.split(" ")[0]}
                </Link>
              ) : (
                <Link
                  href="/akun/masuk"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                >
                  {dict.nav.masuk}
                </Link>
              )}
            </li>
            {warga && (
              <li>
                <form action={logoutWarga}>
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-red-600 dark:border-zinc-700 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" /> {dict.nav.keluar}
                  </button>
                </form>
              </li>
            )}
            <li className="pt-2">
              <Link
                href="/sanggahan/baru"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-800"
              >
                {dict.nav.ajukanSanggahan}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
