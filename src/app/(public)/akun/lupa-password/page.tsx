import { KeyRound } from "lucide-react";
import { RequestResetForm } from "./request-form";

export const metadata = {
  title: "Lupa Password",
};

export default function LupaPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <KeyRound className="h-6 w-6" />
          </span>
          <h1 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">Lupa Password</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Masukkan email akun Anda, kami akan mengirimkan tautan untuk mengatur ulang password.
          </p>
        </div>
        <RequestResetForm />
      </div>
    </div>
  );
}
