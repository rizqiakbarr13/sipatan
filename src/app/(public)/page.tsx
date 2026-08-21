import Link from "next/link";
import { FileText, ListChecks, MessageSquareWarning, FileDown } from "lucide-react";
import { getActiveProject } from "@/lib/project";
import { getDictionary } from "@/lib/i18n/server";
import { MasaSanggahBanner } from "@/components/masa-sanggah-banner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  const [project, { locale, dict }] = await Promise.all([getActiveProject(), getDictionary()]);

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
      href: "/api/formulir-pdf",
      icon: FileDown,
      title: dict.home.unduhFormulirTitle,
      desc: dict.home.unduhFormulirDesc,
    },
  ];

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-emerald-50 to-white dark:border-zinc-800 dark:from-emerald-950/30 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {dict.home.eyebrow}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {project?.namaProyek ?? dict.home.namaProyekFallback}
          </h1>

          {project && (
            <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-100">{dict.home.nomorPengumuman}</dt>
                <dd>{project.nomorPeng}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-100">{dict.home.tanggal}</dt>
                <dd>
                  {project.tanggalPeng.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <dt className="font-medium text-zinc-900 dark:text-zinc-100">{dict.home.lokasi}</dt>
                <dd>
                  Kelurahan {project.kelurahan}, Kecamatan {project.kecamatan},{" "}
                  {project.kota}, {project.provinsi}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-6 max-w-xl">
            <MasaSanggahBanner
              mulai={project?.masaSanggahMulai ?? null}
              selesai={project?.masaSanggahSelesai ?? null}
              locale={locale}
              dict={dict}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dict.home.layananUtama}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AKSI_UTAMA.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:group-hover:bg-emerald-900">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {project?.deskripsi && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-xl border bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dict.home.tentangKegiatan}</h2>
            <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {project.deskripsi}
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-emerald-900 dark:text-emerald-200">{dict.home.ctaTitle}</h2>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.home.ctaDesc}</p>
          </div>
          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
            {dict.home.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
