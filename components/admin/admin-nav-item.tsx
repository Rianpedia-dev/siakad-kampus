"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface AdminNavItemProps {
  href: string;
  title: string;
  description: string;
}

export function AdminNavItem({ href, title, description }: AdminNavItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname.startsWith(href) && href !== "/admin");

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-xl border border-transparent bg-sidebar-accent px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10",
        isActive &&
          "border-primary bg-primary/10 text-primary backdrop-blur-sm shadow-sm",
      )}
    >
      <p className={cn("font-semibold text-sidebar-foreground", isActive && "text-primary")}>
        {title}
      </p>
      <p className="text-xs text-sidebar-accent-foreground group-hover:text-sidebar-foreground">
        {description}
      </p>
    </Link>
  );
}



