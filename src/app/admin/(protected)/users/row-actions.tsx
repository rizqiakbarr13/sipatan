"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteUser } from "./actions";

export function UserRowActions({ id }: { id: string }) {
  return (
    <ConfirmDeleteButton
      onDelete={async () => {
        const result = await deleteUser(id);
        if (result?.error) alert(result.error);
      }}
    />
  );
}
