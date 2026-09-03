"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteProyek } from "./actions";

export function ProyekRowActions({ id }: { id: string }) {
  return (
    <ConfirmDeleteButton
      onDelete={() => deleteProyek(id)}
      confirmText="Proyek hanya bisa dihapus jika belum memiliki bidang, dokumen, pengumuman, atau sanggahan terkait."
    />
  );
}
