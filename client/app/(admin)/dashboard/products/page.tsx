import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { AdminProducts } from "@/features/admin/dashboard/products/admin-products";
import {
  GetAllProductsAsync,
  UploadHealthCheckAsync,
} from "@/features/admin/dashboard/products/product-service";

export const metadata = {
  title: "Admin Products",
  description: "Admin Products Page",
};

export default async function AdminProductsPage() {
  const [productResponse, categoryResponse, uploadService] = await Promise.all([
    GetAllProductsAsync({ deleted: false }),
    GetCategoriesAsync(),
    UploadHealthCheckAsync(),
  ]);

  if (productResponse.status !== "OK") {
    return <DisplayError errors={productResponse.errors} />;
  }

  if (categoryResponse.status !== "OK") {
    return <DisplayError errors={categoryResponse.errors} />;
  }

  if (uploadService.status !== "OK") {
    return <DisplayError errors={uploadService.errors} />;
  }

  return (
    <AdminProducts
      products={productResponse.response}
      categories={categoryResponse.response}
    />
  );
}
