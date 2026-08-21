"use client";

import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { togglePublishPengumuman, deletePengumuman } from "./actions";

export function PengumumanRowActions({ id, published }: { id: string; published: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <ToggleSwitch
        checked={published}
        onToggle={(next) => togglePublishPengumuman(id, next)}
        label="Toggle publish"
      />
      <ConfirmDeleteButton onDelete={() => deletePengumuman(id)} />
    </div>
  );
}
