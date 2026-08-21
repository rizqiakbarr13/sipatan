import { getActiveProject } from "@/lib/project";
import { ProyekForm } from "./proyek-form";

export const dynamic = "force-dynamic";

export default async function AdminProyekPage() {
  const project = await getActiveProject();

  if (!project) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada proyek yang dibuat.</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Kelola Proyek</h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Atur metadata proyek dan jadwal masa sanggah.
      </p>
      <ProyekForm project={project} />
    </div>
  );
}
