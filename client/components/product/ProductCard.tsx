
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Rating from "../Rating";
import { Card } from "../ui/card";
import { ProductModel } from "@/schemas/models";

export default function ProductCard({ product }: { product: ProductModel }) {

  const productImageUrl: string = product.defaultImage ? product.defaultImage : "/images/products/product-default.png";
  return (
    <Link href={`/product/${product.slug}`}>
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
          <div className=" py-1">
            <Rating value={product.rating as number} />
          </div>
          <div className="flex items-center gap-2">
            <span className=" font-semibold">
              €{product?.discount ? product.discount : product.price}
            </span>
            {product?.discount && (
              <span className=" line-through text-xs">€{product.price}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
