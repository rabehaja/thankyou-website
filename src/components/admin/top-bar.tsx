"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Avatar } from "@/components/ui/avatar";
import { BellIcon } from "@/components/ui/icons";

const sectionLabels: Record<string, string> = {
  guests: "Guests",
  cards: "Thank You Cards",
  settings: "Settings",
  new: "New",
  edit: "Edit",
  "kitchen-sink": "Kitchen Sink",
};

export function TopBar({ coupleNames }: { coupleNames: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "admin"

  const crumbs = [{ label: "Ever After", href: "/admin" }];
  let path = "/admin";
  for (const segment of segments) {
    path += `/${segment}`;
    crumbs.push({ label: sectionLabels[segment] ?? "Detail", href: path });
  }

  return (
    <header className="flex items-center justify-between border-b border-border-neutral bg-white px-8 py-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[14px]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              {index > 0 ? <span className="text-light-gray">/</span> : null}
              {isLast ? (
                <span className="font-medium text-terracotta">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-muted transition-colors hover:text-ink">
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
      <div className="flex items-center gap-4">
        <BellIcon size={19} className="text-muted" />
        <Avatar name={coupleNames} size="sm" />
      </div>
    </header>
  );
}
