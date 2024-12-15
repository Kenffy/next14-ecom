'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Package, PackagePlus } from "lucide-react";
import { ProductsTable } from "./products-table";
import { UpsertProduct } from "./admin-upsert-product";
import { CategoryModel, ProductModel } from "@/schemas/models";
import { adminProductStore, useAdminProductState } from "./admin-products-store";
import { CustomHero } from "@/components/CustomHero";

interface AdminProductProps {
  products: Array<ProductModel>;
  categories: Array<CategoryModel>;
}

export const AdminProducts: FC<AdminProductProps> = (props) => {
  const {products, categories} = props;
  const { isOpened } = useAdminProductState();

  useEffect(() => {
    console.log("effect called...")
    adminProductStore.initAdminProductSession({
      products: products,
      categories: categories,
    });
  }, [products, categories]);

  console.log(products)

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col gap-4">
        {isOpened ?
          <UpsertProduct />
          :
          <>
            <CustomHero
              title={
                <>
                  <Package size={26} strokeWidth={1.5} /> Products
                </>
              }
              actionTitle="Add Product"
              description="Manage products."
              actionDescription="Add a new product."
              actionIcon={<PackagePlus />}
              onClick={() => adminProductStore.addProduct()}
            >
            </CustomHero>
            <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
              <ProductsTable />
            </div>
          </>}
      </main>
    </ScrollArea>

  )
}
