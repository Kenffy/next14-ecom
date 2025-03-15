import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { GetBaseProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { CheckoutPage } from "@/features/client/checkout-page/checkout-page";

export const metadata = {
  title: "TemosCo Checkout",
  description: "TemosCo Checkout Page",
};

export default async function Checkout() {
  // const [paginationResponse, categoryResponse] = await Promise.all([
  //   GetBaseProductsAsync(filters),
  //   GetCategoriesAsync(),
  // ]);

  // if (paginationResponse.status !== "OK") {
  //   return <DisplayError errors={paginationResponse.errors} />;
  // }

  // if (categoryResponse.status !== "OK") {
  //   return <DisplayError errors={categoryResponse.errors} />;
  // }

  return (
    <main className="flex min-h-screen">
      <CheckoutPage />
    </main>
  );
}
