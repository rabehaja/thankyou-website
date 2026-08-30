"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  EnvelopeIcon,
  GearIcon,
  HomeIcon,
  LogoutIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { signOut } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon, exact: true },
  { href: "/admin/guests", label: "Guest List", icon: UsersIcon, exact: false },
  { href: "/admin/cards", label: "Thank You Cards", icon: EnvelopeIcon, exact: false, hot: true },
  { href: "/admin/settings", label: "Settings", icon: GearIcon, exact: false },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-ink text-white">
      <Link href="/admin" className="px-6 pb-4 pt-7">
        <span className="text-h1 text-[30px] text-white">Ever After</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1.5 px-4">
        {navItems.map(({ href, label, icon: Icon, exact, ...item }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-input px-4 py-2.5 text-[14px] transition-colors",
                active
                  ? "bg-terracotta text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {"hot" in item && item.hot ? (
                <Badge variant="hot" className="px-2 py-0.5 text-[10px] tracking-[1px]">
                  HOT
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <form action={signOut} className="px-4 pb-6">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center gap-3 rounded-input px-4 py-2.5 text-[14px] text-white/65 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogoutIcon size={17} />
          Sign Out
        </button>
      </form>
    </aside>
  );
}
