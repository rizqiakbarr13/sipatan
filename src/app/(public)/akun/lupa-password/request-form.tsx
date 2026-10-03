"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestResetPasswordWarga } from "@/app/(public)/akun/actions";

type ActionState = { error?: string; success?: boolean };

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestResetPasswordWarga,
    {}
  );

  if (state.success) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Jika email tersebut terdaftar, kami telah mengirimkan tautan untuk mengatur ulang password.
          Periksa kotak masuk (dan folder spam) Anda.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        Kirim Tautan Reset
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        <Link href="/akun/masuk" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          Kembali ke halaman masuk
        </Link>
      </p>
    </form>
  );
}
