"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileDown, FileText, ListChecks, Megaphone, MessageSquareWarning } from "lucide-react";
import { formatTanggalIndonesia } from "@/lib/labels";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries/id";

const TUJUH_HARI_MS = 7 * 24 * 60 * 60 * 1000;

export interface PengumumanCarouselItem {
  id: string;
  judul: string;
  konten: string;
  tanggalTerbit: Date;
  sanggahanDibuka: boolean;
  linkDataNominatif: boolean;
  lampiranUrl: string | null;
  dokumenTerkait: { id: string; judul: string } | null;
}

export function PengumumanCarousel({
  items,
  dict,
  now,
}: {
  items: PengumumanCarouselItem[];
  dict: Dictionary;
  now: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  function scrollByAmount(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="relative mt-5">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {items.map((p) => {
          const isBaru = now - p.tanggalTerbit.getTime() < TUJUH_HARI_MS;
          return (
            <article
              key={p.id}
              className="w-80 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Megaphone className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      {formatTanggalIndonesia(p.tanggalTerbit)}
                    </p>
                    {isBaru && <Badge variant="success">{dict.pengumuman.baruBadge}</Badge>}
                    {p.sanggahanDibuka && <Badge variant="warning">{dict.pengumuman.kanalDibuka}</Badge>}
                  </div>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.judul}</h3>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {p.konten}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {p.lampiranUrl && (
                      <a
                        href={p.lampiranUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        <FileDown className="h-3.5 w-3.5" /> {dict.pengumuman.lihatLampiran}
                      </a>
                    )}
                    {p.sanggahanDibuka && (
                      <Link href={`/sanggahan/baru?pengumumanId=${p.id}`} className={cn(buttonVariants({ size: "sm" }), "h-7 px-2.5 text-xs")}>
                        <MessageSquareWarning className="h-3.5 w-3.5" /> {dict.nav.ajukanSanggahan}
                      </Link>
                    )}
                    {p.dokumenTerkait && (
                      <Link
                        href={`/dokumen/${p.dokumenTerkait.id}`}
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "h-7 px-2.5 text-xs")}
                      >
                        <FileText className="h-3.5 w-3.5" /> {dict.pengumuman.lihatDokumenTerkait}
                      </Link>
                    )}
                    {p.linkDataNominatif && (
                      <Link
                        href="/data-nominatif"
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "h-7 px-2.5 text-xs")}
                      >
                        <ListChecks className="h-3.5 w-3.5" /> {dict.pengumuman.lihatDataNominatif}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Geser ke kiri"
        className="absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Geser ke kanan"
        className="absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
