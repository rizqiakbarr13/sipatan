import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import { getWargaSession } from "@/lib/warga-session";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Daftar Akun Warga",
};

export default async function DaftarPage() {
  const session = await getWargaSession();
  if (session) redirect("/akun");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <UserPlus className="h-6 w-6" />
          </span>
          <h1 className="mt-3 font-semibold text-zinc-900">Daftar Akun Warga</h1>
          <p className="text-sm text-zinc-500">
            Ajukan sanggahan lebih cepat dan pantau riwayatnya di satu tempat.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
