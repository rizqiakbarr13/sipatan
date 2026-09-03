"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface GaleriTile {
  id: string;
  caption: string;
  fileUrl: string;
  span: string;
  uploadedAtLabel: string;
}

const GRID_LIMIT = 6;

function GaleriTileButton({
  tile,
  span,
  onClick,
}: {
  tile: GaleriTile;
  span?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${tile.caption} — perbesar foto`}
      onClick={onClick}
      className={cn(
        "group relative block aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-zinc-200 text-left shadow-sm transition hover:shadow-lg dark:bg-zinc-800",
        span
      )}
    >
      <Image
        src={tile.fileUrl}
        alt={tile.caption}
        fill
        sizes="(min-width: 640px) 33vw, 50vw"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="text-xs font-semibold leading-snug text-white sm:text-sm">{tile.caption}</p>
      </div>
      <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
        <ZoomIn className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}

export function GaleriGrid({ items }: { items: GaleriTile[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, showPrev, showNext]);

  const active = activeIndex !== null ? items[activeIndex] : null;
  const gridItems = items.slice(0, GRID_LIMIT);
  const extraItems = items.slice(GRID_LIMIT);

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {gridItems.map((tile, i) => (
          <GaleriTileButton key={tile.id} tile={tile} span={tile.span} onClick={() => setActiveIndex(i)} />
        ))}
      </div>

      {extraItems.length > 0 && (
        <div className="relative mt-4">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4"
          >
            {extraItems.map((tile, i) => (
              <div key={tile.id} className="w-40 shrink-0 snap-start sm:w-52">
                <GaleriTileButton tile={tile} onClick={() => setActiveIndex(GRID_LIMIT + i)} />
              </div>
            ))}
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
      )}

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && close()}>
        {active && (
          <DialogContent className="max-w-5xl gap-0 overflow-hidden p-0">
            <div className="relative h-[55vh] bg-zinc-950 sm:h-[70vh]">
              <Image
                key={active.id}
                src={active.fileUrl}
                alt={active.caption}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Foto sebelumnya"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Foto berikutnya"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white">
                    {activeIndex! + 1} / {items.length}
                  </span>
                </>
              )}
            </div>
            <div className="px-5 py-4">
              <DialogTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {active.caption}
              </DialogTitle>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                <Clock className="h-3 w-3 shrink-0" /> {active.uploadedAtLabel}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
