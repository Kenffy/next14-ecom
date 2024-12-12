'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Hero } from "@/components/ui/hero";
import { Users } from "lucide-react";

import { UsersTable } from "./users-table";
import { UserModel } from "@/schemas/models";
import { adminUserStore } from "./admin-users-store";

interface AdminProductProps {
  users: Array<UserModel>;
}

export const AdminUsers: FC<AdminProductProps> = (props) => {

  useEffect(() => {
    adminUserStore.initAdminUserSession({
      users: props.users,
    });
  }, [props.users]);

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <Hero
          title={
            <>
              <Users size={26} strokeWidth={1.5} /> Users
            </>
          }
          description={"Manage users."}
        >
        </Hero>
        <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
          <UsersTable />
        </div>
      </main>
    </ScrollArea>

  )
}
