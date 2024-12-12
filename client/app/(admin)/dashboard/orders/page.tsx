// import { DisplayError } from "@/components/ui/error/display-error";
// import { AdminCategories } from "@/features/admin/dashboard/categories/admin-categories";
// import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { AdminOrders } from "@/features/admin/dashboard/orders/admin-orders";

export const metadata = {
    title: "Admin Orders",
    description: "Admin Orders Page",
};


export default async function AdminOrdersPage() {

    // const [ordersResponse] = await Promise.all([
    //     GetOrdersAsync(),
    // ]);

    // if (ordersResponse.status !== "OK") {
    //     return <DisplayError errors={ordersResponse.errors} />;
    // }

    return (
        <AdminOrders />
    )
}