import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, Plus } from "lucide-react";
import { getWargaSession } from "@/lib/warga-session";
import { logoutWarga } from "./actions";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pagination, resolvePage } from "@/components/pagination";
import {
  formatTanggalWaktuIndonesia,
  SANGGAHAN_STATUS_BADGE_VARIANT,
  SANGGAHAN_STATUS_LABEL,
} from "@/lib/labels";
import type { Prisma, SanggahanStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Akun Saya",
};

const PAGE_SIZE = 5;

export default async function AkunPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; dari?: string; sampai?: string; page?: string }>;
}) {
  const session = await getWargaSession();
  if (!session) redirect("/akun/masuk?next=/akun");
  const { dict } = await getDictionary();

  const { status, dari, sampai, page: pageParam } = await searchParams;
  const page = resolvePage(pageParam);

  const warga = await prisma.warga.findUnique({
    where: { id: session.id },
    select: { nik: true, noHp: true },
  });

  const where: Prisma.SanggahanWhereInput = { wargaId: session.id };
  if (status && status in SANGGAHAN_STATUS_LABEL) where.status = status as SanggahanStatus;
  if (dari || sampai) {
    where.createdAt = {};
    if (dari) where.createdAt.gte = new Date(dari);
    if (sampai) {
      const end = new Date(sampai);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [daftarSanggahan, total] = await Promise.all([
    prisma.sanggahan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nomorTiket: true,
        status: true,
        createdAt: true,
        isiSanggahan: true,
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.sanggahan.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = Boolean(status || dari || sampai);

  return (
    <div>
      <PageHeader title={dict.nav.akunSaya} description={`${dict.account.masukSebagai} ${session.nama} (${session.email})`} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "sm" }))}>
            <Plus className="h-4 w-4" /> {dict.account.ajukanBaru}
          </Link>
          <form action={logoutWarga}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-4 w-4" /> {dict.nav.keluar}
            </Button>
          </form>
        </div>

        {warga && (warga.nik || warga.noHp) && (
          <div className="mb-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">NIK Terdaftar</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{warga.nik || "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">No. HP Terdaftar</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{warga.noHp || "-"}</p>
            </div>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.account.riwayatTitle}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{total} sanggahan</p>
        </div>

        <form method="GET" className="mb-4 flex flex-wrap items-end gap-2">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="">Semua Status</option>
            {Object.entries(SANGGAHAN_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400">Dari tanggal</label>
            <Input type="date" name="dari" defaultValue={dari} className="w-40" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400">Sampai tanggal</label>
            <Input type="date" name="sampai" defaultValue={sampai} className="w-40" />
          </div>
          <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>Terapkan</button>
          {isFiltered && (
            <Link href="/akun" className={cn(buttonVariants({ variant: "ghost" }))}>
              Reset
            </Link>
          )}
        </form>

        {daftarSanggahan.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <FileText className="h-8 w-8 text-zinc-400" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isFiltered ? "Tidak ada sanggahan yang cocok dengan filter." : dict.account.riwayatKosong}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {daftarSanggahan.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/akun/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.nomorTiket}</p>
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{s.isiSanggahan}</p>
                    <p className="mt-1 text-xs text-zinc-400">{formatTanggalWaktuIndonesia(s.createdAt)}</p>
                  </div>
                  <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[s.status]} className="shrink-0">
                    {SANGGAHAN_STATUS_LABEL[s.status]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/akun" searchParams={{ status, dari, sampai }} />
      </div>
    </div>
  );
}
