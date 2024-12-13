"use client";

import React from "react";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import NavMenu from "./nav-menu";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme } = useTheme();
  return (
    <div className=" w-full h-[70px] border-b flex justify-center fixed z-50 bg-background">
      <div className=" w-full px-8 mx-auto flex items-center justify-between">
        <Link href="/dashboard" className=" flex items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center">
            <Image
              src={
                theme == "dark" ? "/images/logo-white.png" : "/images/logo.png"
              }
              alt="temosco logo"
              width={30}
              height={30}
              className="h-full w-full object-contain object-center"
            />
          </div>
          <h1 className="text-xl ml-1 font-semibold">
            TemoSco
          </h1>
        </Link>
        <NavMenu />
        <div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
