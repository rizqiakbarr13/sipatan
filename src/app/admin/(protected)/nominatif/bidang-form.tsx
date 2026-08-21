"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import type { Bidang } from "@prisma/client";

type ActionState = { error?: string };

export function BidangForm({
  bidang,
  action,
}: {
  bidang?: Bidang;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-4xl space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Pihak yang Berhak</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="No. Urut" name="noUrut" type="number" defaultValue={bidang?.noUrut} required />
          <Field label="No. Peta Bidang" name="noPetaBidang" defaultValue={bidang?.noPetaBidang} />
          <Field label="Nama Pemilik" name="namaPemilik" defaultValue={bidang?.namaPemilik} required className="sm:col-span-2" />
          <Field label="NIK" name="nik" defaultValue={bidang?.nik} />
          <Field label="Tanggal Lahir" name="tanggalLahir" defaultValue={bidang?.tanggalLahir} />
          <Field label="Pekerjaan" name="pekerjaan" defaultValue={bidang?.pekerjaan} />
          <div className="space-y-1.5 sm:col-span-3">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea id="alamat" name="alamat" rows={2} defaultValue={bidang?.alamat ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Data Tanah</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="NIB" name="nib" defaultValue={bidang?.nib} />
          <Field label="RT/RW" name="rtRw" defaultValue={bidang?.rtRw} />
          <Field label="No. Danom" name="danomNo" defaultValue={bidang?.danomNo} />
          <Field label="Surat Tanda Bukti" name="suratTandaBukti" defaultValue={bidang?.suratTandaBukti} />
          <Field label="Luas Sesuai Alas Hak (m²)" name="luasSesuaiAlasHak" type="number" step="0.01" defaultValue={bidang?.luasSesuaiAlasHak ?? undefined} />
          <Field label="Luas Hasil Ukur (m²)" name="luasHasilUkur" type="number" step="0.01" defaultValue={bidang?.luasHasilUkur ?? undefined} />
          <Field label="NIS Terkena" name="nisTerkena" defaultValue={bidang?.nisTerkena} />
          <Field label="Luas Terkena (m²)" name="luasKena" type="number" step="0.01" defaultValue={bidang?.luasKena ?? undefined} />
          <Field label="NIS Sisa" name="nisSisa" defaultValue={bidang?.nisSisa} />
          <Field label="Luas Sisa (m²)" name="luasSisa" type="number" step="0.01" defaultValue={bidang?.luasSisa ?? undefined} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Ringkasan &amp; Keterangan</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bangunanRingkas">Ringkasan Bangunan</Label>
            <Textarea id="bangunanRingkas" name="bangunanRingkas" rows={2} defaultValue={bidang?.bangunanRingkas ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tanamanRingkas">Ringkasan Tanaman</Label>
            <Textarea id="tanamanRingkas" name="tanamanRingkas" rows={2} defaultValue={bidang?.tanamanRingkas ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea id="keterangan" name="keterangan" rows={2} defaultValue={bidang?.keterangan ?? ""} />
          </div>
        </div>
      </section>

      <Button type="submit" disabled={pending}>Simpan</Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  defaultValue,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        required={required}
      />
    </div>
  );
}
