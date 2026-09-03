"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert } from "lucide-react";
import type { SOPDoc } from "@prisma/client";

type ActionState = { error?: string };

export function SopForm({
  sop,
  action,
}: {
  sop?: SOPDoc;
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="judul">Judul</Label>
          <Input id="judul" name="judul" defaultValue={sop?.judul} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={sop?.slug} placeholder="mis. masa-sanggah" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="urutan">Urutan</Label>
          <Input id="urutan" name="urutan" type="number" defaultValue={sop?.urutan ?? 0} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fileUrl">URL Lampiran PDF (opsional)</Label>
          <Input id="fileUrl" name="fileUrl" defaultValue={sop?.fileUrl ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="konten">Konten (Markdown)</Label>
        <Textarea id="konten" name="konten" rows={12} className="font-mono text-xs" defaultValue={sop?.konten} required />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={sop?.published ?? true}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-700 dark:border-zinc-700"
        />
        <Label htmlFor="published" className="font-normal">Publikasikan</Label>
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={sop ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan SOP ini?"
      />
    </form>
  );
}
