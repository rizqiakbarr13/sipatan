"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteSanggahan } from "./actions";

export function SanggahanRowActions({ id, nomorTiket }: { id: string; nomorTiket: string }) {
  return (
    <ConfirmDeleteButton
      onDelete={() => deleteSanggahan(id)}
      confirmText={`Sanggahan ${nomorTiket} beserta seluruh lampiran, bukti tambahan, dan riwayat statusnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
    />
  );
}
