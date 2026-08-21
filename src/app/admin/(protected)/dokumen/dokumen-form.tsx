"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TriangleAlert, UploadCloud } from "lucide-react";
import { KATEGORI_DOKUMEN_LABEL } from "@/lib/labels";
import type { DokumenPublikasi } from "@prisma/client";

type ActionState = { error?: string };

export function DokumenForm({
  dokumen,
  action,
}: {
  dokumen?: DokumenPublikasi;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4" encType="multipart/form-data">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="judul">Judul</Label>
        <Input id="judul" name="judul" defaultValue={dokumen?.judul} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="kategori">Kategori</Label>
          <select
            id="kategori"
            name="kategori"
            defaultValue={dokumen?.kategori ?? "DAFTAR_NOMINATIF"}
            className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            {Object.entries(KATEGORI_DOKUMEN_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nomorSurat">Nomor Surat</Label>
          <Input id="nomorSurat" name="nomorSurat" defaultValue={dokumen?.nomorSurat ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tanggalDokumen">Tanggal Dokumen</Label>
          <Input
            id="tanggalDokumen"
            name="tanggalDokumen"
            type="date"
            defaultValue={dokumen?.tanggalDokumen ? dokumen.tanggalDokumen.toISOString().slice(0, 10) : ""}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={dokumen?.deskripsi ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file">
          {dokumen ? "Ganti File (opsional)" : "File Dokumen"} — PDF/JPG/PNG, maks. 5MB
        </Label>
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-4 text-center">
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            required={!dokumen}
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {dokumen && (
            <p className="mt-2 flex items-center justify-center gap-1 text-xs text-zinc-500">
              <UploadCloud className="h-3.5 w-3.5" /> File saat ini: {dokumen.fileName}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={pending}>Simpan</Button>
    </form>
  );
}
