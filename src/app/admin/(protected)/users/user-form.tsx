"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { SaveButton } from "@/components/save-button";
import { TriangleAlert } from "lucide-react";
import type { User } from "@prisma/client";

type ActionState = { error?: string };

export function UserForm({
  user,
  action,
}: {
  user?: User;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="max-w-md space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama</Label>
        <Input id="nama" name="nama" defaultValue={user?.nama} required />
      </div>

      {!user && (
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue={user?.role ?? "ADMIN"}
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-zinc-900 dark:border-zinc-700"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">
          {user ? "Reset Password (opsional, kosongkan jika tidak diubah)" : "Password"}
        </Label>
        <PasswordInput id="password" name="password" required={!user} minLength={8} />
      </div>

      <SaveButton
        formRef={formRef}
        pending={pending}
        mode={user ? "edit" : "create"}
        confirmDescription="Apakah Anda yakin ingin menyimpan perubahan akun user ini?"
      />
    </form>
  );
}
