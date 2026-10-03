"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPasswordAdminWithToken } from "./actions";

type ActionState = { error?: string; success?: boolean };

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPasswordAdminWithToken,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/sipatan-logo.png" alt="SIPATAN" width={160} height={160} className="h-20 w-auto object-contain" />
          <h1 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">Atur Ulang Password</h1>
        </div>

        {!token ? (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Tautan reset password tidak valid atau tidak lengkap.
          </div>
        ) : state.success ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Password berhasil diubah. Silakan masuk dengan password baru Anda.</p>
            </div>
            <Link
              href="/admin/login"
              className="flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-b from-emerald-600 to-emerald-700 text-sm font-medium text-white shadow-sm hover:from-emerald-600 hover:to-emerald-800"
            >
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            {state.error && (
              <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
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
        )}
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
