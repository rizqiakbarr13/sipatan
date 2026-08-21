import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserForm } from "../user-form";
import { updateUser } from "../actions";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit User: {user.nama}</h1>
      <UserForm
        user={user}
        action={async (_prevState, formData) => {
          "use server";
          const result = await updateUser(id, formData);
          return result ?? {};
        }}
      />
    </div>
  );
}
