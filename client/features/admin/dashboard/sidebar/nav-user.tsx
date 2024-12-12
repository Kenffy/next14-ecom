"use client";

import {
    BadgeCheck,
    Bell,
    ChevronRight,
    ChevronsUpDown,
    CircleUserRound,
    LayoutDashboard,
    ListChecks,
    LogIn,
    LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { signOut, useSession } from "next-auth/react";

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {session ?
                                <>
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={session.user?.image || "/images/default.png"} alt={session.user.name as string} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{session.user.name}</span>
                                        <span className="truncate text-xs">{session.user.email}</span>
                                    </div>
                                </>
                                :
                                <>
                                    <Avatar className="h-8 w-8 rounded-lg flex items-center justify-center">
                                        <CircleUserRound className="h-6 w-6" />
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="text-xs">Sign in for more features</span>
                                    </div>
                                </>
                            }
                            <ChevronRight className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                {session ?
                                    <>
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={session.user.image || "/images/default.png"} alt={session.user.name as string} />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{session.user.name}</span>
                                            <span className="truncate text-xs">{session.user.email}</span>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Avatar className="h-8 w-8 rounded-lg flex items-center justify-center">
                                            <CircleUserRound className="h-6 w-6" />
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="text-xs">Sign in for more features</span>
                                        </div>
                                    </>
                                }
                            </div>
                        </DropdownMenuLabel>
                        {session && <DropdownMenuSeparator />}
                        <DropdownMenuGroup>
                            {session?.user.isAdmin &&
                                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                    <LayoutDashboard />
                                    Dashboard
                                </DropdownMenuItem>
                            }
                            {session &&
                                <>
                                    <DropdownMenuItem onClick={() => router.push("/account")}>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ListChecks />
                                        My Orders
                                    </DropdownMenuItem>
                                </>}
                            {/* <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium leading-none">
                                    Switch themes
                                </p>
                                <ThemeToggle />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {session ?
                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                            :
                            <DropdownMenuItem onClick={() => router.push('/login')}>
                                <LogIn />
                                Login
                            </DropdownMenuItem>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
