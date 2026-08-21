"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sanggahanFormSchema, type SanggahanFormValues } from "@/lib/validation/sanggahan";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert } from "lucide-react";

export interface BidangOption {
  id: string;
  noUrut: number;
  namaPemilik: string;
}

export interface DokumenOption {
  id: string;
  judul: string;
}

export function SanggahanForm({
  bidangOptions,
  dokumenOptions,
  defaultBidangId,
  defaultDokumenId,
  masaSanggahDitutup,
}: {
  bidangOptions: BidangOption[];
  dokumenOptions: DokumenOption[];
  defaultBidangId?: string;
  defaultDokumenId?: string;
  masaSanggahDitutup: boolean;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SanggahanFormValues>({
    resolver: zodResolver(sanggahanFormSchema),
    defaultValues: {
      bidangId: defaultBidangId ?? "",
      dokumenId: defaultDokumenId ?? "",
      pernyataanBenar: false,
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    if (selected) {
      const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(selected.type)) {
        setFileError("Format file harus PDF, JPG, PNG, atau WEBP");
        setFile(null);
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setFileError("Ukuran file maksimal 5MB");
        setFile(null);
        return;
      }
    }
    setFile(selected);
  }

  async function onSubmit(values: SanggahanFormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      if (file) formData.append("lampiran", file);

      const res = await fetch("/api/sanggahan", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Gagal mengirim sanggahan. Silakan coba lagi.");
        setSubmitting(false);
        return;
      }

      router.push(`/sanggahan/sukses?tiket=${encodeURIComponent(data.nomorTiket)}`);
    } catch {
      setServerError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setSubmitting(false);
    }
  }

  if (masaSanggahDitutup) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p>
          Masa sanggah telah berakhir atau kanal sanggahan untuk dokumen terkait sedang
          ditutup, sehingga pengajuan sanggahan baru tidak dapat diproses saat ini.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nama">Nama *</Label>
          <Input id="nama" {...register("nama")} aria-invalid={!!errors.nama} />
          {errors.nama && <p className="text-xs text-red-600">{errors.nama.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nik">NIK *</Label>
          <Input id="nik" inputMode="numeric" maxLength={16} {...register("nik")} aria-invalid={!!errors.nik} />
          {errors.nik && <p className="text-xs text-red-600">{errors.nik.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="alasHak">Alas Hak</Label>
          <Input id="alasHak" placeholder="mis. SHM No. 1121" {...register("alasHak")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noDanom">No. Danom</Label>
          <Input id="noDanom" {...register("noDanom")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noPetaBidang">No. Peta Bidang</Label>
          <Input id="noPetaBidang" {...register("noPetaBidang")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noNis">No. NIS</Label>
          <Input id="noNis" {...register("noNis")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bidangId">Bidang Terkait (opsional)</Label>
          <select
            id="bidangId"
            {...register("bidangId")}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <option value="">— Pilih bidang —</option>
            {bidangOptions.map((b) => (
              <option key={b.id} value={b.id}>
                No. {b.noUrut} — {b.namaPemilik}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dokumenId">Dokumen Publikasi Terkait (opsional)</Label>
          <select
            id="dokumenId"
            {...register("dokumenId")}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <option value="">— Pilih dokumen —</option>
            {dokumenOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.judul}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="kontakEmail">Email</Label>
          <Input id="kontakEmail" type="email" {...register("kontakEmail")} aria-invalid={!!errors.kontakEmail} />
          {errors.kontakEmail && <p className="text-xs text-red-600">{errors.kontakEmail.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kontakHp">Nomor HP</Label>
          <Input id="kontakHp" inputMode="tel" {...register("kontakHp")} aria-invalid={!!errors.kontakHp} />
          {errors.kontakHp && <p className="text-xs text-red-600">{errors.kontakHp.message}</p>}
        </div>
      </div>
      <p className="-mt-3 text-xs text-zinc-500">Isi salah satu: email atau nomor HP.</p>

      <div className="space-y-1.5">
        <Label htmlFor="isiSanggahan">Isi Sanggahan *</Label>
        <Textarea
          id="isiSanggahan"
          rows={6}
          placeholder="Jelaskan secara rinci ketidaksesuaian data yang Anda temukan..."
          {...register("isiSanggahan")}
          aria-invalid={!!errors.isiSanggahan}
        />
        {errors.isiSanggahan && (
          <p className="text-xs text-red-600">{errors.isiSanggahan.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lampiran">Lampiran Bukti (opsional, PDF/JPG/PNG, maks. 5MB)</Label>
        <input
          id="lampiran"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {fileError && <p className="text-xs text-red-600">{fileError}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="pernyataanBenar"
          type="checkbox"
          {...register("pernyataanBenar")}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        />
        <Label htmlFor="pernyataanBenar" className="font-normal">
          Saya menyatakan bahwa data yang saya isikan di atas adalah benar.
        </Label>
      </div>
      {errors.pernyataanBenar && (
        <p className="-mt-4 text-xs text-red-600">{errors.pernyataanBenar.message}</p>
      )}

      <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Kirim Sanggahan
      </Button>
    </form>
  );
}
