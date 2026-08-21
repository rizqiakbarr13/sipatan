"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/dokumen", label: "Dokumen Publikasi" },
  { href: "/data-nominatif", label: "Data Nominatif" },
  { href: "/sop", label: "SOP" },
  { href: "/pengumuman", label: "Pengumuman" },
  { href: "/sanggahan/lacak", label: "Lacak Sanggahan" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-emerald-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm text-white">
            PT
          </span>
          <span className="hidden text-sm leading-tight sm:block">
            Pengadaan Tanah
            <br />
            Kota Depok
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800",
                  active && "bg-emerald-50 text-emerald-800"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/sanggahan/baru"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Ajukan Sanggahan
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
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
          className="border-t bg-white px-4 py-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800",
                    pathname === link.href && "bg-emerald-50 text-emerald-800"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/sanggahan/baru"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-emerald-800"
              >
                Ajukan Sanggahan
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
