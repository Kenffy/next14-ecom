"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface NavMenuLinkProps {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}

export const NavMenuLink: FC<NavMenuLinkProps> = (props) => {
  const path = usePathname();
  return (
    <Link
      className={cn("text-lg px-2 text-muted-foreground",
        path === props.href ? " font-semibold text-foreground" : ""
      )}
      href={props.href}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </Link>
  );
};
