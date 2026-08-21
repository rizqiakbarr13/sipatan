"use client";

import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { togglePublishSop, deleteSop } from "./actions";

export function SopRowActions({ id, published }: { id: string; published: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <ToggleSwitch checked={published} onToggle={(next) => togglePublishSop(id, next)} label="Toggle publish" />
      <ConfirmDeleteButton onDelete={() => deleteSop(id)} />
    </div>
  );
}
