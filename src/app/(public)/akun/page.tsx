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
import { cn } from "@/lib/utils";
import {
  formatTanggalIndonesia,
  SANGGAHAN_STATUS_BADGE_VARIANT,
  SANGGAHAN_STATUS_LABEL,
} from "@/lib/labels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Akun Saya",
};

export default async function AkunPage() {
  const session = await getWargaSession();
  if (!session) redirect("/akun/masuk?next=/akun");
  const { dict } = await getDictionary();

  const daftarSanggahan = await prisma.sanggahan.findMany({
    where: { wargaId: session.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nomorTiket: true,
      status: true,
      createdAt: true,
      isiSanggahan: true,
    },
  });

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

        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dict.account.riwayatTitle}</h2>

        {daftarSanggahan.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <FileText className="h-8 w-8 text-zinc-400" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{dict.account.riwayatKosong}</p>
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
                    <p className="mt-1 text-xs text-zinc-400">{formatTanggalIndonesia(s.createdAt)}</p>
                  </div>
                  <Badge variant={SANGGAHAN_STATUS_BADGE_VARIANT[s.status]} className="shrink-0">
                    {SANGGAHAN_STATUS_LABEL[s.status]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
