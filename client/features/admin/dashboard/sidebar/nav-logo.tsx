"use client"

import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function NavLogo() {
    const { theme } = useTheme();
    const { state } = useSidebar();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className='h-16 flex items-center justify-between gap-2'>
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

                        {state === "expanded" &&
                            <h1 className="text-xl ml-1 font-semibold">
                                TemoSco
                            </h1>
                        }
                    </Link>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
