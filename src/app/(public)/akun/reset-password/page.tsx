import Link from "next/link";
import { KeyRound, TriangleAlert } from "lucide-react";
import { ResetPasswordForm } from "./reset-form";

export const metadata = {
  title: "Atur Ulang Password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <KeyRound className="h-6 w-6" />
          </span>
          <h1 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">Atur Ulang Password</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Buat password baru untuk akun Anda.
          </p>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Tautan reset password tidak valid atau tidak lengkap.</p>
            </div>
            <Link
              href="/akun/lupa-password"
              className="block text-center text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Minta tautan baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
