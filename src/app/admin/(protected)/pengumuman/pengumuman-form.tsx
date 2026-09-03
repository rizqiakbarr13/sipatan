"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert } from "lucide-react";
import type { Pengumuman } from "@prisma/client";

type ActionState = { error?: string };

export function PengumumanForm({
  pengumuman,
  dokumenList,
  projectList,
  action,
}: {
  pengumuman?: Pengumuman;
  dokumenList: { id: string; judul: string }[];
  projectList: { id: string; namaProyek: string }[];
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="max-w-2xl space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="judul">Judul</Label>
        <Input id="judul" name="judul" defaultValue={pengumuman?.judul} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="konten">Konten</Label>
        <Textarea id="konten" name="konten" rows={8} defaultValue={pengumuman?.konten} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lampiranUrl">URL Lampiran (opsional)</Label>
        <Input id="lampiranUrl" name="lampiranUrl" defaultValue={pengumuman?.lampiranUrl ?? ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tanggalTerbit">Tanggal Terbit</Label>
        <Input
          id="tanggalTerbit"
          name="tanggalTerbit"
          type="date"
          defaultValue={
            pengumuman ? pengumuman.tanggalTerbit.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
          }
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="projectId">Proyek Terkait</Label>
        <select
          id="projectId"
          name="projectId"
          defaultValue={pengumuman?.projectId ?? ""}
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">Umum / Tidak terkait proyek tertentu</option>
          {projectList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.namaProyek}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dokumenTerkaitId">Dokumen Terkait (opsional)</Label>
        <select
          id="dokumenTerkaitId"
          name="dokumenTerkaitId"
          defaultValue={pengumuman?.dokumenTerkaitId ?? ""}
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">Tidak ada</option>
          {dokumenList.map((d) => (
            <option key={d.id} value={d.id}>
              {d.judul}
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Pengumuman ini akan menampilkan tautan langsung ke dokumen yang dipilih.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="linkDataNominatif"
          name="linkDataNominatif"
          type="checkbox"
          defaultChecked={pengumuman?.linkDataNominatif ?? false}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-700 dark:border-zinc-700"
        />
        <Label htmlFor="linkDataNominatif" className="font-normal">
          Kaitkan dengan halaman Data Nominatif
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={pengumuman?.published ?? true}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-700 dark:border-zinc-700"
        />
        <Label htmlFor="published" className="font-normal">Publikasikan</Label>
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={pengumuman ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan pengumuman ini?"
      />
    </form>
  );
}
