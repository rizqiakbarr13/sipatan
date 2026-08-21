import { UserForm } from "../user-form";
import { createUser } from "../actions";

export default function UserBaruPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900">Tambah User Admin</h1>
      <UserForm
        action={async (_prevState, formData) => {
          "use server";
          const result = await createUser(formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
