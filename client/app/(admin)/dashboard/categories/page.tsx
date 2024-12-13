import { DisplayError } from "@/components/ui/error/display-error";
import { AdminCategories } from "@/features/admin/dashboard/categories/admin-categories";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";

export const metadata = {
    title: "Admin Categories",
    description: "Admin Categories Page",
};


export default async function AdminCategoriesPage() {

    const [categoryResponse] = await Promise.all([
        GetCategoriesAsync(),
    ]);

    if (categoryResponse.status !== "OK") {
        return <DisplayError errors={categoryResponse.errors} />;
    }

    return (
        <AdminCategories categories={categoryResponse.response} />
    )
}