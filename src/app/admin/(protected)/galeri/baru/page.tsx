import { GaleriForm } from "../galeri-form";
import { createGaleriFoto } from "../actions";

export default function GaleriBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Unggah Foto Galeri</h1>
      <GaleriForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createGaleriFoto(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
