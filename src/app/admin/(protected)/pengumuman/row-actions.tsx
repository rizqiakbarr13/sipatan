"use client";

import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { togglePublishPengumuman, toggleSanggahanDibukaPengumuman, deletePengumuman } from "./actions";

export function PengumumanRowActions({
  id,
  published,
  sanggahanDibuka,
}: {
  id: string;
  published: boolean;
  sanggahanDibuka: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <ToggleSwitch checked={published} onToggle={(next) => togglePublishPengumuman(id, next)} label="Toggle publish" />
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Publish</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <ToggleSwitch
          checked={sanggahanDibuka}
          onToggle={(next) => toggleSanggahanDibukaPengumuman(id, next)}
          label="Toggle kanal sanggahan"
        />
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Sanggahan</span>
      </div>
      <ConfirmDeleteButton onDelete={() => deletePengumuman(id)} />
    </div>
  );
}
