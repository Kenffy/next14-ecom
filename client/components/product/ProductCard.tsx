
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Rating from "../Rating";
import { Card } from "../ui/card";
import { BaseProductModel } from "@/schemas/models";

export default function ProductCard({ product }: { product: BaseProductModel }) {

  const productImageUrl: string = product.defaultImage ? product.defaultImage : "/images/products/product-default.png";
  const discountPrice = product.discount ? product.price - (product.price*product.discount/100) : 0;
  return (
    <Link href={`/shop/${product.slug}`}>
      <Card className=" flex flex-col hover:scale-[1.02] duration-100 rounded-md overflow-hidden">
        <Image
          src={productImageUrl}
          alt={product.slug as string}
          width={180}
          height={180}
          className="w-full h-44 md:h-64 object-cover object-center cursor-pointer"
        />
        <div className="flex flex-col p-2">
          <h2 className=" text-sm md:text-base font-semibold line-clamp-2">
            {product.name}
          </h2>
          <div className=" py-1 flex items-center gap-2">
            <Rating value={product?.rating as number} />
            {(product?.discount && product.discount > 0) &&
            <span className="bg-red-100 text-red-600 px-2 rounded-full text-xs">
              -{product.discount}%
            </span>}
          </div>
          <div className="flex items-center gap-2">
            <span className=" font-semibold">
              €{discountPrice ? discountPrice : product.price}
            </span>
            {(product?.discount && product.discount > 0)  && (
              <span className=" line-through text-xs">€{product.price}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
