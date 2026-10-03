"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestResetPasswordAdmin } from "./actions";

type ActionState = { error?: string; success?: boolean };

export default function AdminLupaPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestResetPasswordAdmin,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/sipatan-logo.png" alt="SIPATAN" width={160} height={160} className="h-20 w-auto object-contain" />
          <h1 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">Lupa Password Admin</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Masukkan email akun admin Anda untuk menerima tautan reset password.
          </p>
        </div>

        {state.success ? (
          <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Jika email tersebut terdaftar, tautan reset password telah dikirim. Periksa kotak masuk Anda.</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
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
          </form>
        )}

        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/admin/login" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
            Kembali ke halaman login
          </Link>
        </p>
      </div>
    </div>
  );
}
