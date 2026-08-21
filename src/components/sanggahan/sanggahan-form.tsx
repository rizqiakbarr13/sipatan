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
import { useLocale } from "@/lib/i18n/client";

export interface BidangOption {
  id: string;
  noUrut: number;
  namaPemilik: string;
}

export interface DokumenOption {
  id: string;
  judul: string;
}

export interface WargaPrefill {
  nama: string;
  email: string;
  nik: string | null;
  noHp: string | null;
}

export function SanggahanForm({
  bidangOptions,
  dokumenOptions,
  defaultBidangId,
  defaultDokumenId,
  masaSanggahDitutup,
  warga,
}: {
  bidangOptions: BidangOption[];
  dokumenOptions: DokumenOption[];
  defaultBidangId?: string;
  defaultDokumenId?: string;
  masaSanggahDitutup: boolean;
  warga?: WargaPrefill | null;
}) {
  const router = useRouter();
  const { dict } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [anonim, setAnonim] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SanggahanFormValues>({
    resolver: zodResolver(sanggahanFormSchema),
    defaultValues: {
      bidangId: defaultBidangId ?? "",
      dokumenId: defaultDokumenId ?? "",
      nama: warga?.nama ?? "",
      nik: warga?.nik ?? "",
      kontakEmail: warga?.email ?? "",
      kontakHp: warga?.noHp ?? "",
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
      if (warga) formData.append("anonim", String(anonim));

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
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>{dict.sanggahanForm.kanalTertutup}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      {warga && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          <p>
            {dict.account.masukSebagai} <strong>{warga.nama}</strong>. {dict.account.dataOtomatisTerisi}
          </p>
          <label className="mt-2 flex items-start gap-2">
            <input
              type="checkbox"
              checked={anonim}
              onChange={(e) => setAnonim(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
            <span>{dict.account.ajukanAnonim}</span>
          </label>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nama">{dict.sanggahanForm.nama}</Label>
          <Input id="nama" {...register("nama")} aria-invalid={!!errors.nama} />
          {errors.nama && <p className="text-xs text-red-600 dark:text-red-400">{errors.nama.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nik">{dict.sanggahanForm.nik}</Label>
          <Input id="nik" inputMode="numeric" maxLength={16} {...register("nik")} aria-invalid={!!errors.nik} />
          {errors.nik && <p className="text-xs text-red-600 dark:text-red-400">{errors.nik.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="alasHak">{dict.sanggahanForm.alasHak}</Label>
          <Input id="alasHak" placeholder="mis. SHM No. 1121" {...register("alasHak")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noDanom">{dict.sanggahanForm.noDanom}</Label>
          <Input id="noDanom" {...register("noDanom")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noPetaBidang">{dict.sanggahanForm.noPetaBidang}</Label>
          <Input id="noPetaBidang" {...register("noPetaBidang")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noNis">{dict.sanggahanForm.noNis}</Label>
          <Input id="noNis" {...register("noNis")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bidangId">{dict.sanggahanForm.bidangTerkaitOpsional}</Label>
          <select
            id="bidangId"
            {...register("bidangId")}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">{dict.sanggahanForm.pilihBidang}</option>
            {bidangOptions.map((b) => (
              <option key={b.id} value={b.id}>
                No. {b.noUrut} — {b.namaPemilik}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dokumenId">{dict.sanggahanForm.dokumenTerkaitOpsional}</Label>
          <select
            id="dokumenId"
            {...register("dokumenId")}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">{dict.sanggahanForm.pilihDokumen}</option>
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
          <Label htmlFor="kontakEmail">{dict.sanggahanForm.email}</Label>
          <Input id="kontakEmail" type="email" {...register("kontakEmail")} aria-invalid={!!errors.kontakEmail} />
          {errors.kontakEmail && <p className="text-xs text-red-600 dark:text-red-400">{errors.kontakEmail.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kontakHp">{dict.sanggahanForm.nomorHp}</Label>
          <Input id="kontakHp" inputMode="tel" {...register("kontakHp")} aria-invalid={!!errors.kontakHp} />
          {errors.kontakHp && <p className="text-xs text-red-600 dark:text-red-400">{errors.kontakHp.message}</p>}
        </div>
      </div>
      <p className="-mt-3 text-xs text-zinc-500 dark:text-zinc-400">{dict.sanggahanForm.isiSalahSatu}</p>

      <div className="space-y-1.5">
        <Label htmlFor="isiSanggahan">{dict.sanggahanForm.isiSanggahan}</Label>
        <Textarea
          id="isiSanggahan"
          rows={6}
          placeholder={dict.sanggahanForm.isiSanggahanPlaceholder}
          {...register("isiSanggahan")}
          aria-invalid={!!errors.isiSanggahan}
        />
        {errors.isiSanggahan && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.isiSanggahan.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lampiran">{dict.sanggahanForm.lampiran}</Label>
        <input
          id="lampiran"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300 dark:file:bg-emerald-950 dark:file:text-emerald-400 dark:hover:file:bg-emerald-900"
        />
        {fileError && <p className="text-xs text-red-600 dark:text-red-400">{fileError}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="pernyataanBenar"
          type="checkbox"
          {...register("pernyataanBenar")}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700"
        />
        <Label htmlFor="pernyataanBenar" className="font-normal">
          {dict.sanggahanForm.pernyataanBenar}
        </Label>
      </div>
      {errors.pernyataanBenar && (
        <p className="-mt-4 text-xs text-red-600 dark:text-red-400">{errors.pernyataanBenar.message}</p>
      )}

      <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {dict.sanggahanForm.kirim}
      </Button>
    </form>
  );
}
