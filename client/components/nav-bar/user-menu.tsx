"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CircleUserRound, LogIn, LogOut, LucideProps } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const menuIconProps: LucideProps = {
  size: 24,
  strokeWidth: 1.6,
};

export const UserMenu = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.back();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session?.user?.image ? (
          <Avatar className="">
            <AvatarImage
              src={session?.user?.image!}
              alt={session?.user?.name!}
            />
          </Avatar>
        ) : (
          <CircleUserRound {...menuIconProps} role="button" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {session && 
        <>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.isAdmin ? "Admin" : ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={()=> router.push('/profile')}>
          <span>Profile Settings</span>
        </DropdownMenuItem>
        </>
        }
        {session?.user.isAdmin &&
        <DropdownMenuItem onClick={()=> router.push('/dashboard')}>
          <span>Admin Dashboard</span>
        </DropdownMenuItem>
        }
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">Switch themes</p>
            <ThemeToggle />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!session ?
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => router.push('/login')}
        >
          <LogIn {...menuIconProps} size={18} />
          <span>Login</span>
        </DropdownMenuItem>
        :
        <DropdownMenuItem
          className="flex gap-2"
          //onClick={() => signOut({ callbackUrl: "/" })}
          onClick={handleSignOut}
        >
          <LogOut {...menuIconProps} size={18} />
          <span>Log out</span>
        </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
