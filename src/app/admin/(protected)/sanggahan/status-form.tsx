"use client";

import { useActionState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { useActionToast } from "@/hooks/use-action-toast";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import { updateSanggahanStatus } from "./actions";

type ActionState = { error?: string; success?: boolean };

export function StatusForm({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prevState, formData) => updateSanggahanStatus(id, formData),
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state, "Data telah diedit");

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="status">Ubah Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-zinc-900 dark:border-zinc-700"
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

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode="edit"
        label="Simpan Perubahan"
        confirmDescription="Apakah Anda yakin ingin mengubah status sanggahan ini?"
      />
    </form>
  );
}
