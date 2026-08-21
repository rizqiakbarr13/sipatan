"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  return (
    <form action={formAction} className="max-w-md space-y-4">
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
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">
          {user ? "Reset Password (opsional, kosongkan jika tidak diubah)" : "Password"}
        </Label>
        <Input id="password" name="password" type="password" required={!user} minLength={8} />
      </div>

      <Button type="submit" disabled={pending}>Simpan</Button>
    </form>
  );
}
