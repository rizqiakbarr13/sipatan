"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerWarga } from "@/app/(public)/akun/actions";
import { useLocale } from "@/lib/i18n/client";

type ActionState = { error?: string };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(registerWarga, {});
  const { dict } = useLocale();

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="nama">{dict.auth.namaLengkap}</Label>
        <Input id="nama" name="nama" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{dict.auth.email}</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="nik">{dict.auth.nikOpsional}</Label>
          <Input id="nik" name="nik" inputMode="numeric" maxLength={16} placeholder="16 digit" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noHp">{dict.auth.noHpOpsional}</Label>
          <Input id="noHp" name="noHp" placeholder="081234567890" />
        </div>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{dict.auth.catatanNikHp}</p>
      <div className="space-y-1.5">
        <Label htmlFor="password">{dict.auth.password}</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="konfirmasiPassword">{dict.auth.konfirmasiPassword}</Label>
        <Input
          id="konfirmasiPassword"
          name="konfirmasiPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {dict.auth.tombolDaftar}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {dict.auth.sudahPunyaAkun}{" "}
        <Link href="/akun/masuk" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          {dict.auth.masukDiSini}
        </Link>
      </p>
    </form>
  );
}
