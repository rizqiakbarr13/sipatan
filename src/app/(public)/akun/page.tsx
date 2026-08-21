import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, Plus } from "lucide-react";
import { getWargaSession } from "@/lib/warga-session";
import { logoutWarga } from "./actions";
import { prisma } from "@/lib/prisma";
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
      <PageHeader title="Akun Saya" description={`Masuk sebagai ${session.nama} (${session.email})`} />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/sanggahan/baru" className={cn(buttonVariants({ size: "sm" }))}>
            <Plus className="h-4 w-4" /> Ajukan Sanggahan Baru
          </Link>
          <form action={logoutWarga}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </form>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Sanggahan Saya</h2>

        {daftarSanggahan.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
            <FileText className="h-8 w-8 text-zinc-400" />
            <p className="text-sm text-zinc-600">Anda belum pernah mengajukan sanggahan lewat akun ini.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {daftarSanggahan.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/akun/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-zinc-900">{s.nomorTiket}</p>
                    <p className="truncate text-sm text-zinc-500">{s.isiSanggahan}</p>
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
