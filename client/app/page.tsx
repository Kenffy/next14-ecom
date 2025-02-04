import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { GetBaseFeaturedProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { HomePage } from "@/features/home/home-page";

export const metadata = {
  title: "TemosCo Home",
  description: "TemosCo Home Page",
};

export default async function Home() {
  const [productResponse, categoryResponse] = await Promise.all([
    GetBaseFeaturedProductsAsync(),
    GetCategoriesAsync(),
  ]);

  if (productResponse.status !== "OK") {
    return <DisplayError errors={productResponse.errors} />;
  }

  if (categoryResponse.status !== "OK") {
    return <DisplayError errors={categoryResponse.errors} />;
  }

  return (
    <main className="flex min-h-screen">
      <HomePage
        products={[...productResponse.response]}
        categories={categoryResponse.response}
      />
    </main>
  );
}
