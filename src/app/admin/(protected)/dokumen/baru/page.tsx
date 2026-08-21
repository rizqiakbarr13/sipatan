import { DokumenForm } from "../dokumen-form";
import { createDokumen } from "../actions";

export default function DokumenBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Upload Dokumen Publikasi</h1>
      <DokumenForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createDokumen(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
