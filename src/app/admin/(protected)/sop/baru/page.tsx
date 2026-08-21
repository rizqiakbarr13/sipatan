import { SopForm } from "../sop-form";
import { createSop } from "../actions";

export default function SopBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Tambah SOP</h1>
      <SopForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createSop(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
