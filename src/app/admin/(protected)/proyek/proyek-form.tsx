"use client";

import { useActionState } from "react";
import { updateProyek } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import type { Project } from "@prisma/client";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

type ActionState = { error?: string; success?: boolean };

export function ProyekForm({ project }: { project: Project }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prevState, formData) => updateProyek(formData),
    {}
  );

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="id" value={project.id} />

      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Perubahan berhasil disimpan.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="namaProyek">Nama Proyek</Label>
          <Input id="namaProyek" name="namaProyek" defaultValue={project.namaProyek} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nomorPeng">Nomor Pengumuman</Label>
          <Input id="nomorPeng" name="nomorPeng" defaultValue={project.nomorPeng} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tanggalPeng">Tanggal Pengumuman</Label>
          <Input
            id="tanggalPeng"
            name="tanggalPeng"
            type="date"
            defaultValue={toDateInputValue(project.tanggalPeng)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kelurahan">Kelurahan</Label>
          <Input id="kelurahan" name="kelurahan" defaultValue={project.kelurahan} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kecamatan">Kecamatan</Label>
          <Input id="kecamatan" name="kecamatan" defaultValue={project.kecamatan} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kota">Kota</Label>
          <Input id="kota" name="kota" defaultValue={project.kota} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="provinsi">Provinsi</Label>
          <Input id="provinsi" name="provinsi" defaultValue={project.provinsi} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="masaSanggahMulai">Masa Sanggah Mulai</Label>
          <Input
            id="masaSanggahMulai"
            name="masaSanggahMulai"
            type="date"
            defaultValue={toDateInputValue(project.masaSanggahMulai)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="masaSanggahSelesai">Masa Sanggah Selesai</Label>
          <Input
            id="masaSanggahSelesai"
            name="masaSanggahSelesai"
            type="date"
            defaultValue={toDateInputValue(project.masaSanggahSelesai)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            defaultValue={project.deskripsi ?? ""}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        Simpan Perubahan
      </Button>
    </form>
  );
}
