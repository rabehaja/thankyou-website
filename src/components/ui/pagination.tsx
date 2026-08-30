import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  itemLabel: string;
  /** Builds the href for a given page, keeping other params intact. */
  hrefForPage: (page: number) => string;
}

const boxClasses =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-input border px-2.5 text-sm transition-colors";

function windowedPages(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const wanted = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (wanted.has(p)) pages.push(p);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }
  return pages;
}

export function Pagination({ page, pageSize, totalCount, itemLabel, hrefForPage }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const pages = windowedPages(page, totalPages);

  const disabledClasses = "pointer-events-none border-border-neutral text-light-gray";
  const enabledClasses = "border-border-neutral text-ink hover:border-terracotta hover:text-terracotta";

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Showing {from}-{to} of {totalCount} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1 || undefined}
          tabIndex={page <= 1 ? -1 : undefined}
          href={hrefForPage(page - 1)}
          className={cn(boxClasses, page <= 1 ? disabledClasses : enabledClasses)}
        >
          Prev
        </Link>
        {pages.map((p, index) =>
          p === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-muted">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefForPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                boxClasses,
                p === page
                  ? "border-terracotta bg-terracotta text-white"
                  : enabledClasses,
              )}
            >
              {p}
            </Link>
          ),
        )}
        <Link
          aria-disabled={page >= totalPages || undefined}
          tabIndex={page >= totalPages ? -1 : undefined}
          href={hrefForPage(page + 1)}
          className={cn(boxClasses, page >= totalPages ? disabledClasses : enabledClasses)}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}
