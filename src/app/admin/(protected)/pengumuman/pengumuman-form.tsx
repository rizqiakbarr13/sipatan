"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import type { Pengumuman } from "@prisma/client";

type ActionState = { error?: string };

export function PengumumanForm({
  pengumuman,
  action,
}: {
  pengumuman?: Pengumuman;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
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
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={pengumuman?.published ?? true}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-700"
        />
        <Label htmlFor="published" className="font-normal">Publikasikan</Label>
      </div>

      <Button type="submit" disabled={pending}>Simpan</Button>
    </form>
  );
}
