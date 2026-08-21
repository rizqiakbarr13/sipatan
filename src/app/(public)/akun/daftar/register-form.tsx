"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerWarga } from "@/app/(public)/akun/actions";

type ActionState = { error?: string };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(registerWarga, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama Lengkap</Label>
        <Input id="nama" name="nama" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="nik">NIK (opsional)</Label>
          <Input id="nik" name="nik" inputMode="numeric" maxLength={16} placeholder="16 digit" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="noHp">No. HP (opsional)</Label>
          <Input id="noHp" name="noHp" placeholder="081234567890" />
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        NIK/No. HP hanya dipakai untuk mengisi otomatis form sanggahan Anda nanti.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="konfirmasiPassword">Konfirmasi Kata Sandi</Label>
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
        Daftar
      </Button>

      <p className="text-center text-sm text-zinc-600">
        Sudah punya akun?{" "}
        <Link href="/akun/masuk" className="font-medium text-emerald-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
