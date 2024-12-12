"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import React, { FC } from 'react';

interface HeaderProps { }

export const AdminHeader: FC<HeaderProps> = (props) => {
    const path = usePathname();
    const pathSegments = path.split('/').filter(segment => segment);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((segment, index) => {
                            const isLast = index === pathSegments.length - 1;
                            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem className="hidden md:block">
                                        {isLast ?
                                            <BreadcrumbPage className='capitalize'>{segment}</BreadcrumbPage>
                                            :
                                            <BreadcrumbLink className='capitalize' href={href}>
                                                {segment}
                                            </BreadcrumbLink>
                                        }
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
        // <header className="flex h-16 shrink-0 items-center gap-2 p-2 border-b">
        //     <div className="flex items-center gap-2 px-4">
        //         <SidebarTrigger className="-ml-1" />
        //         <Separator orientation="vertical" className="mr-2 h-8" />
        //         <div className="flex items-center gap-3">
        //             {path}
        //         </div>
        //     </div>
        // </header>
    )
}
