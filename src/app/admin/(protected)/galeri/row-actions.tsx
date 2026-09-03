"use client";

import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { toggleGaleriFotoPublish, deleteGaleriFoto } from "./actions";

export function GaleriRowActions({ id, published }: { id: string; published: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <ToggleSwitch checked={published} onToggle={(next) => toggleGaleriFotoPublish(id, next)} label="Toggle publish" />
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Publish</span>
      </div>
      <ConfirmDeleteButton onDelete={() => deleteGaleriFoto(id)} confirmText="Yakin ingin menghapus foto ini?" />
    </div>
  );
}
