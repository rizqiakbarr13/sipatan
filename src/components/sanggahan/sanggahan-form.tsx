"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sanggahanFormSchema, type SanggahanFormValues, type BuktiTambahanRow } from "@/lib/validation/sanggahan";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert, X, Paperclip } from "lucide-react";
import { useLocale } from "@/lib/i18n/client";

export interface ProjectOption {
  id: string;
  namaProyek: string;
  masaSanggahSelesai?: Date | string | null;
}

export interface BidangOption {
  id: string;
  projectId: string;
  noUrut: number;
  namaPemilik: string;
}

export interface DokumenOption {
  id: string;
  projectId: string | null;
  judul: string;
}

export interface PengumumanOption {
  id: string;
  projectId: string | null;
  judul: string;
}

export interface WargaPrefill {
  nama: string;
  email: string;
  nik: string | null;
  noHp: string | null;
}

const ALLOWED_LAMPIRAN_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_LAMPIRAN_SIZE = 10 * 1024 * 1024;
const MAX_LAMPIRAN_COUNT = 5;

export function SanggahanForm({
  projects,
  bidangOptions,
  dokumenOptions,
  pengumumanOptions,
  defaultProjectId,
  defaultBidangId,
  defaultDokumenId,
  defaultPengumumanId,
  masaSanggahDitutup,
  warga,
}: {
  projects: ProjectOption[];
  bidangOptions: BidangOption[];
  dokumenOptions: DokumenOption[];
  pengumumanOptions: PengumumanOption[];
  defaultProjectId?: string;
  defaultBidangId?: string;
  defaultDokumenId?: string;
  defaultPengumumanId?: string;
  masaSanggahDitutup: boolean;
  warga: WargaPrefill;
}) {
  const router = useRouter();
  const { dict } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [buktiRows, setBuktiRows] = useState<BuktiTambahanRow[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [anonim, setAnonim] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SanggahanFormValues>({
    resolver: zodResolver(sanggahanFormSchema),
    defaultValues: {
      projectId: defaultProjectId ?? "",
      bidangId: defaultBidangId ?? "",
      dokumenId: defaultDokumenId ?? "",
      pengumumanId: defaultPengumumanId ?? "",
      nama: warga.nama,
      nik: warga.nik ?? "",
      kontakEmail: warga.email,
      kontakHp: warga.noHp ?? "",
      pernyataanBenar: false,
    },
  });

  const selectedProjectId = watch("projectId");
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );
  const masaSanggahSelesai = selectedProject?.masaSanggahSelesai
    ? new Date(selectedProject.masaSanggahSelesai)
    : null;
  const projekTertutup = Boolean(masaSanggahSelesai && masaSanggahSelesai.getTime() < Date.now());

  const filteredBidangOptions = useMemo(
    () => bidangOptions.filter((b) => b.projectId === selectedProjectId),
    [bidangOptions, selectedProjectId]
  );
  const filteredDokumenOptions = useMemo(
    () => dokumenOptions.filter((d) => d.projectId === selectedProjectId),
    [dokumenOptions, selectedProjectId]
  );
  const filteredPengumumanOptions = useMemo(
    () => pengumumanOptions.filter((p) => p.projectId === selectedProjectId),
    [pengumumanOptions, selectedProjectId]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selected.length === 0) return;
    setFileError(null);

    const next = [...files];
    for (const f of selected) {
      if (next.length >= MAX_LAMPIRAN_COUNT) {
        setFileError(`Maksimal ${MAX_LAMPIRAN_COUNT} file bukti`);
        break;
      }
      if (!ALLOWED_LAMPIRAN_TYPES.includes(f.type)) {
        setFileError("Format file harus PDF, JPG, PNG, atau WEBP");
        continue;
      }
      if (f.size > MAX_LAMPIRAN_SIZE) {
        setFileError("Ukuran file maksimal 10MB");
        continue;
      }
      next.push(f);
    }
    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function addBuktiRow() {
    setBuktiRows((prev) => [...prev, { jenisBukti: "", keterangan: "" }]);
  }

  function updateBuktiRow(index: number, patch: Partial<BuktiTambahanRow>) {
    setBuktiRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeBuktiRow(index: number) {
    setBuktiRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: SanggahanFormValues) {
    if (projekTertutup) {
      setServerError("Masa sanggah untuk proyek ini telah berakhir.");
      return;
    }
    setServerError(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      for (const f of files) formData.append("lampiran", f);
      const validBuktiRows = buktiRows.filter((r) => r.jenisBukti.trim());
      if (validBuktiRows.length > 0) {
        formData.append("buktiTambahan", JSON.stringify(validBuktiRows));
      }
      formData.append("anonim", String(anonim));

      const res = await fetch("/api/sanggahan", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Gagal mengirim sanggahan. Silakan coba lagi.");
        setSubmitting(false);
        return;
      }

      router.push(
        `/sanggahan/sukses?tiket=${encodeURIComponent(data.nomorTiket)}&nik=${encodeURIComponent(values.nik)}`
      );
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

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

      <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
        <legend className="px-1 text-sm font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          {dict.sanggahanForm.sectionIdentitas}
        </legend>

        <div className="space-y-1.5">
          <Label htmlFor="projectId">{dict.sanggahanForm.proyekTerkait}</Label>
          <select
            id="projectId"
            {...register("projectId")}
            aria-invalid={!!errors.projectId}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">{dict.sanggahanForm.pilihProyek}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.namaProyek}
              </option>
            ))}
          </select>
          {errors.projectId && <p className="text-xs text-red-600 dark:text-red-400">{errors.projectId.message}</p>}
          {projekTertutup && masaSanggahSelesai && (
            <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Masa sanggah untuk proyek ini telah berakhir pada{" "}
                {masaSanggahSelesai.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}{" "}
                (14 hari sejak tanggal pengumuman). Silakan pilih proyek lain yang masa sanggahnya masih berjalan.
              </p>
            </div>
          )}
        </div>

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
              disabled={!selectedProjectId}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800"
            >
              <option value="">
                {selectedProjectId ? dict.sanggahanForm.pilihBidang : dict.sanggahanForm.pilihProyekDulu}
              </option>
              {filteredBidangOptions.map((b) => (
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
              disabled={!selectedProjectId}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:disabled:bg-zinc-800"
            >
              <option value="">
                {selectedProjectId ? dict.sanggahanForm.pilihDokumen : dict.sanggahanForm.pilihProyekDulu}
              </option>
              {filteredDokumenOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.judul}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProjectId && filteredPengumumanOptions.length > 0 && (
          <div className="space-y-1.5">
            <Label htmlFor="pengumumanId">{dict.sanggahanForm.pengumumanTerkaitOpsional}</Label>
            <select
              id="pengumumanId"
              {...register("pengumumanId")}
              className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="">{dict.sanggahanForm.pilihPengumuman}</option>
              {filteredPengumumanOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.judul}
                </option>
              ))}
            </select>
          </div>
        )}

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
        <p className="-mt-2 text-xs text-zinc-500 dark:text-zinc-400">{dict.sanggahanForm.isiSalahSatu}</p>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
        <legend className="px-1 text-sm font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          {dict.sanggahanForm.sectionPernyataan}
        </legend>
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
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
        <legend className="px-1 text-sm font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          {dict.sanggahanForm.sectionBukti}
        </legend>

        <div className="space-y-1.5">
          <Label htmlFor="lampiran">{dict.sanggahanForm.lampiran}</Label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sanggahanForm.lampiranDesc}</p>
          <input
            id="lampiran"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300 dark:file:bg-emerald-950 dark:file:text-emerald-400 dark:hover:file:bg-emerald-900"
          />
          {fileError && <p className="text-xs text-red-600 dark:text-red-400">{fileError}</p>}
          {files.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-zinc-700 dark:text-zinc-300">
                    <Paperclip className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                    aria-label={dict.sanggahanForm.hapus}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <Label>{dict.sanggahanForm.tabelBuktiTitle}</Label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{dict.sanggahanForm.tabelBuktiDesc}</p>

          {buktiRows.length > 0 && (
            <div className="space-y-2">
              {buktiRows.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-md border border-zinc-200 p-2.5 sm:flex-row sm:items-start dark:border-zinc-800">
                  <Input
                    value={row.jenisBukti}
                    onChange={(e) => updateBuktiRow(i, { jenisBukti: e.target.value })}
                    placeholder={dict.sanggahanForm.tabelBuktiJenisPlaceholder}
                    aria-label={dict.sanggahanForm.tabelBuktiJenis}
                    className="sm:w-1/3"
                  />
                  <Input
                    value={row.keterangan ?? ""}
                    onChange={(e) => updateBuktiRow(i, { keterangan: e.target.value })}
                    placeholder={dict.sanggahanForm.tabelBuktiKeteranganPlaceholder}
                    aria-label={dict.sanggahanForm.tabelBuktiKeterangan}
                    className="sm:flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeBuktiRow(i)}
                    className="shrink-0 self-start rounded-md p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                    aria-label={dict.sanggahanForm.hapus}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button type="button" variant="outline" size="sm" onClick={addBuktiRow}>
            {dict.sanggahanForm.tambahBarisBukti}
          </Button>
        </div>
      </fieldset>

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

      <Button type="submit" disabled={submitting || projekTertutup} size="lg" className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {dict.sanggahanForm.kirim}
      </Button>
    </form>
  );
}
