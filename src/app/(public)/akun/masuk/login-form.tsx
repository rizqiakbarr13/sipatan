"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginWarga } from "@/app/(public)/akun/actions";
import { useLocale } from "@/lib/i18n/client";

type ActionState = { error?: string };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginWarga, {});
  const { dict } = useLocale();

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">{dict.auth.email}</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{dict.auth.password}</Label>
          <Link
            href="/akun/lupa-password"
            className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Lupa password?
          </Link>
        </div>
        <PasswordInput id="password" name="password" required autoComplete="current-password" />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {dict.auth.tombolMasuk}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {dict.auth.belumPunyaAkun}{" "}
        <Link
          href={next ? `/akun/daftar?next=${encodeURIComponent(next)}` : "/akun/daftar"}
          className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          {dict.auth.daftarDiSini}
        </Link>
      </p>
    </form>
  );
}
