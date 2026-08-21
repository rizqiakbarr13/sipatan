"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import { updateSanggahanStatus } from "./actions";

type ActionState = { error?: string; success?: boolean };

export function StatusForm({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prevState, formData) => updateSanggahanStatus(id, formData),
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Status berhasil diperbarui.
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="status">Ubah Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {Object.entries(SANGGAHAN_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="catatan">Catatan / Tanggapan Admin</Label>
        <Textarea id="catatan" name="catatan" rows={4} placeholder="Tanggapan untuk pemohon..." />
      </div>

      <Button type="submit" disabled={pending}>Simpan Perubahan</Button>
    </form>
  );
}
