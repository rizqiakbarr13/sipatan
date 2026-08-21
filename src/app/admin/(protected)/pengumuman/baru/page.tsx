import { PengumumanForm } from "../pengumuman-form";
import { createPengumuman } from "../actions";

export default function PengumumanBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Tambah Pengumuman</h1>
      <PengumumanForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createPengumuman(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
