import Image from "next/image";
import Link from "next/link";
import { Home, Building2, LandPlot, Ruler, Flower2, Building, ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/id";
import { cn } from "@/lib/utils";

const UNIT_CANVAS_STYLE = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(6,95,70,0.08) 1px, transparent 0)",
  backgroundSize: "18px 18px",
};

const SIRUMKIM_URL = "https://sirumkim.inweb.id/";
const SIMAKMUM_URL = "https://simakmum.depok.go.id/";

type UnitKind = "active" | "external" | "soon";

export function InstansiSection({ dict }: { dict: Dictionary }) {
  const units: { icon: typeof Home; label: string; kind: UnitKind; href?: string }[] = [
    { icon: Home, label: dict.home.unitPerumahan, kind: "external", href: SIRUMKIM_URL },
    { icon: Building2, label: dict.home.unitPermukiman, kind: "external", href: SIRUMKIM_URL },
    { icon: LandPlot, label: dict.home.unitPertanahan, kind: "active", href: "/" },
    { icon: Ruler, label: dict.home.unitTataBangunan, kind: "soon" },
    { icon: Flower2, label: dict.home.unitUptdPemakaman, kind: "external", href: SIMAKMUM_URL },
    { icon: Building, label: dict.home.unitUptdRusunawa, kind: "soon" },
  ];
  const connectorInset = 100 / (units.length * 2);

  return (
    <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Kop / letterhead */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="h-[3px] w-full bg-emerald-700" />
          <div className="h-[2px] w-full bg-amber-500" />

          <div className="relative bg-zinc-50/60 px-6 py-8 dark:bg-zinc-900/40 sm:px-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-[0.15]"
              style={UNIT_CANVAS_STYLE}
            />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
              <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Image
                  src="/logo-kota-depok.png"
                  alt="Logo Kota Depok"
                  width={300}
                  height={300}
                  className="h-full w-full object-contain"
                  priority
                />
              </span>

              <div className="hidden h-20 w-px shrink-0 bg-zinc-200 dark:bg-zinc-800 sm:block" />

              <div>
                <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                  SIPATAN
                </h1>
                <p className="mt-1.5 text-sm font-bold uppercase tracking-wide text-zinc-800 dark:text-zinc-200 sm:text-base">
                  {dict.home.instansiPelayananLabel}
                </p>
                <div className="mt-2.5 space-y-0.5 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 sm:text-[13px]">
                  <p>{dict.home.instansiIndukTitle} &middot; {dict.home.instansiIndukKota}</p>
                  <p className="text-emerald-700 dark:text-emerald-400">{dict.home.instansiBidang}</p>
                </div>
              </div>
            </div>

            <p className="relative mt-6 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:mt-7">
              {dict.home.instansiDesc}
            </p>
          </div>
        </div>

        {/* Struktur unit */}
        <div className="mt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {dict.home.unitLainTitle}
          </p>

          {/* Desktop: org-chart tree */}
          <div className="mt-6 hidden flex-col items-center md:flex">
            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700" />
            <div className="relative flex w-full max-w-5xl justify-between">
              <div
                className="absolute top-0 h-px bg-zinc-300 dark:bg-zinc-700"
                style={{ left: `${connectorInset}%`, right: `${connectorInset}%` }}
              />
              {units.map((unit) => (
                <div key={unit.label} className="flex flex-1 flex-col items-center px-2">
                  <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700" />
                  <UnitNode unit={unit} dict={dict} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/tablet: simple grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:hidden">
            {units.map((unit) => (
              <UnitNode key={unit.label} unit={unit} dict={dict} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UnitNode({
  unit,
  dict,
}: {
  unit: { icon: typeof Home; label: string; kind: UnitKind; href?: string };
  dict: Dictionary;
}) {
  const { icon: Icon, label, kind, href } = unit;
  const isActive = kind === "active";
  const isExternal = kind === "external";

  const content = (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition",
        isActive &&
          "border-emerald-600 bg-emerald-50 shadow-sm ring-1 ring-emerald-600/20 dark:border-emerald-700 dark:bg-emerald-950/40",
        isExternal &&
          "border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20",
        kind === "soon" &&
          "border-dashed border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          isActive && "bg-emerald-600 text-white",
          isExternal && "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
          kind === "soon" && "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p
        className={cn(
          "text-xs font-semibold leading-tight",
          isActive ? "text-emerald-900 dark:text-emerald-200" : "text-zinc-700 dark:text-zinc-300"
        )}
      >
        {label}
      </p>
      {isActive && (
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {dict.home.unitLainAndaDiSini}
        </span>
      )}
      {isExternal && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
          {dict.home.unitLainKunjungiWebsite} <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
      {kind === "soon" && (
        <span className="text-[10px] italic text-zinc-400 dark:text-zinc-600">{dict.home.unitLainSegeraHadir}</span>
      )}
    </div>
  );

  if (isActive) {
    return (
      <Link href={href ?? "/"} className="block w-full">
        {content}
      </Link>
    );
  }

  if (isExternal && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return (
    <div aria-disabled className="w-full cursor-not-allowed">
      {content}
    </div>
  );
}
