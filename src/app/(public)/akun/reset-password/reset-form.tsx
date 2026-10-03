"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPasswordWargaWithToken } from "@/app/(public)/akun/actions";

type ActionState = { error?: string; success?: boolean };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPasswordWargaWithToken,
    {}
  );

  if (state.success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Password berhasil diubah. Silakan masuk dengan password baru Anda.</p>
        </div>
        <Link
          href="/akun/masuk"
          className="flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-b from-emerald-600 to-emerald-700 text-sm font-medium text-white shadow-sm transition-all hover:from-emerald-600 hover:to-emerald-800"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="password">Password Baru</Label>
        <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="konfirmasiPassword">Konfirmasi Password Baru</Label>
        <PasswordInput
          id="konfirmasiPassword"
          name="konfirmasiPassword"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        Simpan Password Baru
      </Button>
    </form>
  );
}
