import { DisplayError } from "@/components/ui/error/display-error";
import { GetCategoriesAsync } from "@/features/admin/dashboard/categories/category-service";
import { GetBaseProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { CartPage } from "@/features/client/cart-page/cart-page";
import { ShopPage } from "@/features/client/shop-page/shop-page";
import { BaseProductModel, CategoryModel } from "@/schemas/models";
import React from "react";

export const metadata = {
  title: "TemosCo Cart",
  description: "TemosCo Cart Page",
};

export default async function Cart() {


  return (
    <main className="flex min-h-screen">
      <CartPage />
    </main>
  );
}
