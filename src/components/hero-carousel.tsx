"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  desc?: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string;
  icon: ReactNode;
}

const STRIPE_PATTERN_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(120deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 26px)",
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function prev() {
    setActive((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setActive((i) => (i + 1) % slides.length);
  }

  const slide = slides[active];

  return (
    <section className="relative isolate overflow-hidden">
      <div className={cn("relative h-[440px] transition-colors duration-700 sm:h-[500px]", slide.gradient)}>
        <div className="pointer-events-none absolute inset-0" style={STRIPE_PATTERN_STYLE} />
        <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.12] [&_svg]:h-72 [&_svg]:w-72 sm:[&_svg]:h-96 sm:[&_svg]:w-96">
          {slide.icon}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <p className="text-lg font-bold text-white sm:text-xl">{slide.eyebrow}</p>
          <h1 className="font-heading mt-3 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-4xl">{slide.title}</h1>
          {slide.desc && <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">{slide.desc}</p>}
          <div className="mt-7">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center gap-2 rounded-md border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-zinc-900"
            >
              {slide.ctaLabel}
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 sm:bottom-8 sm:left-auto sm:right-6 sm:translate-x-0">
            <button
              type="button"
              onClick={prev}
              aria-label="Sebelumnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Berikutnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition hover:bg-white/15"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
