"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert, CalendarClock } from "lucide-react";
import type { Project } from "@prisma/client";

type ActionState = { error?: string; success?: boolean };

const MASA_SANGGAH_HARI_KALENDER = 14;

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function formatTanggalPreview(value: string): string {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function ProyekForm({
  project,
  action,
}: {
  project?: Project;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [tanggalPeng, setTanggalPeng] = useState(toDateInputValue(project?.tanggalPeng));

  const selesaiPreview = (() => {
    if (!tanggalPeng) return null;
    const start = new Date(`${tanggalPeng}T00:00:00`);
    if (Number.isNaN(start.getTime())) return null;
    start.setDate(start.getDate() + MASA_SANGGAH_HARI_KALENDER);
    return start.toISOString().slice(0, 10);
  })();

  return (
    <form ref={formRef} action={formAction} className="max-w-3xl space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="namaProyek">Nama Proyek</Label>
          <Input id="namaProyek" name="namaProyek" defaultValue={project?.namaProyek} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nomorPeng">Nomor Pengumuman</Label>
          <Input id="nomorPeng" name="nomorPeng" defaultValue={project?.nomorPeng} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tanggalPeng">Tanggal Pengumuman</Label>
          <Input
            id="tanggalPeng"
            name="tanggalPeng"
            type="date"
            value={tanggalPeng}
            onChange={(e) => setTanggalPeng(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kelurahan">Kelurahan</Label>
          <Input id="kelurahan" name="kelurahan" defaultValue={project?.kelurahan} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kecamatan">Kecamatan</Label>
          <Input id="kecamatan" name="kecamatan" defaultValue={project?.kecamatan} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kota">Kota</Label>
          <Input id="kota" name="kota" defaultValue={project?.kota} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="provinsi">Provinsi</Label>
          <Input id="provinsi" name="provinsi" defaultValue={project?.provinsi} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={project?.deskripsi ?? ""} />
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">
            Masa sanggah dihitung otomatis: {MASA_SANGGAH_HARI_KALENDER} hari kalender sejak tanggal pengumuman.
          </p>
          <p className="mt-0.5 text-emerald-800/80 dark:text-emerald-300/80">
            {tanggalPeng
              ? `${formatTanggalPreview(tanggalPeng)} — ${formatTanggalPreview(selesaiPreview ?? "")}`
              : "Isi tanggal pengumuman untuk melihat perkiraan rentang masa sanggah."}
          </p>
        </div>
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={project ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan proyek ini? Masa sanggah akan dihitung ulang dari tanggal pengumuman."
      />
    </form>
  );
}
