import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ProjectFilterOption {
  id: string;
  namaProyek: string;
}

function buildHref(basePath: string, params: URLSearchParams, projectId: string | null): string {
  const next = new URLSearchParams(params);
  if (projectId) {
    next.set("proyek", projectId);
  } else {
    next.delete("proyek");
  }
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function ProjectFilterTabs({
  projects,
  activeProjectId,
  basePath,
  searchParams,
  semuaLabel,
}: {
  projects: ProjectFilterOption[];
  activeProjectId?: string;
  basePath: string;
  searchParams: Record<string, string | undefined>;
  semuaLabel: string;
}) {
  if (projects.length < 2) return null;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== "proyek" && value) params.set(key, value);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href={buildHref(basePath, params, null)}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
          !activeProjectId
            ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
            : "border-zinc-300 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
        )}
      >
        {semuaLabel}
      </Link>
      {projects.map((p) => (
        <Link
          key={p.id}
          href={buildHref(basePath, params, p.id)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
            activeProjectId === p.id
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-zinc-300 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
          )}
        >
          {p.namaProyek}
        </Link>
      ))}
    </div>
  );
}
