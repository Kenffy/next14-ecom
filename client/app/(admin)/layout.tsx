
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/dashboard/sidebar/sidebar";
import { AdminHeader } from "@/features/admin/header/header";
import { AuthenticatedProviders } from "@/features/globals/providers";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Temosco Dashboard",
    description: "Temosco Dashboard",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthenticatedProviders>
            <div className={cn("flex flex-1 items-stretch min-h-screen")}>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex-1 flex flex-col p-2">
                        <>
                            <AdminHeader />
                            {children}
                        </>
                    </div>
                </SidebarProvider>
            </div>
        </AuthenticatedProviders>
    )
}