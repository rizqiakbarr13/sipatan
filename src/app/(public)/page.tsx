import Link from "next/link";
import { FileText, ListChecks, MessageSquareWarning, FileDown } from "lucide-react";
import { getActiveProject } from "@/lib/project";
import { MasaSanggahBanner } from "@/components/masa-sanggah-banner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const AKSI_UTAMA = [
  {
    href: "/data-nominatif",
    icon: ListChecks,
    title: "Lihat Data Nominatif",
    desc: "Periksa data bidang, luas tanah, bangunan, dan tanaman yang terkena dampak.",
  },
  {
    href: "/sanggahan/baru",
    icon: MessageSquareWarning,
    title: "Ajukan Sanggahan",
    desc: "Sampaikan sanggahan bila data yang diumumkan tidak sesuai.",
  },
  {
    href: "/sop",
    icon: FileText,
    title: "SOP Pengadaan",
    desc: "Pelajari tahapan proses pengadaan tanah dari awal hingga akhir.",
  },
  {
    href: "/api/formulir-pdf",
    icon: FileDown,
    title: "Unduh Formulir Sanggahan",
    desc: "Unduh formulir sanggahan resmi dalam format PDF.",
  },
] as const;

export default async function BerandaPage() {
  const project = await getActiveProject();

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Pengadaan Tanah untuk Kepentingan Umum
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {project?.namaProyek ?? "Pelebaran Simpang Parung Bingung, Kota Depok"}
          </h1>

          {project && (
            <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm text-zinc-600 sm:grid-cols-2">
              <div className="flex gap-2">
                <dt className="font-medium text-zinc-900">Nomor Pengumuman:</dt>
                <dd>{project.nomorPeng}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-zinc-900">Tanggal:</dt>
                <dd>
                  {project.tanggalPeng.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <dt className="font-medium text-zinc-900">Lokasi:</dt>
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
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-semibold text-zinc-900">Layanan Utama</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AKSI_UTAMA.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-semibold text-zinc-900">{title}</span>
              <span className="text-sm text-zinc-600">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {project?.deskripsi && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-xl border bg-zinc-50 p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Tentang Kegiatan</h2>
            <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700">
              {project.deskripsi}
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-emerald-900">
              Data Anda tidak sesuai dengan pengumuman?
            </h2>
            <p className="mt-1 text-sm text-emerald-800">
              Ajukan sanggahan secara online, dapatkan nomor tiket, dan pantau statusnya kapan saja.
            </p>
          </div>
          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
            Ajukan Sanggahan Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
