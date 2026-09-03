import Link from "next/link";
import {
  FileText,
  ListChecks,
  MessageSquareWarning,
  FileDown,
  Megaphone,
  ArrowRight,
  ArrowUpRight,
  Search,
  HelpCircle,
  Phone,
  LandPlot,
  ScrollText,
  Table2,
  FileStack,
} from "lucide-react";
import { getActiveProject } from "@/lib/project";
import { getDictionary } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import { formatTanggalIndonesia } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroCarousel } from "@/components/hero-carousel";
import { InstansiSection } from "@/components/home/instansi-section";
import { GaleriSection } from "@/components/home/galeri-section";

const CADASTRAL_GRID_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "88px 88px, 88px 88px, 22px 22px, 22px 22px",
};

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  const [project, { dict }, pengumumanTerbaru, totalBidang, totalDokumen, totalPengumuman, totalSanggahan] =
    await Promise.all([
      getActiveProject(),
      getDictionary(),
      prisma.pengumuman.findMany({
        where: { published: true },
        orderBy: { tanggalTerbit: "desc" },
        take: 3,
      }),
      prisma.bidang.count(),
      prisma.dokumenPublikasi.count({ where: { published: true } }),
      prisma.pengumuman.count({ where: { published: true } }),
      prisma.sanggahan.count(),
    ]);

  const dataTerkini = [
    { label: dict.home.dataTerkiniBidang, value: totalBidang, color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", icon: Table2 },
    { label: dict.home.dataTerkiniDokumen, value: totalDokumen, color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400", icon: FileStack },
    { label: dict.home.dataTerkiniPengumuman, value: totalPengumuman, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: Megaphone },
    { label: dict.home.dataTerkiniSanggahan, value: totalSanggahan, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", icon: MessageSquareWarning },
  ];

  const AKSI_UTAMA = [
    {
      href: "/data-nominatif",
      icon: ListChecks,
      title: dict.home.lihatNominatifTitle,
      desc: dict.home.lihatNominatifDesc,
    },
    {
      href: "/sanggahan/baru",
      icon: MessageSquareWarning,
      title: dict.home.ajukanSanggahanTitle,
      desc: dict.home.ajukanSanggahanDesc,
    },
    {
      href: "/sop",
      icon: FileText,
      title: dict.home.sopTitle,
      desc: dict.home.sopDesc,
    },
    {
      href: "/sanggahan/formulir",
      icon: FileDown,
      title: dict.home.unduhFormulirTitle,
      desc: dict.home.unduhFormulirDesc,
    },
    {
      href: "/sanggahan/lacak",
      icon: Search,
      title: dict.home.lacakStatusTitle,
      desc: dict.home.lacakStatusDesc,
    },
  ];

  const heroSlides = [
    {
      eyebrow: "#SIPATAN",
      title: project?.namaProyek ?? dict.home.namaProyekFallback,
      desc: project
        ? `${dict.home.nomorPengumuman} ${project.nomorPeng} — Kelurahan ${project.kelurahan}, Kecamatan ${project.kecamatan}, ${project.kota}`
        : undefined,
      ctaLabel: dict.home.bacaSelengkapnya,
      ctaHref: "/pengumuman",
      gradient: "bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800",
      icon: <LandPlot className="h-full w-full text-white" strokeWidth={1} />,
    },
    {
      eyebrow: "#Sanggahan14Hari",
      title: dict.home.kanalSanggahanTitle,
      desc: dict.home.kanalSanggahanDesc,
      ctaLabel: dict.home.ajukanSanggahanTitle,
      ctaHref: "/sanggahan/baru",
      gradient: "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800",
      icon: <ScrollText className="h-full w-full text-white" strokeWidth={1} />,
    },
    {
      eyebrow: "#TransparansiData",
      title: dict.home.lihatNominatifTitle,
      desc: dict.home.lihatNominatifDesc,
      ctaLabel: dict.home.lihatNominatifTitle,
      ctaHref: "/data-nominatif",
      gradient: "bg-gradient-to-br from-amber-700 via-orange-700 to-rose-800",
      icon: <Table2 className="h-full w-full text-white" strokeWidth={1} />,
    },
  ];

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <InstansiSection dict={dict} />

      <section className="relative overflow-hidden border-b bg-gradient-to-b from-emerald-50 via-white to-white dark:border-zinc-800 dark:from-emerald-950/20 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-zinc-900 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {dict.home.dataTerkiniBadge}
          </span>

          {project && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {dict.home.nomorPengumuman} <span className="font-semibold text-zinc-900 dark:text-zinc-100">{project.nomorPeng}</span>
              {" · "}
              {formatTanggalIndonesia(project.tanggalPeng)}
              <br className="sm:hidden" />
              {" · "}Kelurahan {project.kelurahan}, Kecamatan {project.kecamatan}, {project.kota}
            </p>
          )}

          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {dataTerkini.map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", color)}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
                <p className="text-center text-[11px] leading-tight text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-emerald-900 dark:bg-zinc-900/60">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              <MessageSquareWarning className="h-4 w-4 shrink-0" /> {dict.home.kanalSanggahanTitle}
            </p>
            <p className="mt-1.5 text-sm text-emerald-800 dark:text-emerald-300">{dict.home.kanalSanggahanDesc}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/data-nominatif"
                className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {dict.home.kanalSanggahanNominatif}
              </Link>
              <Link
                href="/pengumuman"
                className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {dict.home.kanalSanggahanPengumuman}
              </Link>
            </div>
            {pengumumanTerbaru[0] && (
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {dict.home.pembaruanTerakhir}: &ldquo;{pengumumanTerbaru[0].judul}&rdquo; · {formatTanggalIndonesia(pengumumanTerbaru[0].tanggalTerbit)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800 p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-60" style={CADASTRAL_GRID_STYLE} />
          <div className="relative">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{dict.home.layananUtama}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {AKSI_UTAMA.map(({ href, icon: Icon, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white">{title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/80">{desc}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:bg-white/15">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Megaphone className="h-5 w-5 text-emerald-700 dark:text-emerald-400" /> {dict.home.pengumumanTerbaruTitle}
          </h2>
          <Link
            href="/pengumuman"
            className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            {dict.home.pengumumanTerbaruLihatSemua} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {pengumumanTerbaru.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {pengumumanTerbaru.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border-t-4 border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
                  [
                    "border-t-emerald-500",
                    "border-t-blue-500",
                    "border-t-amber-500",
                  ][i % 3]
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                    {formatTanggalIndonesia(p.tanggalTerbit)}
                  </p>
                  {Date.now() - p.tanggalTerbit.getTime() < 7 * 24 * 60 * 60 * 1000 && (
                    <Badge variant="success">{dict.pengumuman.baruBadge}</Badge>
                  )}
                </div>
                <h3 className="mt-1 line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-100">{p.judul}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">{p.konten}</p>
                {p.sanggahanDibuka && (
                  <Link
                    href={`/sanggahan/baru?pengumumanId=${p.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    <MessageSquareWarning className="h-4 w-4" /> {dict.nav.ajukanSanggahan}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{dict.home.pengumumanTerbaruKosong}</p>
        )}
      </section>

      {project?.deskripsi && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-xl border bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="font-heading text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dict.home.tentangKegiatan}</h2>
            <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {project.deskripsi}
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/faq"
            className="group flex items-center gap-4 rounded-xl border border-purple-200 bg-purple-50 p-5 transition hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/30 dark:hover:bg-purple-950/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{dict.faq.title}</p>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{dict.faq.desc}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-purple-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-purple-400" />
          </Link>

          <Link
            href="/hubungi-kami"
            className="group flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Phone className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{dict.kontak.title}</p>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{dict.kontak.desc}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-blue-400" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading font-semibold text-emerald-900 dark:text-emerald-200">{dict.home.ctaTitle}</h2>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.home.ctaDesc}</p>
          </div>
          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
            {dict.home.ctaButton}
          </Link>
        </div>
      </section>

      <GaleriSection dict={dict} />
    </div>
  );
}
