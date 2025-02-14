"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Package, PackagePlus } from "lucide-react";
import {
  CategoryModel,
  FileModel,
  ProductModel,
  VariantModel,
} from "@/schemas/models";
import { adminListingStore } from "./products-listing-store";
import { UpsertProductVariant } from "./upsert-product-variant";
import { ProductListingTable } from "./products-listing-table";
import { AdminProductGallery } from "./products-listing-gallery";
import { ImageSlider } from "./products-images-slider";
import Image from "next/image";
import { CustomHero } from "@/components/CustomHero";
import { GetProductCategoryNamesByIds } from "@/features/common/util";

interface AdminProductListingProps {
  product: ProductModel;
  productVariants: Array<VariantModel>;
  categories: Array<CategoryModel>;
}

export const AdminProductListing: FC<AdminProductListingProps> = (props) => {
  const { product, productVariants, categories } = props;
  const productImages: Array<FileModel> = [];

  useEffect(() => {
    adminListingStore.initAdminListingSession({
      product: product,
      productVariants: productVariants,
      categories: categories,
    });
  }, [product, productVariants, categories]);

  let totalOfItems = 0;
  product.images && productImages.push(...product.images);
  productVariants.forEach((variant) => {
    productImages.push(...variant.images!);
    totalOfItems += variant.inventory.quantity;
  });

  const productImageUrl =
    product && product.defaultImage
      ? product.defaultImage
      : "/images/products/product-default.png";
  const productCategories = GetProductCategoryNamesByIds(
    product.categories,
    adminListingStore.categories
  );

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col gap-4">
        <CustomHero
          title={
            <>
              <Package size={26} strokeWidth={1.5} className="flex-none"/> {product.name}
            </>
          }
          actionTitle="Add Product Variant"
          description=""
          actionDescription="Add a new product variant."
          actionIcon={<PackagePlus />}
          onClick={() => adminListingStore.addProductVariant()}
        ></CustomHero>
        <div className="container max-w-5xl py-6 px-4 md:px-8 mx-auto">
          <div className="flex flex-none gap-4">
            <div className="w-60 h-64 flex-none overflow-hidden rounded-sm bg-muted/50">
              <Image
                src={productImageUrl}
                alt={product.name}
                height={150}
                width={150}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-grow rounded-sm bg-muted/50 p-4">
              <div className="flex flex-col gap-2">
                <div className="w-full flex flex-col gap-2">
                  <span className="font-semibold">Description:</span>
                  <p>{product.description}</p>
                </div>
                {product?.brand && (
                  <div className="w-full flex items-center gap-2">
                    <span className="font-semibold">Brand:</span>
                    <p>{product.brand}</p>
                  </div>
                )}
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Category:</span>
                  <p>{productCategories.join(", ")}</p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Default Price:</span>
                  <p>{product.price}€</p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Total of items:</span>
                  <p>
                    {totalOfItems == 0
                      ? product.inventory?.quantity
                      : totalOfItems}
                  </p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Stock Status:</span>
                  <p>{product.inventory?.status}</p>
                </div>
                {product.dimensions && (
                  <div className="w-full flex items-center gap-2">
                    <span className="font-semibold">Dimensions:</span>
                    <p>
                      {product.dimensions?.length} x {product.dimensions?.width}{" "}
                      x {product.dimensions?.height} Cm
                    </p>
                  </div>
                )}
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Material:</span>
                  <p>{product.material}</p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Type:</span>
                  <p>{product.type}</p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Personalisable:</span>
                  <p>{product.personalisable ? "Yes" : "No"}</p>
                </div>
                <div className="w-full flex items-center gap-2">
                  <span className="font-semibold">Rating:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {product.type === "variable" && productVariants.length > 0 && (
          <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
            <ProductListingTable />
          </div>
        )}
        <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
            <AdminProductGallery images={productImages} />
            {/* <ImageSlider images={productImages} /> */}
        </div>
        <UpsertProductVariant />
      </main>
    </ScrollArea>
  );
};
