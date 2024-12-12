import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { Dashboard } from "@/features/admin/dashboard/dashboard";
import { GetAllProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { GetAllUsersAsync } from "@/features/auth-page/auth-service";


export const metadata = {
    title: "Admin Dashboard",
    description: "Admin Dashboard Page",
};


export default async function AdminDashboard() {

    const [usersResponse, productResponse, categoryResponse] = await Promise.all([
        GetAllUsersAsync(),
        GetAllProductsAsync(),
        GetCategoriesAsync(),
    ]);

    if (usersResponse.status !== "OK") {
        return <DisplayError errors={usersResponse.errors} />;
    }

    if (productResponse.status !== "OK") {
        return <DisplayError errors={productResponse.errors} />;
    }

    if (categoryResponse.status !== "OK") {
        return <DisplayError errors={categoryResponse.errors} />;
    }

    return (
        <Dashboard
            users={usersResponse.response}
            products={productResponse.response}
            categories={categoryResponse.response} />
    )
}