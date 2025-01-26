import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { GetBaseProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { ShopPage } from "@/features/client/shop-page/shop-page";
import { BaseProductModel, CategoryModel } from "@/schemas/models";
import React from "react";

export const metadata = {
  title: "TemosCo Shop",
  description: "TemosCo Shop Page",
};

export default async function Shop() {
  const [productResponse, categoryResponse] = await Promise.all([
    GetBaseProductsAsync(),
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
      <ShopPage
        products={[...productResponse.response] as Array<BaseProductModel>}
        categories={[...categoryResponse.response] as Array<CategoryModel>}
      />
    </main>
  );
}
