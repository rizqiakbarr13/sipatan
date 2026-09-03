"use client";

import Image from "next/image";
import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert } from "lucide-react";
import type { GaleriFoto } from "@prisma/client";

type ActionState = { error?: string };

export function GaleriForm({
  foto,
  action,
}: {
  foto?: GaleriFoto;
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
        <Label htmlFor="judul">Caption / Judul Foto</Label>
        <Input id="judul" name="judul" defaultValue={foto?.judul} placeholder="mis. Pengukuran Bidang Tanah Terdampak" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file">{foto ? "Ganti Foto (opsional)" : "Foto"} — JPG/PNG/WEBP, maks. 10MB</Label>
        <div className="rounded-lg border-2 border-dashed border-zinc-300 p-4 text-center dark:border-zinc-700">
          <input
            id="file"
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            required={!foto}
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300"
          />
          {foto && (
            <div className="mt-3 flex justify-center">
              <Image
                src={foto.fileUrl}
                alt={foto.judul}
                width={240}
                height={160}
                className="h-32 w-auto rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={foto ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan foto ini?"
      />
    </form>
  );
}
