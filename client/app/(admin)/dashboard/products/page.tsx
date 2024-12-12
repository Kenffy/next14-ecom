import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { AdminProducts } from "@/features/admin/dashboard/products/admin-products";
import { GetAllProductsAsync } from "@/features/admin/dashboard/products/product-service";

export const metadata = {
    title: "Admin Products",
    description: "Admin Products Page",
};


export default async function AdminProductsPage() {

    const [productResponse, categoryResponse] = await Promise.all([
        GetAllProductsAsync({ isDeleted: false }),
        GetCategoriesAsync(),
    ]);

    if (productResponse.status !== "OK") {
        return <DisplayError errors={productResponse.errors} />;
    }

    if (categoryResponse.status !== "OK") {
        return <DisplayError errors={categoryResponse.errors} />;
    }

    return (
        <AdminProducts
            products={productResponse.response}
            categories={categoryResponse.response} />
    )
}