"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { Boxes, LayoutDashboard, Monitor, Package, Settings, Users, House, ShoppingBag, ListChecks } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainLinks = [
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Boxes,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ListChecks,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   url: "/dashboard/settings",
  //   icon: Settings,
  // },
]

const OtherLinks = [
  {
    title: "Home",
    url: "/",
    icon: House,
  },
  {
    title: "Shop",
    url: "/shop",
    icon: ShoppingBag,
  },
]


export function NavMain() {
  const path = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={"/dashboard"} className="flex items-center h-full cursor-pointer">
            <SidebarMenuButton tooltip={"Dashboard"} className={cn("", path === "/dashboard" ? "bg-secondary" : "")}>
              <LayoutDashboard className=" cursor-pointer" />
              <span>{"Dashboard"}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel>Lists</SidebarGroupLabel>
      <SidebarMenu>
        {MainLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url} className="flex items-center h-full cursor-pointer">
              <SidebarMenuButton tooltip={item.title} className={cn("", path === item.url ? "bg-secondary" : "")}>
                {item.icon && <item.icon className=" cursor-pointer" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        {OtherLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url} className="flex items-center h-full cursor-pointer">
              <SidebarMenuButton tooltip={item.title} className={cn("", path === item.url ? "bg-secondary" : "")}>
                {item.icon && <item.icon className=" cursor-pointer" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
