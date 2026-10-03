"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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

function addDaysToDateInput(value: string, days: number): string {
  const base = value ? new Date(`${value}T00:00:00`) : new Date();
  if (Number.isNaN(base.getTime())) return value;
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

function defaultSelesaiFromTanggalPeng(tanggalPeng: string): string {
  if (!tanggalPeng) return "";
  return addDaysToDateInput(tanggalPeng, MASA_SANGGAH_HARI_KALENDER);
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
  const [masaSanggahSelesai, setMasaSanggahSelesai] = useState(
    project
      ? toDateInputValue(project.masaSanggahSelesai) || defaultSelesaiFromTanggalPeng(tanggalPeng)
      : defaultSelesaiFromTanggalPeng(tanggalPeng)
  );

  function handleTanggalPengChange(value: string) {
    setTanggalPeng(value);
    // Pada proyek baru, ikuti perubahan tanggal pengumuman selama admin belum
    // mengubah tanggal akhir masa sanggah secara manual. Pada proyek yang
    // sudah ada, tanggal akhir tidak diikutkan otomatis — supaya perpanjangan
    // yang sudah diset admin sebelumnya tidak tertimpa tanpa sengaja.
    if (!project) setMasaSanggahSelesai(defaultSelesaiFromTanggalPeng(value));
  }

  const masaSanggahSudahLewat =
    masaSanggahSelesai && new Date(`${masaSanggahSelesai}T23:59:59`).getTime() < Date.now();

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
            onChange={(e) => handleTanggalPengChange(e.target.value)}
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

      <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex items-start gap-2.5 text-sm text-emerald-900 dark:text-emerald-200">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Masa Sanggah</p>
            <p className="mt-0.5 text-emerald-800/80 dark:text-emerald-300/80">
              Default {MASA_SANGGAH_HARI_KALENDER} hari kalender sejak tanggal pengumuman. Tanggal akhir di bawah
              bisa diubah langsung untuk menambah atau memperpanjang masa sanggah proyek ini.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Masa Sanggah Mulai</Label>
            <p className="flex h-10 items-center rounded-md border border-emerald-200 bg-white px-3 text-sm text-zinc-700 dark:border-emerald-900 dark:bg-zinc-900 dark:text-zinc-300">
              {tanggalPeng ? formatTanggalPreview(tanggalPeng) : "-"}
            </p>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-300/60">Ikut tanggal pengumuman.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="masaSanggahSelesai">Masa Sanggah Berakhir</Label>
            <Input
              id="masaSanggahSelesai"
              name="masaSanggahSelesai"
              type="date"
              value={masaSanggahSelesai}
              onChange={(e) => setMasaSanggahSelesai(e.target.value)}
              min={tanggalPeng || undefined}
              required
            />
            <p className={cn("text-xs", masaSanggahSudahLewat ? "text-red-600 dark:text-red-400" : "text-emerald-800/70 dark:text-emerald-300/60")}>
              {masaSanggahSelesai
                ? masaSanggahSudahLewat
                  ? `Sudah lewat (${formatTanggalPreview(masaSanggahSelesai)}) — kanal sanggahan tertutup otomatis.`
                  : `Terbuka sampai ${formatTanggalPreview(masaSanggahSelesai)}.`
                : "Isi tanggal akhir masa sanggah."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-emerald-800/70 dark:text-emerald-300/60">Perpanjang cepat:</span>
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setMasaSanggahSelesai((prev) => addDaysToDateInput(prev || tanggalPeng, days))}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 px-2.5 text-xs")}
            >
              +{days} hari
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMasaSanggahSelesai(defaultSelesaiFromTanggalPeng(tanggalPeng))}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 px-2.5 text-xs")}
          >
            Reset ke default ({MASA_SANGGAH_HARI_KALENDER} hari)
          </button>
        </div>
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={project ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan proyek ini?"
      />
    </form>
  );
}
