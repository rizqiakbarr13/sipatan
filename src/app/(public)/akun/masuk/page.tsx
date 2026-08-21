import { redirect } from "next/navigation";
import { UserCircle } from "lucide-react";
import { getWargaSession } from "@/lib/warga-session";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Masuk Akun Warga",
};

export default async function MasukPage() {
  const session = await getWargaSession();
  if (session) redirect("/akun");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <UserCircle className="h-6 w-6" />
          </span>
          <h1 className="mt-3 font-semibold text-zinc-900">Masuk Akun Warga</h1>
          <p className="text-sm text-zinc-500">
            Untuk mengajukan sanggahan dengan data otomatis terisi dan melihat riwayat.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
