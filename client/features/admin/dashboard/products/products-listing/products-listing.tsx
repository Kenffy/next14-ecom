'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { FC, useEffect } from "react";
import { Hero, HeroButton } from "@/components/ui/hero";
import { Package, PackagePlus } from "lucide-react";
import { FileModel, ProductModel, ProductVariantModel } from "@/schemas/models";
import { adminProductListingStore } from "./products-listing-store";
import { UpsertProductVariant } from "./upsert-product-variant";
import { ProductListingTable } from "./products-listing-table";
import { AdminProductGallery } from "./products-listing-gallery";
import { ImageSlider } from "./products-images-slider";
import Image from "next/image";
import { CustomHero } from "@/components/CustomHero";

interface AdminProductListingProps {
    product: ProductModel;
    productVariants: Array<ProductVariantModel>;
}

export const AdminProductListing: FC<AdminProductListingProps> = (props) => {
    const { product, productVariants } = props;
    const productImages: Array<FileModel> = [];

    useEffect(() => {
        adminProductListingStore.initAdminProductVariantSession({
            product: product,
            productVariants: productVariants,
        });
    }, [product, productVariants]);

    let totalOfItems = 0
    productVariants.forEach(variant => {
        productImages.push(...variant.images!);
        totalOfItems += variant.quantity;
    });

    const productImageUrl = product && product.defaultImage ? product.defaultImage : "/images/products/product-default.png";

    return (
        <ScrollArea className="flex-1">
            <main className="flex flex-1 flex-col gap-4">
                <CustomHero
                    title={
                        <>
                            <Package size={26} strokeWidth={1.5} /> {product.name}
                        </>
                    }
                    actionTitle="Add Product Variant"
                    description=""
                    actionDescription="Add a new product variant."
                    actionIcon={<PackagePlus />}
                    onClick={() => adminProductListingStore.addProductVariant()}
                >
                </CustomHero>
                <div className="container max-w-5xl py-6 px-4 md:px-8 mx-auto">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid-cols-1 w-3/4 h-60 overflow-hidden rounded-sm bg-muted/50">
                            <Image src={productImageUrl} alt={product.name} height={150} width={150} className="h-full w-full object-cover" />
                        </div>
                        <div className="grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Description:</span>
                                    <p>{product.desc}</p>
                                </div>
                                {product?.brand && <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Brand:</span>
                                    <p>{product.brand}</p>
                                </div>}
                                <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Category:</span>
                                    <p>{product.category}</p>
                                </div>
                                <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Default Price:</span>
                                    <p>{product.price}€</p>
                                </div>
                                <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Total of items:</span>
                                    <p>{totalOfItems}</p>
                                </div>
                                {product.dimensions &&
                                    <div className="w-full flex items-center gap-2">
                                        <span className="font-semibold">Dimensions:</span>
                                        <p>{product.dimensions?.length} x {product.dimensions?.width} x {product.dimensions?.height} Cm</p>
                                    </div>
                                }
                                <div className="w-full flex items-center gap-2">
                                    <span className="font-semibold">Material:</span>
                                    <p>{product.material}</p>
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
                <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
                    <ProductListingTable />
                </div>
                <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
                    <AdminProductGallery images={productImages} />
                    {/* <ImageSlider images={productImages} /> */}
                </div>
                <UpsertProductVariant />
            </main>
        </ScrollArea>

    )
}
