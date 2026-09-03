import { ProyekForm } from "../proyek-form";
import { createProyek } from "../actions";

export default function ProyekBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Tambah Proyek</h1>
      <ProyekForm
        action={async (_prevState, formData) => {
          "use server";
          return createProyek(formData);
        }}
      />
    </div>
  );
}
