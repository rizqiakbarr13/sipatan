"use client";

import { useTransition } from "react";
import { CheckCircle2, XCircle, MinusCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { verifikasiIdentitas } from "../actions";
import type { HasilCocokIdentitas } from "@/lib/identitas";

function Baris({ label, pengaju, pemilik, cocok }: { label: string; pengaju: string; pemilik: string | null; cocok: boolean | null }) {
  const Icon = cocok === null ? MinusCircle : cocok ? CheckCircle2 : XCircle;
  const warna =
    cocok === null
      ? "text-zinc-400"
      : cocok
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400";
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <Icon className={`mt-0.5 h-4 w-4 ${warna}`} />
      <div>
        <p className="text-xs uppercase text-zinc-400 dark:text-zinc-500">{label}</p>
        <p className="text-zinc-800 dark:text-zinc-200">
          Pengaju: <strong>{pengaju || "-"}</strong>
        </p>
        <p className="text-zinc-800 dark:text-zinc-200">
          Data bidang: <strong>{pemilik ?? "— (tidak ada data)"}</strong>
        </p>
      </div>
    </div>
  );
}

export function VerifikasiIdentitas({
  id,
  status,
  pengaju,
  pemilik,
  hasil,
}: {
  id: string;
  status: string;
  pengaju: { nama: string; nik: string };
  pemilik: { namaPemilik: string; nik: string | null } | null;
  hasil: HasilCocokIdentitas;
}) {
  const [pending, startTransition] = useTransition();
  const sudahFinal = status === "DITOLAK" || status === "SELESAI";

  function handleVerify() {
    startTransition(async () => {
      try {
        const result = await verifikasiIdentitas(id);
        if (result.error) toast.error(result.error);
        else if (result.ditolak) toast.success("Identitas tidak sesuai — sanggahan ditolak otomatis");
        else toast.success("Identitas terverifikasi");
      } catch {
        toast.error("Gagal memverifikasi identitas");
      }
    });
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <ShieldCheck className="h-4 w-4" /> Verifikasi Identitas
      </h2>

      {!hasil.adaData ? (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Sanggahan ini tidak terkait bidang tertentu, sehingga nama & NIK pengaju tidak bisa dicocokkan otomatis.
        </p>
      ) : (
        <div className="mb-4 space-y-3">
          <Baris label="Nama" pengaju={pengaju.nama} pemilik={pemilik?.namaPemilik ?? null} cocok={hasil.namaCocok} />
          <Baris
            label="NIK"
            pengaju={pengaju.nik}
            pemilik={pemilik?.nik ? pemilik.nik : null}
            cocok={hasil.nikCocok}
          />
          {!pemilik?.nik && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">NIK di data bidang kosong, hanya nama yang dicocokkan.</p>
          )}
        </div>
      )}

      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        {hasil.adaData
          ? hasil.tidakSesuai
            ? "Hasil pencocokan: TIDAK SESUAI. Klik verifikasi untuk menolak sanggahan secara otomatis."
            : "Hasil pencocokan: SESUAI. Klik verifikasi untuk menandai identitas terverifikasi."
          : "Klik verifikasi untuk menandai identitas terverifikasi."}
      </p>

      <Button
        type="button"
        onClick={handleVerify}
        disabled={pending || sudahFinal}
        variant={hasil.tidakSesuai && hasil.adaData ? "destructive" : "default"}
      >
        {sudahFinal ? "Sudah final" : "Verifikasi Identitas"}
      </Button>
    </section>
  );
}
