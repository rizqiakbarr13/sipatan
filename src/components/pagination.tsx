import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function buildHref(basePath: string, params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params);
  if (page > 1) {
    next.set("page", String(page));
  } else {
    next.delete("page");
  }
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageWindow(current: number, total: number): (number | "…")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== "page" && value) params.set(key, value);
  }

  const linkClass = (active: boolean, disabled?: boolean) =>
    cn(
      "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-medium transition",
      disabled
        ? "pointer-events-none border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
        : active
          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
          : "border-zinc-300 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800"
    );

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <Link
        href={buildHref(basePath, params, Math.max(1, currentPage - 1))}
        className={linkClass(false, currentPage === 1)}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pageWindow(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-zinc-400">
            …
          </span>
        ) : (
          <Link key={p} href={buildHref(basePath, params, p)} className={linkClass(p === currentPage)}>
            {p}
          </Link>
        )
      )}
      <Link
        href={buildHref(basePath, params, Math.min(totalPages, currentPage + 1))}
        className={linkClass(false, currentPage === totalPages)}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

export function resolvePage(pageParam: string | undefined): number {
  const n = Number(pageParam);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}
