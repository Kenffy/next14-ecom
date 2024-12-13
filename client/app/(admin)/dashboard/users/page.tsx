import { DisplayError } from "@/components/ui/error/display-error";
import { AdminUsers } from "@/features/admin/dashboard/users/admin-users";
import { GetAllUsersAsync } from "@/features/auth-page/auth-service";

export const metadata = {
    title: "Admin Users",
    description: "Admin Users Page",
};


export default async function AdminUsersPage() {

    const [usersResponse] = await Promise.all([
        GetAllUsersAsync(),
    ]);

    if (usersResponse.status !== "OK") {
        return <DisplayError errors={usersResponse.errors} />;
    }

    return (
        <AdminUsers users={usersResponse.response} />
    )
}